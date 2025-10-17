'use server';

import {ai} from '@/ai/genkit';
import {generateArticleDraft} from '@/ai/flows/generate-article-draft';
import {playgroundFormSchema} from '@/lib/schemas';
import {auth} from '@/auth';
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {app} from '@/lib/firebase';

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = playgroundFormSchema.safeParse(body);
  const session = await auth();

  if (!session || !session.user) {
    return new Response(JSON.stringify({error: 'Unauthorized'}), {
      status: 401,
    });
  }

  if (!validatedFields.success) {
    return new Response(JSON.stringify({error: 'Invalid input'}), {
      status: 400,
    });
  }

  const {topic, tone, purpose, language, content, wordLimit} = validatedFields.data;

  try {
    const draft = await ai.runFlow(generateArticleDraft, {
      topic,
      tone,
      purpose,
      language,
      outline: content,
      wordLimit,
    });

    const db = getFirestore(app);
    await addDoc(collection(db, 'history'), {
      userId: session.user.id,
      topic,
      tone,
      purpose,
      language,
      wordLimit,
      draft,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({draft}), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating or saving draft:', error);
    return new Response(JSON.stringify({error: 'Failed to process draft'}), {
      status: 500,
    });
  }
}
