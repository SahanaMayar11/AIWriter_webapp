"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/hooks/use-toast";
import { TONES } from "@/lib/constants";
import { generateDraftAction, type FormState } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormStatus } from "react-dom";
import { PenSquare, Terminal } from "lucide-react";
import { Label } from "@/components/ui/label";

const initialState: FormState = {
  message: "",
};

function GenerationResult({ draft }: { draft: string | undefined }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <PenSquare className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          Your generated draft will appear here.
        </p>
      </div>
    );
  }
  
  return <Textarea readOnly value={draft} className="min-h-[400px] text-base" />;
}

export function DraftForm() {
  const [state, formAction] = useFormState(generateDraftAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.message !== "success") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
    if (state.message === "success") {
      toast({
        title: "Success!",
        description: "Your draft has been generated.",
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction}>
      <div className="grid gap-8 lg:grid-cols-2">
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
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" defaultValue="academic">
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
                  defaultValue="1000"
                  required
                />
              </div>
            </div>
            <SubmitButton className="w-full">Generate Draft</SubmitButton>
          </CardContent>
        </Card>

        <Card className="shadow-sm h-[560px]">
          <CardHeader>
            <CardTitle className="font-headline">Generated Draft</CardTitle>
            <CardDescription>
              Here is the AI-generated draft based on your input.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationResult draft={state.draft} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
