'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating article drafts based on user-provided topic, tone, and word limit.
 *
 * - generateArticleDraft - An asynchronous function that takes user input and returns an article draft.
 * - GenerateArticleDraftInput - The input type for the generateArticleDraft function.
 * - GenerateArticleDraftOutput - The output type for the generateArticleDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleDraftInputSchema = z.object({
  topic: z.string().describe('The topic of the article.'),
  tone: z.string().describe('The tone of the article (e.g., academic, casual, formal, persuasive).'),
  wordLimit: z.number().describe('The desired word limit for the article.'),
  outline: z.string().optional().describe('An optional outline to structure the article.'),
  language: z.string().optional().describe('The language of the article (e.g., English, Hindi, Tamil).'),
});

export type GenerateArticleDraftInput = z.infer<typeof GenerateArticleDraftInputSchema>;

const GenerateArticleDraftOutputSchema = z.object({
  draft: z.string().describe('The generated article draft.'),
});

export type GenerateArticleDraftOutput = z.infer<typeof GenerateArticleDraftOutputSchema>;

export async function generateArticleDraft(input: GenerateArticleDraftInput): Promise<GenerateArticleDraftOutput> {
  return generateArticleDraftFlow(input);
}

const generateArticleDraftPrompt = ai.definePrompt({
  name: 'generateArticleDraftPrompt',
  input: {schema: GenerateArticleDraftInputSchema},
  output: {schema: GenerateArticleDraftOutputSchema},
  prompt: `You are an AI writing assistant that helps users generate article drafts.

  Based on the user's input, generate an article draft with the specified topic, tone, word limit, and language.
  {{#if outline}}
  Use the following outline to structure the article:
  {{{outline}}}
  {{/if}}

  Format your response using simple markdown, such as headings, lists, and bold text.

  Topic: {{{topic}}}
  Tone: {{{tone}}}
  Word Limit: {{{wordLimit}}}
  Language: {{{language}}}

  Article Draft:`,
});

const generateArticleDraftFlow = ai.defineFlow(
  {
    name: 'generateArticleDraftFlow',
    inputSchema: GenerateArticleDraftInputSchema,
    outputSchema: GenerateArticleDraftOutputSchema,
  },
  async input => {
    const {output} = await generateArticleDraftPrompt(input);
    return output!;
  }
);
