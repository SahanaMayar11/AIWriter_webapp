
import { initializeApp, getApps, App } from 'firebase-admin/app';

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  
  const projectId = process.env.GCLOUD_PROJECT;

  if (!projectId) {
    throw new Error('The GCLOUD_PROJECT environment variable is not set.');
  }

  // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
  // for authentication, which is automatically set in the App Hosting environment.
  return initializeApp({
    projectId: projectId,
    databaseURL: `https://monospace-6.firebaseio.com`,
  });
}

export const adminApp = createAdminApp();
