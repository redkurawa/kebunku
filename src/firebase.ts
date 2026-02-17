import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace the following with your app's Firebase project configuration
// You can find this in your Firebase console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:f60252cc87aca0c03289c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
