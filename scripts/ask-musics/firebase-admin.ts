import dotenv from "dotenv";
import admin, { ServiceAccount } from "firebase-admin";

dotenv.config();

const firebase_project_id = process.env.GATSBY_FIREBASE_PROJECT_ID;
const firebase_client_email = process.env.FIREBASE_CLIENT_EMAIL;
const firebase_private_key_env = process.env.FIREBASE_PRIVATE_KEY;

if (
  !firebase_project_id ||
  !firebase_client_email ||
  !firebase_private_key_env
) {
  throw new Error(
    "Missing GATSBY_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in environment"
  );
}

const firebase_private_key = firebase_private_key_env.replace(/\\n/g, "\n");

const service_account: ServiceAccount = {
  projectId: firebase_project_id,
  clientEmail: firebase_client_email,
  privateKey: firebase_private_key,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(service_account),
  });
}

export const firestore_db = admin.firestore();
export const ASK_MUSICS_COLLECTION = "ask-musics";
