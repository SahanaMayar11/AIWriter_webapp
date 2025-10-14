"use server";

import {
  generateArticleDraft,
  type GenerateArticleDraftInput,
} from "@/ai/flows/generate-article-draft";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long."),
  tone: z.string(),
  wordLimit: z.coerce
    .number()
    .min(50, "Word limit must be at least 50.")
    .max(2000, "Word limit cannot exceed 2000."),
});

export type FormState = {
  message: string;
  draft?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateDraftAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Please check your input and try again.",
      fields: Object.fromEntries(formData.entries()),
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await generateArticleDraft(
      validatedFields.data as GenerateArticleDraftInput
    );
    if (result.draft) {
      return { message: "success", draft: result.draft };
    } else {
      return {
        message:
          "Failed to generate draft. The AI model did not return a result.",
      };
    }
  } catch (error) {
    return {
      message: `An unexpected error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
