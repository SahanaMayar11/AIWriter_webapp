'use server';

import {
  improveStyle,
  type ImproveStyleInput,
} from '@/ai/flows/improve-style';
import { improveStyleFormSchema, saveDraftHistorySchema } from '@/lib/schemas';
import type { z } from 'zod';
import { doc, serverTimestamp, setDoc, getFirestore } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

export async function improveStyleAction(
  prevState: any,
  formData: FormData
): Promise<any> {
  const validatedFields = improveStyleFormSchema.safeParse(
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
    const result = await improveStyle(
      validatedFields.data as ImproveStyleInput
    );
    if (result.improvedText) {
      return { message: 'success', improvedText: result.improvedText, fields };
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

export async function saveImprovementAction(
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
        const firestore = getFirestore();
        const docRef = doc(firestore, 'users', user.uid, 'draftHistories', Date.now().toString());
    
        await setDoc(docRef, {
          ...input,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
    
        return { message: 'success' };

    } catch (error) {
      console.error('Error saving style improvement:', error);
      return {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
