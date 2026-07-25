import { FieldValue } from "firebase-admin/firestore";
import { AskMusicStatus } from "../../src/types/ask-music.type";
import {
  decode_url_from_firestore_doc_id,
  encode_url_as_firestore_doc_id,
  normalize_youtube_url,
} from "../../src/utils/youtube-url";
import { ASK_MUSICS_COLLECTION, firestore_db } from "./firebase-admin";
import { AskMusicDoc, map_doc_to_request } from "./types";

const VALID_STATUSES: AskMusicStatus[] = ["pending", "added", "cancelled"];

type ParsedArgs = {
  id?: string;
  url?: string;
  status?: AskMusicStatus;
  reason?: string;
};

function printUsage() {
  console.log(
    [
      "Update the status of a music request in Firestore",
      "",
      "Usage:",
      "  yarn ask-musics:update-status --url <youtube-url> --status <status>",
      "  yarn ask-musics:update-status --id <firestore-doc-id> --status <status>",
      "",
      "Options:",
      "  --url <youtube-url>       Target request by YouTube URL",
      "  --id <firestore-doc-id>   Target request by Firestore document ID",
      "  --status <status>         New status: pending | added | cancelled",
      "  --reason <text>           Optional reason when status is cancelled",
      "  --json                    Output updated request as JSON",
      "",
      "Examples:",
      '  yarn ask-musics:update-status --url "https://www.youtube.com/watch?v=abc" --status added',
      '  yarn ask-musics:update-status --id dGVzdA --status cancelled --reason "Duplicate track"',
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--url") {
      parsed.url = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--id") {
      parsed.id = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--status") {
      parsed.status = argv[index + 1] as AskMusicStatus;
      index += 1;
      continue;
    }

    if (arg === "--reason") {
      parsed.reason = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function resolve_doc_id(params: { id?: string; url?: string }): string {
  if (params.id) {
    return params.id;
  }

  if (!params.url) {
    throw new Error("Provide either --url or --id");
  }

  const normalized_url = normalize_youtube_url(params.url);
  if (!normalized_url) {
    throw new Error(`Invalid YouTube URL: ${params.url}`);
  }

  return encode_url_as_firestore_doc_id(normalized_url);
}

async function main() {
  const argv = process.argv.slice(2);
  const args = new Set(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  const parsed = parseArgs(argv);

  if (!parsed.status) {
    console.error("Missing required option: --status\n");
    printUsage();
    process.exit(1);
  }

  if (!VALID_STATUSES.includes(parsed.status)) {
    console.error(
      `Invalid status "${parsed.status}". Expected one of: ${VALID_STATUSES.join(", ")}`
    );
    process.exit(1);
  }

  if (!parsed.id && !parsed.url) {
    console.error("Provide either --url or --id\n");
    printUsage();
    process.exit(1);
  }

  if (parsed.id && parsed.url) {
    console.error("Use only one of --url or --id\n");
    printUsage();
    process.exit(1);
  }

  if (parsed.status === "cancelled" && !parsed.reason?.trim()) {
    console.error('A --reason is required when status is "cancelled"');
    process.exit(1);
  }

  try {
    const doc_id = resolve_doc_id(parsed);
    const doc_ref = firestore_db.collection(ASK_MUSICS_COLLECTION).doc(doc_id);
    const snapshot = await doc_ref.get();

    if (!snapshot.exists) {
      const lookup =
        parsed.url ??
        decode_url_from_firestore_doc_id(doc_id);
      console.error(`No music request found for: ${lookup}`);
      process.exit(1);
    }

    const existing = snapshot.data() as AskMusicDoc;
    const update_payload: Record<string, unknown> = {
      status: parsed.status,
      updated_at: FieldValue.serverTimestamp(),
    };

    if (parsed.status === "cancelled") {
      update_payload.cancel_reason = parsed.reason!.trim();
    } else {
      update_payload.cancel_reason = FieldValue.delete();
    }

    await doc_ref.update(update_payload);

    const updated_snapshot = await doc_ref.get();
    const updated_request = map_doc_to_request(
      updated_snapshot.id,
      updated_snapshot.data() as AskMusicDoc
    );

    if (args.has("--json")) {
      console.log(JSON.stringify(updated_request, null, 2));
    } else {
      console.log(`Updated request ${updated_request.id}`);
      console.log(`  url: ${updated_request.url}`);
      console.log(`  status: ${existing.status} -> ${updated_request.status}`);

      if (updated_request.cancel_reason) {
        console.log(`  cancel_reason: ${updated_request.cancel_reason}`);
      }
    }
  } catch (error) {
    console.error("Error updating music request status:", error);
    process.exit(1);
  }
}

main();
