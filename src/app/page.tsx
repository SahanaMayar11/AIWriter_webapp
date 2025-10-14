import Link from 'next/link';
import {
  BookOpen,
  WandSparkles,
  Languages,
  Zap,
  History,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: BookOpen,
    title: 'Smart Outlines',
    description: 'Generate structured outlines for essays and articles instantly.',
  },
  {
    icon: WandSparkles,
    title: 'AI Draft Generator',
    description: 'Create complete drafts based on your topic and preferred tone.',
  },
  {
    icon: Languages,
    title: 'Multilingual Support',
    description:
      'Write in English, Hindi, Tamil, Telugu, and more Indian languages.',
  },
  {
    icon: Zap,
    title: 'Grammar & Style',
    description: 'Real-time grammar checking and style improvement suggestions.',
  },
  {
    icon: History,
    title: 'Draft History',
    description: 'Access all your previous drafts and outlines anytime.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared with third parties.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Your AI-Powered Writing Companion
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Write essays, articles, and research papers with intelligent AI
                assistance. Support for English and major Indian languages.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">Start Writing Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#">View Demo</Link>
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
                  Powerful Features
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
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
