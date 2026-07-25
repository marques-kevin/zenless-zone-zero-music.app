import { writeFile } from "fs/promises";
import { join } from "path";
import { ASK_MUSICS_COLLECTION, firestore_db } from "./firebase-admin";
import {
  AskMusicDoc,
  map_doc_to_request,
  PendingRequestsManifest,
} from "./types";

const PENDING_MANIFEST_PATH = join(
  process.cwd(),
  "scripts/ask-musics/pending-requests.json"
);

const args = new Set(process.argv.slice(2));
const json_output = args.has("--json");
const write_manifest = args.has("--write-manifest");

function printUsage() {
  console.log(
    [
      "List pending music requests from Firestore",
      "",
      "Usage:",
      "  yarn ask-musics:list-pending [--json] [--write-manifest]",
      "",
      "Options:",
      "  --json             Output machine-readable JSON to stdout",
      "  --write-manifest   Write pending-requests.json for automation",
      "",
      "Exit codes:",
      "  0  No pending requests",
      "  1  One or more pending requests found",
    ].join("\n")
  );
}

async function fetch_pending_requests() {
  const snapshot = await firestore_db
    .collection(ASK_MUSICS_COLLECTION)
    .where("status", "==", "pending")
    .get();

  return snapshot.docs
    .map((doc) => map_doc_to_request(doc.id, doc.data() as AskMusicDoc))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    const requests = await fetch_pending_requests();

    if (write_manifest) {
      const manifest: PendingRequestsManifest = {
        checked_at: new Date().toISOString(),
        total_pending: requests.length,
        requests,
      };

      await writeFile(
        PENDING_MANIFEST_PATH,
        JSON.stringify(manifest, null, 2),
        "utf8"
      );

      if (!json_output) {
        console.log(`Manifest written to ${PENDING_MANIFEST_PATH}`);
      }
    }

    if (json_output) {
      console.log(JSON.stringify(requests, null, 2));
    } else if (!write_manifest || requests.length > 0) {
      if (requests.length === 0) {
        console.log("No pending music requests.");
      } else {
        console.log(`Found ${requests.length} pending request(s):\n`);

        for (const request of requests) {
          console.log(`- id: ${request.id}`);
          console.log(`  url: ${request.url}`);
          console.log(`  users: ${request.users.length}`);
          console.log(`  created_at: ${request.created_at}`);
          console.log("");
        }
      }
    }

    if (requests.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error listing pending music requests:", error);
    process.exit(1);
  }
}

main();
