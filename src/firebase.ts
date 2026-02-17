import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config from environment variables
// Create a .env file based on .env.example and fill in your values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your_api_key',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your_project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your_project_id',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your_project.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your_sender_id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your_app_id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
