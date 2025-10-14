
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth, deleteDocumentNonBlocking, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  preferredLanguage: z.string(),
  preferredTone: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      preferredLanguage: 'english',
      preferredTone: 'casual',
    },
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || '',
        preferredLanguage: userProfile.preferredLanguage || 'english',
        preferredTone: userProfile.preferredTone || 'casual',
      });
    }
  }, [userProfile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!userDocRef) return;
    setIsSaving(true);
    
    const updatedData = {
      ...data,
      updatedAt: new Date(),
    };

    updateDoc(userDocRef, updatedData)
      .then(() => {
        toast({
          title: 'Success',
          description: 'Your profile has been updated.',
        });
        setIsEditing(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update profile. Insufficient permissions.',
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleCancel = () => {
    if (userProfile) {
        reset({
            name: userProfile.name || '',
            preferredLanguage: userProfile.preferredLanguage || 'english',
            preferredTone: userProfile.preferredTone || 'casual',
        });
    }
    setIsEditing(false);
  }

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
      <div className="grid auto-rows-max gap-6 lg:col-span-2">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Profile</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => <Input id="name" {...field} disabled={!isEditing} />}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Controller
                      name="preferredLanguage"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditing}
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
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tone">Default Tone</Label>
                     <Controller
                      name="preferredTone"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              {isEditing ? (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                    </Button>
                    <Button variant="outline" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                  </div>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </CardFooter>
          </form>
        </Card>

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
    </div>
  );
}
