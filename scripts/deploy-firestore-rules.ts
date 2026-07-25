import dotenv from "dotenv";
import { execSync } from "child_process";
import { unlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

dotenv.config();

const project_id = process.env.GATSBY_FIREBASE_PROJECT_ID;
const client_email = process.env.FIREBASE_CLIENT_EMAIL;
const private_key_env = process.env.FIREBASE_PRIVATE_KEY;

if (!project_id || !client_email || !private_key_env) {
  throw new Error(
    "Missing GATSBY_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY"
  );
}

const private_key = private_key_env.replace(/\\n/g, "\n");
const credentials_path = join(tmpdir(), `firebase-sa-${Date.now()}.json`);

writeFileSync(
  credentials_path,
  JSON.stringify({
    type: "service_account",
    project_id,
    private_key,
    client_email,
    token_uri: "https://oauth2.googleapis.com/token",
  })
);

try {
  execSync(`npx firebase-tools deploy --only firestore:rules --project ${project_id}`, {
    stdio: "inherit",
    env: {
      ...process.env,
      GOOGLE_APPLICATION_CREDENTIALS: credentials_path,
    },
  });
} finally {
  unlinkSync(credentials_path);
}
