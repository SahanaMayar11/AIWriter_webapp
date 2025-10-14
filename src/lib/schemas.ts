import { z } from 'zod';

export const draftFormSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters long.'),
  tone: z.string(),
  wordLimit: z.coerce
    .number()
    .min(50, 'Word limit must be at least 50.')
    .max(2000, 'Word limit cannot exceed 2000.'),
  outline: z.string().optional(),
});

export const outlineFormSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters long.'),
  tone: z.string(),
  wordLimit: z.coerce
    .number()
    .min(50, 'Word limit must be at least 50.')
    .max(5000, 'Word limit cannot exceed 5000.'),
  language: z.string(),
});

export const grammarCheckFormSchema = z.object({
  text: z.string().min(20, 'Text must be at least 20 characters long.'),
});

export const improveStyleFormSchema = z.object({
  text: z.string().min(20, 'Text must be at least 20 characters long.'),
});

export const saveDraftHistorySchema = z.object({
    topic: z.string(),
    content: z.string(),
    language: z.string(),
    type: z.enum(['Draft', 'Outline', 'Grammar Check', 'Style Improvement', 'Playground'])
});

const playgroundBaseSchema = z.object({
  tone: z.string(),
  purpose: z.string(),
  action: z.string(),
});

const topicRequiredSchema = playgroundBaseSchema.extend({
  topic: z.string().min(5, 'Topic must be at least 5 characters long.'),
  content: z.string().optional(),
});

const contentRequiredSchema = playgroundBaseSchema.extend({
  topic: z.string().optional(),
  content: z.string().min(20, 'Content must be at least 20 characters long.'),
});

export const playgroundFormSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('outline') }).merge(topicRequiredSchema),
  z.object({ action: z.literal('draft') }).merge(topicRequiredSchema),
  z.object({ action: z.literal('grammar') }).merge(contentRequiredSchema),
  z.object({ action: z.literal('style') }).merge(contentRequiredSchema),
]);
