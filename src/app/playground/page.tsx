'use client';
import { playgroundAction } from './actions';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  FileText,
  PenSquare,
  SpellCheck,
  WandSparkles,
  Save,
  Download,
  Loader2
} from 'lucide-react';
import { TONES, PURPOSES } from '@/lib/constants';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const initialState = {
  message: '',
  result: '',
};

export default function PlaygroundPage() {
  const [state, formAction] = useActionState(playgroundAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [purpose, setPurpose] = useState('essay');
  const [content, setContent] = useState('');

  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (state.message === 'success' && state.result) {
      setContent(state.result);
      toast({
        title: 'Success!',
        description: 'Content has been generated.',
      });
    } else if (state.message && state.message !== 'success' && state.message !== '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    
    if (state.action) {
      setPendingAction(null);
    }
  }, [state, toast]);

  const handleFormAction = (formData: FormData) => {
    const action = formData.get('action') as string;
    setPendingAction(action);
    startTransition(() => {
        formAction(formData);
    });
  };

  const handleSave = async () => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Nothing to save',
        description: 'Please generate some content first.',
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
        topic: topic || 'Untitled Playground Draft',
        content: content,
        language: 'English',
        type: 'Playground',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({
        title: 'Saved!',
        description: 'Your work has been saved to your history.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving draft',
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleExport = () => {
     if (!content) {
      toast({
        variant: 'destructive',
        title: 'Nothing to export',
        description: 'Please generate some content first.',
      });
      return;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic || 'playground'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const anyActionPending = isPending && pendingAction;

  return (
    <form action={handleFormAction} className="flex flex-col h-full gap-4">
      <div className="flex flex-wrap items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label htmlFor="topic" className="text-sm font-medium">Topic</label>
          <Input id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic..." />
        </div>
        <div className="space-y-1">
           <label htmlFor="tone" className="text-sm font-medium">Tone</label>
          <Select name="tone" value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="w-[180px]">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
           <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
          <Select name="purpose" value={purpose} onValueChange={setPurpose}>
            <SelectTrigger id="purpose" className="w-[180px]">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              {PURPOSES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" name="action" value="outline" variant="outline" disabled={anyActionPending}>
          {pendingAction === 'outline' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          Generate Outline
        </Button>
        <Button type="submit" name="action" value="draft" variant="outline" disabled={anyActionPending}>
          {pendingAction === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
          Create Draft
        </Button>
        <Button type="submit" name="action" value="grammar" variant="outline" disabled={anyActionPending}>
          {pendingAction === 'grammar' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SpellCheck className="mr-2 h-4 w-4" />}
          Check Grammar
        </Button>
        <Button type="submit" name="action" value="style" variant="outline" disabled={anyActionPending}>
          {pendingAction === 'style' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
          Improve Style
        </Button>
        <div className="ml-auto flex items-center gap-2">
           <Button type="button" variant="outline" onClick={handleSave} disabled={anyActionPending}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button type="button" variant="outline" onClick={handleExport} disabled={anyActionPending}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your content here, or use the AI tools above to generate an outline or draft..."
          className="flex-1 w-full h-full text-base resize-none"
        />
        <div className="text-sm text-muted-foreground p-2 text-right">
            {content.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    </form>
  );
}
