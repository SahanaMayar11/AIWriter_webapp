'use server';

/**
 * @fileOverview A grammar and style checker AI agent.
 *
 * - checkGrammarAndStyle - A function that handles the grammar and style checking process.
 * - CheckGrammarAndStyleInput - The input type for the checkGrammarAndStyle function.
 * - CheckGrammarAndStyleOutput - The return type for the checkGrammarAndStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckGrammarAndStyleInputSchema = z.object({
  text: z.string().describe('The text to check for grammar and style.'),
});
export type CheckGrammarAndStyleInput = z.infer<typeof CheckGrammarAndStyleInputSchema>;

const CheckGrammarAndStyleOutputSchema = z.object({
  improvements: z
    .string()
    .describe('A list of suggested improvements to the text for grammar and style.'),
});
export type CheckGrammarAndStyleOutput = z.infer<typeof CheckGrammarAndStyleOutputSchema>;

export async function checkGrammarAndStyle(
  input: CheckGrammarAndStyleInput
): Promise<CheckGrammarAndStyleOutput> {
  return checkGrammarAndStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkGrammarAndStylePrompt',
  input: {schema: CheckGrammarAndStyleInputSchema},
  output: {schema: CheckGrammarAndStyleOutputSchema},
  prompt: `You are an advanced AI Writing Assistant that helps users craft high-quality written content such as essays, articles, or blog posts.

  Your goals are to:
  - Ensure grammar, clarity, and coherence are excellent.
  - Use concise yet expressive language suitable for the target audience.

  Review the following text and suggest improvements to grammar, style, and clarity. Provide specific suggestions and explain why they are needed. If there are no errors, simply say "No errors found."

  Format your response as a list of improvements. Each item in the list should be a distinct suggestion, formatted using simple markdown (e.g., headings, lists, bold text).

  Text: {{{text}}}`,
});

const checkGrammarAndStyleFlow = ai.defineFlow(
  {
    name: 'checkGrammarAndStyleFlow',
    inputSchema: CheckGrammarAndStyleInputSchema,
    outputSchema: CheckGrammarAndStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
