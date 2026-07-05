import { writeFile } from "fs/promises";
import { join } from "path";
import { Albums } from "../../src/database/albums";
import { ensureDockerImage, requireCmd, ytdlpPrint } from "./ytdlp-docker";

const CHANNEL_PLAYLISTS_URL =
  "https://www.youtube.com/@FindingPurposes/playlists";
const PENDING_MANIFEST_PATH = join(
  process.cwd(),
  "scripts/youtube-downloader/pending-playlists.json"
);

const ZZZ_OST_TITLE = /^Zenless Zone Zero (\d+\.\d+) OST$/i;

type ChannelPlaylist = {
  version: string;
  title: string;
  url: string;
  playlist_id: string;
};

type PendingManifest = {
  checked_at: string;
  channel: string;
  known_versions_in_app: string[];
  latest_version_in_app: string | null;
  new_playlists: ChannelPlaylist[];
};

const args = new Set(process.argv.slice(2));
const is_dry_run = args.has("--dry-run");
const json_output = args.has("--json");

function printUsage() {
  console.log(
    [
      "Check @FindingPurposes for new Zenless Zone Zero OST playlists",
      "",
      "Usage:",
      "  yarn check-zzz-playlists [--dry-run] [--json]",
      "",
      "Behavior:",
      "  - Lists ZZZ version OST playlists on the channel",
      "  - Compares against the latest version album in src/database/albums.ts",
      "  - Writes pending-playlists.json when a newer version is found",
      "  - Exits with code 1 when new playlists are detected",
    ].join("\n")
  );
}

function getKnownVersionAlbums(): string[] {
  return Object.keys(Albums)
    .filter((key) => /^\d+\.\d+$/.test(key))
    .sort(compareVersions);
}

function parseVersion(version: string): [number, number] {
  const [major, minor] = version.split(".").map(Number);
  return [major, minor];
}

function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor] = parseVersion(a);
  const [bMajor, bMinor] = parseVersion(b);

  if (aMajor !== bMajor) {
    return aMajor - bMajor;
  }

  return aMinor - bMinor;
}

function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([^&]+)/);
  return match?.[1] ?? null;
}

function parseChannelPlaylists(rawOutput: string): ChannelPlaylist[] {
  const playlists: ChannelPlaylist[] = [];

  for (const line of rawOutput.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const tabIndex = trimmed.indexOf("\t");
    if (tabIndex === -1) continue;

    const title = trimmed.slice(0, tabIndex).trim();
    const url = trimmed.slice(tabIndex + 1).trim();
    const versionMatch = title.match(ZZZ_OST_TITLE);

    if (!versionMatch) continue;

    const playlist_id = extractPlaylistId(url);
    if (!playlist_id) continue;

    playlists.push({
      version: versionMatch[1],
      title,
      url,
      playlist_id,
    });
  }

  return playlists.sort((a, b) => compareVersions(a.version, b.version));
}

function findNewPlaylists(
  channelPlaylists: ChannelPlaylist[],
  knownVersions: string[]
): ChannelPlaylist[] {
  const latestVersionInApp =
    knownVersions.length > 0 ? knownVersions[knownVersions.length - 1] : null;

  if (!latestVersionInApp) {
    return channelPlaylists;
  }

  return channelPlaylists.filter(
    (playlist) => compareVersions(playlist.version, latestVersionInApp) > 0
  );
}

async function main() {
  if (args.has("-h") || args.has("--help")) {
    printUsage();
    return;
  }

  await requireCmd("docker");
  await ensureDockerImage();

  const knownVersions = getKnownVersionAlbums();
  const latestVersionInApp =
    knownVersions.length > 0 ? knownVersions[knownVersions.length - 1] : null;

  console.log(`Checking ${CHANNEL_PLAYLISTS_URL}...`);

  const rawOutput = await ytdlpPrint(
    CHANNEL_PLAYLISTS_URL,
    "%(title)s\t%(url)s"
  );
  const channelPlaylists = parseChannelPlaylists(rawOutput);
  const newPlaylists = findNewPlaylists(channelPlaylists, knownVersions);

  const manifest: PendingManifest = {
    checked_at: new Date().toISOString(),
    channel: "@FindingPurposes",
    known_versions_in_app: knownVersions,
    latest_version_in_app: latestVersionInApp,
    new_playlists: newPlaylists,
  };

  if (json_output) {
    console.log(JSON.stringify(manifest, null, 2));
  } else {
    console.log(
      `Found ${channelPlaylists.length} ZZZ OST playlist(s) on the channel.`
    );
    console.log(
      `Latest version in app: ${latestVersionInApp ?? "none"} (${
        knownVersions.length
      } version album(s)).`
    );

    if (newPlaylists.length === 0) {
      console.log("No new ZZZ OST playlists detected.");
    } else {
      console.log(`New playlist(s) detected (${newPlaylists.length}):`);
      for (const playlist of newPlaylists) {
        console.log(`  - ${playlist.title}`);
        console.log(`    ${playlist.url}`);
      }
    }
  }

  if (newPlaylists.length > 0 && !is_dry_run) {
    await writeFile(
      PENDING_MANIFEST_PATH,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8"
    );

    if (!json_output) {
      console.log(`Wrote ${PENDING_MANIFEST_PATH}`);
    }
  }

  if (newPlaylists.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
