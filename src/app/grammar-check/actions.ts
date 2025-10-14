"use server";

import {
  checkGrammarAndStyle,
  type CheckGrammarAndStyleInput,
} from "@/ai/flows/check-grammar-and-style";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(20, "Text must be at least 20 characters long."),
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

  if (!validatedFields.success) {
    return {
      message: "Please check your input and try again.",
      fields: Object.fromEntries(formData.entries()),
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await checkGrammarAndStyle(
      validatedFields.data as CheckGrammarAndStyleInput
    );
    if (result.improvements) {
      return { message: "success", improvements: result.improvements };
    } else {
      return {
        message:
          "Failed to get suggestions. The AI model did not return a result.",
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
