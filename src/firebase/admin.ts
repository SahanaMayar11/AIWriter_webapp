'use server';
import { initializeApp, getApps, App } from 'firebase-admin/app';

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  
  // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
  // for authentication, which is automatically set in the App Hosting environment.
  return initializeApp();
}

export const adminApp = createAdminApp();
