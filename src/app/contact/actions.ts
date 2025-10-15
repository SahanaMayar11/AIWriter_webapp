
'use server';

import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long.'),
    email: z.string().email('Please enter a valid email address.'),
    subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
    message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  const fields = Object.fromEntries(formData.entries());

  if (!validatedFields.success) {
    return {
      message: 'Please check your input and try again.',
      fields: fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  // Here you would typically send an email or save to a database.
  // For this demo, we'll just log it and return a success message.
  console.log('Contact form submitted:', validatedFields.data);

  return { message: 'success' };
}
