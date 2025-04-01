import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const config = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
};

export class FirebaseService {
  private app;

  constructor() {
    this.app = initializeApp(config);
  }

  database() {
    return getFirestore(this.app);
  }

  getInstance() {
    return this.app;
  }

  getGoogleProvider() {
    return new GoogleAuthProvider();
  }

  auth() {
    return getAuth(this.app);
  }

  analytics() {
    return getAnalytics(this.app);
  }
}
