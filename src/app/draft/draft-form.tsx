'use client';

import { useEffect, useState, useActionState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/submit-button';
import { useToast } from '@/hooks/use-toast';
import { TONES } from '@/lib/constants';
import { generateDraftAction, saveDraftAction } from './actions';
import { PenSquare, Terminal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenerationResult } from '@/components/generation-result';
import { GenerationActions } from '@/components/generation-actions';

export type FormState = {
  message: string;
  draft?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

const initialState: FormState = {
  message: '',
};

export function DraftForm() {
  const [state, formAction] = useActionState(generateDraftAction, initialState);
  const { toast } = useToast();
  
  const [topic, setTopic] = useState(state.fields?.topic || '');
  const [tone, setTone] = useState(state.fields?.tone || 'academic');
  const [wordLimit, setWordLimit] = useState(state.fields?.wordLimit || '1000');


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
    const result = await saveDraftAction({
      topic: state.fields.topic || '',
      content: state.draft,
      language: 'English',
      type: 'Draft',
    });
    if (result.message === 'success') {
      toast({
        title: 'Saved!',
        description: 'Your draft has been saved to your history.',
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
            render={(draft) => <Textarea readOnly value={draft} className="min-h-[400px] text-base" />}
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
