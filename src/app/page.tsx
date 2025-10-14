import Link from 'next/link';
import {
  FileText,
  PenSquare,
  WandSparkles,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: FileText,
    title: 'Generate Outlines',
    description: 'Get structured outlines for your essays and articles instantly. Organize your thoughts before you write.',
  },
  {
    icon: PenSquare,
    title: 'Create Drafts',
    description: 'Generate complete drafts based on your topic and requirements. Save hours of writing time.',
  },
  {
    icon: CheckSquare,
    title: 'Check Grammar',
    description: 'Catch grammar mistakes, spelling errors, and punctuation issues with advanced AI checking.',
  },
  {
    icon: WandSparkles,
    title: 'Improve Style',
    description: 'Enhance your writing style, tone, and clarity. Make your content more engaging and professional.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
                <Badge variant="outline" className="py-1 px-3">
                    <WandSparkles className="h-4 w-4 mr-2 text-primary"/>
                    Powered by Advanced AI
                </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Write Better Essays & Articles with AI Assistance
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Generate outlines, create drafts, check grammar, and improve your writing style. 
                Your intelligent writing companion that understands your tone and purpose.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">Start Writing Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                  Everything You Need to Write Better
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Powerful AI features designed to enhance your writing process from start to finish.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-1">
                    <div className='flex items-center gap-2'>
                        <feature.icon className="w-6 h-6 text-primary" />
                        <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-lg bg-primary text-primary-foreground p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Ready to Transform Your Writing?
              </h2>
              <p className="mt-4 max-w-xl mx-auto">
                Join thousands of writers using AI to create better content faster.
              </p>
              <div className="mt-6">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
