'use server';

import {
  checkGrammarAndStyle,
  type CheckGrammarAndStyleInput,
} from '@/ai/flows/check-grammar-and-style';
import { grammarCheckFormSchema, saveDraftHistorySchema } from '@/lib/schemas';
import type { z } from 'zod';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSdks } from '@/firebase';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

type FormState = {
  message: string;
  improvements?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function checkGrammarAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = grammarCheckFormSchema.safeParse(
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
    const result = await checkGrammarAndStyle(
      validatedFields.data as CheckGrammarAndStyleInput
    );
    if (result.improvements) {
      return { message: 'success', improvements: result.improvements, fields };
    } else {
      return {
        message:
          'Failed to get suggestions. The AI model did not return a result.',
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

export async function saveGrammarAction(
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
    
        await setDoc(docRef, {
          ...input,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
    
        return { message: 'success' };

    } catch (error) {
      console.error('Error saving grammar check:', error);
      return {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
