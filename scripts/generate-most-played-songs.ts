import "dotenv/config";

import { writeFile } from "fs/promises";

const PLAUSIBLE_API_TOKEN = process.env.PLAUSIBLE_API_TOKEN;
const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID;

if (!PLAUSIBLE_API_TOKEN || !PLAUSIBLE_SITE_ID) {
  throw new Error("Missing PLAUSIBLE_API_TOKEN or PLAUSIBLE_SITE_ID in .env");
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

async function fetch_most_played_songs(): Promise<
  { total: number; track_id: string }[]
> {
  const response = await fetch("https://plausible.foudroyer.com/api/v2/query", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PLAUSIBLE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site_id: PLAUSIBLE_SITE_ID,
      metrics: ["events"],
      date_range: "30d",
      filters: [["is", "event:goal", ["Playing"]]],
      dimensions: ["event:props:track_id"],
    }),
  });

  if (!response.ok) {
    console.error(`Plausible API error: ${response.statusText}`);
    return [];
  }

  const data = await response.json();

  return data.results.map((result: any) => ({
    total: result.metrics[0] as number,
    track_id: result.dimensions[0] as string,
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
    console.log("Fetching most played songs from Plausible...");
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
