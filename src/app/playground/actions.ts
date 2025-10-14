'use server';

import {
  generateEssayOutline
} from '@/ai/flows/generate-essay-outline';
import {
  generateArticleDraft
} from '@/ai/flows/generate-article-draft';
import {
  checkGrammarAndStyle
} from '@/ai/flows/check-grammar-and-style';
import {
    improveStyle,
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

  const validatedFields = playgroundFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    return {
      message: 'Please check your input and try again.',
      fields,
      action,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }
  
  const { topic, tone, purpose, content } = validatedFields.data;

  try {
    let result: { [key: string]: any } | null = null;
    let resultKey: string = '';

    if (action === 'outline') {
      result = await generateEssayOutline({
        topic: topic,
        tone: tone,
        language: 'english', 
        wordLimit: 1000, 
      });
      resultKey = 'outline';
    } else if (action === 'draft') {
      result = await generateArticleDraft({
        topic: topic,
        tone: tone,
        wordLimit: 1000,
      });
      resultKey = 'draft';
    } else if (action === 'grammar') {
      result = await checkGrammarAndStyle({ text: content || '' });
      resultKey = 'improvements';
    } else if (action === 'style') {
        result = await improveStyle({ text: content || '' });
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
