'use server';

import {
  generateArticleDraft,
  type GenerateArticleDraftInput,
} from '@/ai/flows/generate-article-draft';
import { draftFormSchema, saveDraftHistorySchema } from '@/lib/schemas';
import type { z } from 'zod';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSdks } from '@/firebase';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

type FormState = {
  message: string;
  draft?: string;
  fields?: Record<string, string>;
  issues?: string[];
};


export async function generateDraftAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = draftFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  const fields = Object.fromEntries(formData.entries());

  if (!validatedFields.success) {
    return {
      message: 'Please check your input and try again.',
      fields: fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await generateArticleDraft(
      validatedFields.data as GenerateArticleDraftInput
    );
    if (result.draft) {
      return { message: 'success', draft: result.draft, fields };
    } else {
      return {
        message:
          'Failed to generate draft. The AI model did not return a result.',
        fields,
      };
    }
  } catch (error) {
    return {
      message: `An unexpected error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
      fields,
    };
  }
}

export async function saveDraftAction(
    input: z.infer<typeof saveDraftHistorySchema>
  ): Promise<{ message: string }> {
    const user = await getAuthenticatedUser();
    
    if (!user) {
        return { message: 'User not authenticated.' };
    }
  
    try {
        if (getApps().length === 0) {
            initializeApp(firebaseConfig);
        }
        const { firestore } = getSdks(getApps()[0]);
        const docRef = doc(firestore, 'users', user.uid, 'draftHistories', Date.now().toString());
    
        setDocumentNonBlocking(docRef, {
            ...input,
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            type: 'Draft',
        }, { merge: true });
    
        return { message: 'success' };

    } catch (error) {
      console.error('Error saving draft:', error);
      return {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
