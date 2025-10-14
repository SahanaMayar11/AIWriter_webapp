'use server';

import {
  generateEssayOutline,
  type GenerateEssayOutlineInput,
} from '@/ai/flows/generate-essay-outline';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { adminApp } from '@/firebase/admin';
import { headers } from 'next/headers';

const schema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters long.'),
  tone: z.string(),
  wordLimit: z.coerce
    .number()
    .min(50, 'Word limit must be at least 50.')
    .max(5000, 'Word limit cannot exceed 5000.'),
  language: z.string(),
});

const saveSchema = z.object({
    topic: z.string(),
    content: z.string(),
    language: z.string(),
    type: z.enum(['Draft', 'Outline', 'Grammar Check'])
});

export type FormState = {
  message: string;
  outline?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateOutlineAction(
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
      console.error('Error saving outline:', error);
      return {
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
