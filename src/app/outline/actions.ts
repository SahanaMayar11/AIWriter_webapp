"use server";

import {
  generateEssayOutline,
  type GenerateEssayOutlineInput,
} from "@/ai/flows/generate-essay-outline";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long."),
  tone: z.string(),
  wordLimit: z.coerce
    .number()
    .min(50, "Word limit must be at least 50.")
    .max(5000, "Word limit cannot exceed 5000."),
  language: z.string(),
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

  if (!validatedFields.success) {
    return {
      message: "Please check your input and try again.",
      fields: Object.fromEntries(formData.entries()),
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await generateEssayOutline(
      validatedFields.data as GenerateEssayOutlineInput
    );
    if (result.outline) {
      return { message: "success", outline: result.outline };
    } else {
      return {
        message:
          "Failed to generate outline. The AI model did not return an outline.",
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
