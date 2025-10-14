'use server';

import {
  generateEssayOutline,
  type GenerateEssayOutlineInput,
} from '@/ai/flows/generate-essay-outline';
import { outlineFormSchema } from '@/lib/schemas';

type FormState = {
  message: string;
  outline?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

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
