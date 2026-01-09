import "dotenv/config";

import { writeFile } from "fs/promises";

const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
const UMAMI_ENDPOINT = process.env.UMAMI_ENDPOINT;
const UMAMI_USERNAME = process.env.UMAMI_USERNAME;
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD;

if (!UMAMI_WEBSITE_ID) {
  throw new Error("Missing UMAMI_WEBSITE_ID in .env");
}

if (!UMAMI_ENDPOINT) {
  throw new Error("Missing UMAMI_ENDPOINT in .env");
}

if (!UMAMI_USERNAME || !UMAMI_PASSWORD) {
  throw new Error(
    "Missing Umami credentials. Set UMAMI_USERNAME and UMAMI_PASSWORD in .env"
  );
}

type MostPlayedSongEntry = {
  track_id: string;
  number_of_plays: number;
  rank: number;
};

type MostPlayedSongsOutput = {
  total_tracks: number;
  songs: MostPlayedSongEntry[];
};

async function getUmamiToken(): Promise<string> {
  const endpoint = UMAMI_ENDPOINT!;
  const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
  const loginUrl = `${baseUrl}/api/auth/login`;

  console.log("UMAMI_USERNAME:", UMAMI_USERNAME);
  console.log("UMAMI_PASSWORD:", UMAMI_PASSWORD);
  console.log("Login URL:", loginUrl);

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: UMAMI_USERNAME,
      password: UMAMI_PASSWORD,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Umami login failed: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error("Umami login response missing token");
  }

  return data.token;
}

async function fetch_most_played_songs(): Promise<
  { total: number; track_id: string }[]
> {
  // Calculate date range: last 30 days
  const endAt = Date.now();
  const startAt = endAt - 30 * 24 * 60 * 60 * 1000; // 30 days ago in milliseconds

  // Get the API endpoint base URL (guaranteed to be defined due to check above)
  const endpoint = UMAMI_ENDPOINT!;
  const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;

  // Build the URL for event data values endpoint
  const url = new URL(
    `${baseUrl}/api/websites/${UMAMI_WEBSITE_ID}/event-data/values`
  );
  url.searchParams.set("startAt", startAt.toString());
  url.searchParams.set("endAt", endAt.toString());
  url.searchParams.set("event", "tracks/playing");
  url.searchParams.set("propertyName", "track_id");

  // Get authentication token via login
  const token = await getUmamiToken();

  // Set up authentication headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Umami API error: ${response.status} ${response.statusText}`);
    console.error(`Response: ${errorText}`);
    return [];
  }

  const data = await response.json();

  // Umami returns: [{ value: "track_id", total: count }, ...]
  if (!Array.isArray(data)) {
    console.error("Unexpected Umami API response format:", data);
    return [];
  }

  return data.map((item: { value: string; total: number }) => ({
    total: item.total,
    track_id: item.value,
  }));
}

function compute_most_played_songs(
  plays: { total: number; track_id: string }[]
): MostPlayedSongsOutput {
  // Sort by total plays (descending)
  const songs: MostPlayedSongEntry[] = plays
    .map((play) => ({
      track_id: play.track_id,
      number_of_plays: play.total,
      rank: 0, // Will be set after sorting
    }))
    .sort((a, b) => b.number_of_plays - a.number_of_plays)
    .map((song, index) => ({
      ...song,
      rank: index + 1,
    }));

  return {
    total_tracks: songs.length,
    songs,
  };
}

async function main() {
  try {
    console.log("Fetching most played songs from Umami...");
    const plays = await fetch_most_played_songs();
    console.log(`Found ${plays.length} tracks with plays`);

    console.log("Computing most played songs...");
    const most_played_songs = compute_most_played_songs(plays);

    const outputPath = "src/database/most_played.json";
    await writeFile(
      outputPath,
      JSON.stringify(most_played_songs, null, 2),
      "utf8"
    );

    console.log(`Most played songs written to ${outputPath}`);
    console.log(`Total tracks: ${most_played_songs.total_tracks}`);
  } catch (error) {
    console.error("Error generating most played songs:", error);
    process.exit(1);
  }
}

main();
