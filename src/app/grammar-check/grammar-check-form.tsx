'use client';

import { useEffect, useState, useActionState } from 'react';
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
import { checkGrammarAction, saveGrammarAction } from './actions';
import { WandSparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationResult } from '@/components/generation-result';
import { GenerationActions } from '@/components/generation-actions';

export type FormState = {
  message: string;
  improvements?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

const initialState: FormState = {
  message: '',
};

export function GrammarCheckForm() {
  const [state, formAction] = useActionState(checkGrammarAction, initialState);
  const { toast } = useToast();
  const [text, setText] = useState(state.fields?.text || '');

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
    if (!state.improvements || !state.fields) {
      toast({
        variant: 'destructive',
        title: 'Nothing to save',
        description: 'Please generate suggestions first.',
      });
      return;
    }
    const result = await saveGrammarAction({
      topic: state.fields.text?.substring(0, 40) + '...' || 'Grammar Check',
      content: state.improvements,
      language: 'N/A',
      type: 'Grammar Check',
    });
    if (result.message === 'success') {
      toast({
        title: 'Saved!',
        description: 'Your suggestions have been saved to your history.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
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
              Paste your content here for analysis.
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
              Check Grammar & Style
            </SubmitButton>
          </CardContent>
        </Card>
      </form>

      <Card className="shadow-sm h-fit">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Suggestions</CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your writing.
            </CardDescription>
          </div>
          {state.improvements && (
            <GenerationActions
              textToCopy={state.improvements}
              fileName="suggestions.txt"
            />
          )}
        </CardHeader>
        <CardContent className="overflow-auto min-h-[320px]">
           <GenerationResult 
             state={state}
             render={(improvements) => <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: improvements.replace(/\n/g, '<br />') }}
              />}
             initialIcon={<WandSparkles className="h-16 w-16 text-muted-foreground/50" />}
             initialMessage="Your grammar and style suggestions will appear here."
           />
        </CardContent>
        {state.improvements && (
          <CardActions className="p-6 pt-0">
            <Button onClick={handleSave}>Save Suggestions</Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
