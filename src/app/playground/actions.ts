'use server';

import {
  generateEssayOutline,
  type GenerateEssayOutlineInput,
} from '@/ai/flows/generate-essay-outline';
import {
  generateArticleDraft,
  type GenerateArticleDraftInput,
} from '@/ai/flows/generate-article-draft';
import {
  checkGrammarAndStyle,
  type CheckGrammarAndStyleInput,
} from '@/ai/flows/check-grammar-and-style';
import {
    improveStyle,
    type ImproveStyleInput,
} from '@/ai/flows/improve-style';
import { playgroundFormSchema } from '@/lib/schemas';

type FormState = {
  message: string;
  result?: string;
  fields?: Record<string, string>;
  issues?: string[];
  action?: string;
};

export async function playgroundAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = Object.fromEntries(formData.entries());
  const action = fields.action as string;

  try {
    let result: { [key: string]: any } | null = null;
    let resultKey: string = '';

    if (action === 'outline') {
      const validatedFields = playgroundFormSchema.safeParse(fields);
       if (!validatedFields.success) {
        return {
          message: 'Please check your input and try again.',
          fields,
          action,
          issues: validatedFields.error.issues.map((issue) => issue.message),
        };
      }
      result = await generateEssayOutline({
        topic: validatedFields.data.topic,
        tone: validatedFields.data.tone,
        language: 'english', // Hardcoded for now
        wordLimit: 1000, // Hardcoded for now
      });
      resultKey = 'outline';
    } else if (action === 'draft') {
        const validatedFields = playgroundFormSchema.safeParse(fields);
        if (!validatedFields.success) {
         return {
           message: 'Please check your input and try again.',
           fields,
           action,
           issues: validatedFields.error.issues.map((issue) => issue.message),
         };
       }
      result = await generateArticleDraft({
        topic: validatedFields.data.topic,
        tone: validatedFields.data.tone,
        wordLimit: 1000, // Hardcoded for now
      });
      resultKey = 'draft';
    } else if (action === 'grammar') {
      result = await checkGrammarAndStyle({ text: fields.content as string });
      resultKey = 'improvements';
    } else if (action === 'style') {
        result = await improveStyle({ text: fields.content as string });
        resultKey = 'improvedText';
    }


    if (result && result[resultKey]) {
      return { message: 'success', result: result[resultKey], fields, action };
    } else {
      return {
        message: 'The AI model did not return a result.',
        fields,
        action,
      };
    }
  } catch (error) {
    return {
      message: `An unexpected error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
      fields,
      action
    };
  }
}
