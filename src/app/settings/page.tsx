
'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES, TONES } from '@/lib/constants';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { updateProfile } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [formState, formAction] = useFormState(updateProfile, { message: '' });

  useEffect(() => {
    if (formState.message === 'success') {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } else if (formState.message) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: formState.message,
      });
    }
  }, [formState, toast]);


  const handleDeleteAccount = async () => {
    if (!user || !userDocRef || !auth) return;
    setIsDeleting(true);

    deleteDocumentNonBlocking(userDocRef);

    try {
      await auth.signOut();

      toast({
        title: 'Account Deletion Initiated',
        description: 'Your account data will be deleted. You have been signed out.',
      });

      router.push('/');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: 'Could not sign you out after attempting to delete account data.',
      });
    } finally {
      setIsDeleting(false);
    }
  };


  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form action={formAction} className="grid auto-rows-max gap-6 lg:col-span-2">
        <Card>
            <CardHeader>
              <CardTitle className="font-headline">Profile</CardTitle>
              <CardDescription>
                Your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={userProfile?.name || ''} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      name="preferredLanguage"
                      defaultValue={userProfile?.preferredLanguage || 'english'}
                    >
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
                  <div className="grid gap-2">
                    <Label htmlFor="tone">Default Tone</Label>
                     <Select name="preferredTone" defaultValue={userProfile?.preferredTone || 'casual'}>
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SubmitButton />
            </CardFooter>
        </Card>
      </form>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Account Management</CardTitle>
            <CardDescription>
              Manage your account settings and data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground">
                Permanently delete your account and all of your data. This action cannot be undone.
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
