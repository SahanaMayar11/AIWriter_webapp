'use server';

import {
  checkGrammarAndStyle,
  type CheckGrammarAndStyleInput,
} from '@/ai/flows/check-grammar-and-style';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { adminApp } from '@/firebase/admin';
import { headers } from 'next/headers';


const schema = z.object({
  text: z.string().min(20, 'Text must be at least 20 characters long.'),
});

const saveSchema = z.object({
    topic: z.string(),
    content: z.string(),
    language: z.string(),
    type: z.enum(['Draft', 'Outline', 'Grammar Check'])
});

export type FormState = {
  message: string;
  improvements?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function checkGrammarAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse(
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
    input: z.infer<typeof saveSchema>
  ): Promise<{ message: string }> {
    const headersList = headers();
    const idToken = headersList.get('x-firebase-id-token');

    if (!idToken) {
        return { message: 'User not authenticated.' };
    }
  
    try {
        const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const db = getFirestore(adminApp);
        const docRef = db.collection('users').doc(userId).collection('draftHistories').doc();
    
        await docRef.set({
          ...input,
          userId,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
    
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
