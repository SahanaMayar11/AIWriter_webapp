'use server';

/**
 * @fileOverview An AI agent for improving writing style.
 *
 * - improveStyle - A function that handles the style improvement process.
 * - ImproveStyleInput - The input type for the improveStyle function.
 * - ImproveStyleOutput - The return type for the improveStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveStyleInputSchema = z.object({
  text: z.string().describe('The text to improve.'),
});
export type ImproveStyleInput = z.infer<typeof ImproveStyleInputSchema>;

const ImproveStyleOutputSchema = z.object({
  improvedText: z
    .string()
    .describe('The improved version of the text.'),
});
export type ImproveStyleOutput = z.infer<typeof ImproveStyleOutputSchema>;

export async function improveStyle(
  input: ImproveStyleInput
): Promise<ImproveStyleOutput> {
  return improveStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveStylePrompt',
  input: {schema: ImproveStyleInputSchema},
  output: {schema: ImproveStyleOutputSchema},
  prompt: `You are an advanced AI Writing Assistant that helps users craft high-quality written content such as essays, articles, or blog posts.

  Your primary goal when performing the “Improve Style” function is to refine the text by enhancing vocabulary, flow, tone alignment, and sentence variation — make sure users can feel a clear difference between the original and improved versions.

  Review the following text and rewrite it to improve its style, clarity, and engagement.
  
  Do not provide a preamble or any explanation, just the improved text.

  Original Text: {{{text}}}

  Improved Text:`,
});

const improveStyleFlow = ai.defineFlow(
  {
    name: 'improveStyleFlow',
    inputSchema: ImproveStyleInputSchema,
    outputSchema: ImproveStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
