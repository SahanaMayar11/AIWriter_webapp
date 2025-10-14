'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating essay outlines.
 *
 * - generateEssayOutline - A function that generates an essay outline based on the provided input.
 * - GenerateEssayOutlineInput - The input type for the generateEssayOutline function.
 * - GenerateEssayOutlineOutput - The return type for the generateEssayOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEssayOutlineInputSchema = z.object({
  topic: z.string().describe('The topic of the essay.'),
  tone: z.string().describe('The tone of the essay (e.g., academic, casual, formal, persuasive).'),
  wordLimit: z.number().describe('The desired word limit for the essay.'),
  language: z.string().describe('The language of the essay (e.g., English, Hindi, Tamil).'),
});

export type GenerateEssayOutlineInput = z.infer<typeof GenerateEssayOutlineInputSchema>;

const GenerateEssayOutlineOutputSchema = z.object({
  outline: z.string().describe('The generated essay outline.'),
});

export type GenerateEssayOutlineOutput = z.infer<typeof GenerateEssayOutlineOutputSchema>;

export async function generateEssayOutline(input: GenerateEssayOutlineInput): Promise<GenerateEssayOutlineOutput> {
  return generateEssayOutlineFlow(input);
}

const generateEssayOutlinePrompt = ai.definePrompt({
  name: 'generateEssayOutlinePrompt',
  input: {schema: GenerateEssayOutlineInputSchema},
  output: {schema: GenerateEssayOutlineOutputSchema},
  prompt: `You are an AI writing assistant that helps users generate essay outlines.

  Based on the topic, tone, word limit, and language provided, generate a detailed essay outline.
  
  Format the outline using simple markdown, including headings (#, ##), lists (* or -), and bold text for key terms.

  Topic: {{{topic}}}
  Tone: {{{tone}}}
  Word Limit: {{{wordLimit}}}
  Language: {{{language}}}

  Outline:`,
});

const generateEssayOutlineFlow = ai.defineFlow(
  {
    name: 'generateEssayOutlineFlow',
    inputSchema: GenerateEssayOutlineInputSchema,
    outputSchema: GenerateEssayOutlineOutputSchema,
  },
  async input => {
    const {output} = await generateEssayOutlinePrompt(input);
    return output!;
  }
);
