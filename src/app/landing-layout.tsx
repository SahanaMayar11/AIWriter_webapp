'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background fixed top-0 left-0 right-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold font-headline">WriteAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
            <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 pt-14">{children}</main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} WriteAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
