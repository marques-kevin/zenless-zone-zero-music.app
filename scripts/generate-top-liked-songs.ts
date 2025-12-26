import "dotenv/config";
import admin, { ServiceAccount } from "firebase-admin";
import { writeFile } from "fs/promises";

const firebase_project_id = process.env.GATSBY_FIREBASE_PROJECT_ID;
const firebase_client_email = process.env.FIREBASE_CLIENT_EMAIL;
const firebase_private_key_env = process.env.FIREBASE_PRIVATE_KEY;

if (
  !firebase_project_id ||
  !firebase_client_email ||
  !firebase_private_key_env
) {
  throw new Error(
    "Missing GATSBY_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in firebase.env"
  );
}

const firebase_private_key = firebase_private_key_env.replace(/\\n/g, "\n");

const service_account: ServiceAccount = {
  projectId: firebase_project_id,
  clientEmail: firebase_client_email,
  privateKey: firebase_private_key,
};

admin.initializeApp({
  credential: admin.credential.cert(service_account),
});

const firestore_db = admin.firestore();

type LikeDocEntry = {
  id: string;
  users: string[];
};

type TopLikedSongEntry = {
  title_id: string;
  number_of_likes: number;
  rank: number;
};

type TopLikedSongsOutput = {
  total_tracks: number;
  songs: TopLikedSongEntry[];
};

async function fetch_all_likes(): Promise<LikeDocEntry[]> {
  const snapshot = await firestore_db.collection("likes").get();
  const likes: LikeDocEntry[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data && Array.isArray(data.users) && data.id) {
      likes.push({
        id: data.id,
        users: data.users,
      });
    }
  });

  return likes;
}

function compute_top_liked_songs(likes: LikeDocEntry[]): TopLikedSongsOutput {
  // Count likes per track
  const track_likes_map = new Map<string, number>();

  for (const like of likes) {
    const count = like.users?.length || 0;
    if (count > 0) {
      track_likes_map.set(like.id, count);
    }
  }

  // Convert to array and sort by likes (descending)
  const songs: TopLikedSongEntry[] = Array.from(track_likes_map.entries())
    .map(([title_id, number_of_likes]) => ({
      title_id,
      number_of_likes,
      rank: 0, // Will be set after sorting
    }))
    .sort((a, b) => b.number_of_likes - a.number_of_likes)
    .slice(0, 100) // Top 100
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
    console.log("Fetching likes from Firestore...");
    const likes = await fetch_all_likes();
    console.log(`Found ${likes.length} tracks with likes`);

    console.log("Computing top 100 liked songs...");
    const top_liked_songs = compute_top_liked_songs(likes);

    const outputPath = "src/database/top_100.json";
    await writeFile(
      outputPath,
      JSON.stringify(top_liked_songs, null, 2),
      "utf8"
    );

    console.log(`Top liked songs written to ${outputPath}`);
    console.log(`Total tracks in top 100: ${top_liked_songs.total_tracks}`);
  } catch (error) {
    console.error("Error generating top liked songs:", error);
    process.exit(1);
  }
}

main();
