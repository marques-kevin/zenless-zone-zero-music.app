import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleAuth } from "google-auth-library";

dotenv.config();

async function main() {
  const project_id = process.env.GATSBY_FIREBASE_PROJECT_ID;
  const client_email = process.env.FIREBASE_CLIENT_EMAIL;
  const private_key_env = process.env.FIREBASE_PRIVATE_KEY;

  if (!project_id || !client_email || !private_key_env) {
    throw new Error(
      "Missing GATSBY_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY"
    );
  }

  const private_key = private_key_env.replace(/\\n/g, "\n");
  const rules_path = join(process.cwd(), "firestore.rules");
  const rules_content = readFileSync(rules_path, "utf8");

  const auth = new GoogleAuth({
    credentials: {
      client_email,
      private_key,
    },
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();

  const create_ruleset_response = await client.request<{ name: string }>({
    url: `https://firebaserules.googleapis.com/v1/projects/${project_id}/rulesets`,
    method: "POST",
    data: {
      source: {
        files: [{ name: "firestore.rules", content: rules_content }],
      },
    },
  });

  const ruleset_name = create_ruleset_response.data.name;

  await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${project_id}/releases/cloud.firestore?updateMask=rulesetName`,
    method: "PATCH",
    data: {
      release: {
        name: `projects/${project_id}/releases/cloud.firestore`,
        rulesetName: ruleset_name,
      },
    },
  });

  console.log(`Firestore rules deployed to ${project_id}`);
  console.log(`Ruleset: ${ruleset_name}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
