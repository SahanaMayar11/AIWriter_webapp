'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, type Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

function initiateEmailSignIn(
  auth: Auth,
  email: string,
  password: string
): Promise<void> {
  return signInWithEmailAndPassword(auth, email, password).then(() => {});
}

function initiateGoogleSignIn(auth: Auth): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(() => {});
}

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;
    initiateEmailSignIn(auth, email, password).catch((err: FirebaseError) => {
      switch (err.code) {
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please check your email and password.');
          break;
        default:
          setError('An unknown error occurred. Please try again.');
          break;
      }
    });
  };

  const handleGoogleLogin = async () => {
    setError(null);
    if (!auth) return;
    initiateGoogleSignIn(auth).catch((err: FirebaseError) => {
      setError(err.message);
    });
  };

  if (isUserLoading || user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.logo className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
              Continue with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
