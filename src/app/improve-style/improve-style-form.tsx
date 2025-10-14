'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/submit-button';
import { useToast } from '@/hooks/use-toast';
import { improveStyleAction } from './actions';
import { WandSparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationResult } from '@/components/generation-result';
import { GenerationActions } from '@/components/generation-actions';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type FormState = {
  message: string;
  improvedText?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

const initialState: FormState = {
  message: '',
};

export function ImproveStyleForm() {
  const [state, formAction] = useActionState(improveStyleAction, initialState);
  const { toast } = useToast();
  const [text, setText] = useState(state.fields?.text || '');
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state.message === 'success') {
      toast({
        title: 'Success!',
        description: 'Suggestions have been generated.',
      });
      if (state.fields) {
        setText(state.fields.text || '');
      }
    }
  }, [state, toast]);

  const handleSave = async () => {
    if (!state.improvedText || !state.fields) {
      toast({
        variant: 'destructive',
        title: 'Nothing to save',
        description: 'Please generate suggestions first.',
      });
      return;
    }
     if (!user || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in to save.',
          });
        return;
    }
    try {
        const historyRef = collection(firestore, 'users', user.uid, 'draftHistories');
        await addDoc(historyRef, {
            topic: state.fields.text?.substring(0, 40) + '...' || 'Style Improvement',
            content: state.improvedText,
            language: 'N/A',
            type: 'Style Improvement',
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({
            title: 'Saved!',
            description: 'Your improvement has been saved to your history.',
          });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error saving improvement',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
  };


  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={formAction}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Your Text</CardTitle>
            <CardDescription>
              Paste your content here for style improvement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.issues && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {state.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="text" className="sr-only">
                Your Text
              </Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Type or paste your text here..."
                className="min-h-[300px] text-base"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <SubmitButton className="w-full">
              Improve Style
            </SubmitButton>
          </CardContent>
        </Card>
      </form>

      <Card className="shadow-sm h-fit">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Improved Text</CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your writing style.
            </CardDescription>
          </div>
          {state.improvedText && (
            <GenerationActions
              textToCopy={state.improvedText}
              fileName="improved_text.txt"
            />
          )}
        </CardHeader>
        <CardContent className="overflow-auto min-h-[320px]">
           <GenerationResult 
             state={state}
             render={(improvedText) => <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: improvedText.replace(/\n/g, '<br />') }}
              />}
             initialIcon={<WandSparkles className="h-16 w-16 text-muted-foreground/50" />}
             initialMessage="Your improved text will appear here."
           />
        </CardContent>
        {state.improvedText && (
          <CardActions className="p-6 pt-0">
            <Button onClick={handleSave}>Save Improvement</Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
