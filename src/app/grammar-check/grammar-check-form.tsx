"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/hooks/use-toast";
import { checkGrammarAction, type FormState } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { WandSparkles, Terminal } from "lucide-react";

const initialState: FormState = {
  message: "",
};

function SuggestionResult({ improvements }: { improvements: string | undefined }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!improvements) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <WandSparkles className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          Your grammar and style suggestions will appear here.
        </p>
      </div>
    );
  }
  
  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: improvements.replace(/\n/g, '<br />') }} />;
}

export function GrammarCheckForm() {
  const [state, formAction] = useFormState(checkGrammarAction, initialState);
  const { toast } = useToast();

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
        description: "Suggestions have been generated.",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <div className="grid gap-8 lg:grid-cols-2">
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
              <Label htmlFor="text" className="sr-only">Your Text</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Type or paste your text here..."
                className="min-h-[300px] text-base"
                required
              />
            </div>
            <SubmitButton className="w-full">Check Grammar & Style</SubmitButton>
          </CardContent>
        </Card>

        <Card className="shadow-sm h-[430px]">
          <CardHeader>
            <CardTitle className="font-headline">Suggestions</CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your writing.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto h-[320px]">
            <SuggestionResult improvements={state.improvements} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
