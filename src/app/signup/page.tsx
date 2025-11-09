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
import { useAuth, useUser, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type Auth,
  type User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

async function createUserProfile(
  firestore: Firestore,
  user: User,
  name?: string
) {
  const userRef = doc(firestore, 'users', user.uid);
  return setDoc(
    userRef,
    {
      id: user.uid,
      email: user.email,
      name: name || user.displayName,
      preferredLanguage: 'english',
      preferredTone: 'casual',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function initiateEmailSignUp(
  auth: Auth,
  firestore: Firestore,
  name: string,
  email: string,
  password: string
): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
    await createUserProfile(firestore, userCredential.user, name);
  }
}

async function initiateGoogleSignIn(auth: Auth, firestore: Firestore): Promise<void> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  if (userCredential.user) {
    await createUserProfile(firestore, userCredential.user);
  }
}

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth || !firestore) return;
    try {
      await initiateEmailSignUp(auth, firestore, name, email, password);
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak. Please use a stronger password.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    if (!auth || !firestore) return;
    try {
      await initiateGoogleSignIn(auth, firestore);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.logo className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your information to get started with WriteSphere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleSignUp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Max Robinson"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                Create an account
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full gradient-button"
              type="button"
              onClick={handleGoogleSignUp}
            >
              Continue with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
