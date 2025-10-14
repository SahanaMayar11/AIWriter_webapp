'use server';

import {
  generateEssayOutline,
  type GenerateEssayOutlineInput,
} from '@/ai/flows/generate-essay-outline';
import { outlineFormSchema, saveDraftHistorySchema } from '@/lib/schemas';
import type { z } from 'zod';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSdks } from '@/firebase';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { FormState } from './outline-form';

export async function generateOutlineAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = outlineFormSchema.safeParse(
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
    const result = await generateEssayOutline(
      validatedFields.data as GenerateEssayOutlineInput
    );
    if (result.outline) {
      return { message: 'success', outline: result.outline, fields };
    } else {
      return {
        message:
          'Failed to generate outline. The AI model did not return an outline.',
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

export async function saveOutlineAction(
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
        }, { merge: true });
    
        return { message: 'success' };

    } catch (error) {
      console.error('Error saving outline:', error);
      return {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
