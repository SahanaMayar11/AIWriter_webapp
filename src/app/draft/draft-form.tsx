'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmitButton } from '@/components/submit-button';
import { useToast } from '@/hooks/use-toast';
import { TONES } from '@/lib/constants';
import { generateDraftAction } from './actions';
import { PenSquare, Terminal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenerationResult } from '@/components/generation-result';
import { GenerationActions } from '@/components/generation-actions';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type FormState = {
  message: string;
  draft?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

const initialState: FormState = {
  message: '',
};

function DraftFormContent() {
  const [state, formAction] = useActionState(generateDraftAction, initialState);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [topic, setTopic] = useState(state.fields?.topic || searchParams.get('topic') || '');
  const [tone, setTone] = useState(state.fields?.tone || searchParams.get('tone') || 'academic');
  const [wordLimit, setWordLimit] = useState(state.fields?.wordLimit || searchParams.get('wordLimit') || '1000');
  const [outline, setOutline] = useState(searchParams.get('outline') || '');

  useEffect(() => {
    if (searchParams.get('topic') && formRef.current) {
        // Use a timeout to ensure state has been updated before submitting
        setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 100);
    }
  }, [searchParams]);

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
        description: 'Your draft has been generated.',
      });
       if (state.fields) {
        setTopic(state.fields.topic || '');
        setTone(state.fields.tone || 'academic');
        setWordLimit(state.fields.wordLimit || '1000');
        setOutline(state.fields.outline || '');
      }
    }
  }, [state, toast]);

  const handleSave = async () => {
    if (!state.draft || !state.fields) {
      toast({
        variant: 'destructive',
        title: 'Nothing to save',
        description: 'Please generate a draft first.',
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
            topic: state.fields.topic || '',
            content: state.draft,
            language: 'English',
            type: 'Draft',
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({
            title: 'Saved!',
            description: 'Your draft has been saved to your history.',
          });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error saving draft',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={formAction} ref={formRef}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Draft Details</CardTitle>
            <CardDescription>
              Tell us what you want to write about.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., The Future of Artificial Intelligence"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wordLimit">Word Limit</Label>
                <Input
                  id="wordLimit"
                  name="wordLimit"
                  type="number"
                  placeholder="e.g., 1000"
                  value={wordLimit}
                  onChange={(e) => setWordLimit(e.target.value)}
                  required
                />
              </div>
            </div>
            {outline && (
              <input type="hidden" name="outline" value={outline} />
            )}
            <SubmitButton className="w-full">Generate Draft</SubmitButton>
          </CardContent>
        </Card>
      </form>

      <Card className="shadow-sm h-fit">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Generated Draft</CardTitle>
            <CardDescription>
              Here is the AI-generated draft based on your input.
            </CardDescription>
          </div>
          {state.draft && (
            <GenerationActions
              textToCopy={state.draft}
              fileName={`${state.fields?.topic || 'draft'}.txt`}
            />
          )}
        </CardHeader>
        <CardContent className='min-h-[450px]'>
          <GenerationResult 
            state={state} 
            render={(draft) => <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: draft.replace(/\n/g, '<br />') }}
              />}
            initialIcon={<PenSquare className="h-16 w-16 text-muted-foreground/50" />}
            initialMessage="Your generated draft will appear here."
          />
        </CardContent>
        {state.draft && (
            <CardActions className='p-6 pt-0'>
              <Button onClick={handleSave}>Save Draft</Button>
            </CardActions>
        )}
      </Card>
    </div>
  );
}


export function DraftForm() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DraftFormContent />
      </Suspense>
    );
  }
