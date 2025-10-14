"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/hooks/use-toast";
import { LANGUAGES, TONES } from "@/lib/constants";
import { generateOutlineAction, type FormState } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Terminal } from "lucide-react";

const initialState: FormState = {
  message: "",
};

function OutlineResult({ outline }: { outline: string | undefined }) {
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

  if (!outline) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          Your generated outline will appear here.
        </p>
      </div>
    );
  }
  
  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: outline.replace(/\n/g, '<br />') }} />;
}

export function OutlineForm() {
  const [state, formAction] = useFormState(generateOutlineAction, initialState);
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
        description: "Your outline has been generated.",
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Outline Details</CardTitle>
            <CardDescription>
              Provide the requirements for your outline.
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
                placeholder="e.g., The history of the internet"
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
                  placeholder="e.g., 2000"
                  defaultValue="2000"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select name="language" defaultValue="english">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton className="w-full">Generate Outline</SubmitButton>
          </CardContent>
        </Card>

        <Card className="shadow-sm h-[560px]">
          <CardHeader>
            <CardTitle className="font-headline">Generated Outline</CardTitle>
            <CardDescription>
              Here is the AI-generated structure for your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto h-[450px]">
            <OutlineResult outline={state.outline} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
