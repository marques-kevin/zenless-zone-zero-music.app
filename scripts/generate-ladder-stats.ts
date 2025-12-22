import dotenv from "dotenv";
import admin, { ServiceAccount } from "firebase-admin";
import { writeFile } from "fs/promises";

// @ts-ignore - this script runs with tsx and uses the app's path
import { characters as all_characters } from "../src/database/characters";

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

const max_positions = 5;

type Ladder_doc = {
  characters?: string[];
};

type Character_aggregates = {
  name: string;
  totalVotes: number; // number of times selected (any position)
  points: number; // weighted points based on position
  byPosition: number[]; // index 0 => position 1
};

type Ladder_stats_output = {
  total_votes: number;
  ladder: {
    id: string;
    rank: number;
    points: number;
    popularity: number; // percentage [0,100]
  }[];
  characters: Record<
    string,
    {
      id: string;
      total_votes: number;
      popularity: number; // percentage [0,100]
      points: number;
      rank: number;
      total_votes_1: number;
      total_votes_2: number;
      total_votes_3: number;
      total_votes_4: number;
      total_votes_5: number;
    }
  >;
};

async function fetch_all_ladders(): Promise<string[][]> {
  const snapshot = await firestore_db.collection("ladders").get();
  const ladders: string[][] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as Ladder_doc;
    if (Array.isArray(data.characters) && data.characters.length > 0) {
      ladders.push(data.characters.slice(0, max_positions));
    }
  });

  return ladders;
}

function compute_stats(ladders: string[][]): Ladder_stats_output {
  const total_ladders = ladders.length;

  const known_characters = new Set(all_characters.map((c: any) => c.name));

  const aggregates = new Map<string, Character_aggregates>();

  for (const ladder of ladders) {
    ladder.slice(0, max_positions).forEach((character_name, index) => {
      if (!known_characters.has(character_name)) return;

      const key = character_name;
      if (!aggregates.has(key)) {
        aggregates.set(key, {
          name: character_name,
          totalVotes: 0,
          points: 0,
          byPosition: Array(max_positions).fill(0),
        });
      }

      const agg = aggregates.get(key)!;
      const weight = max_positions - index; // 1st -> 5, 2nd -> 4, ..., 5th -> 1
      agg.totalVotes += 1;
      agg.points += weight;
      agg.byPosition[index] += 1;
    });
  }

  // Ensure all characters exist in aggregates, even if they never received votes
  for (const c of all_characters as any[]) {
    const name = c.name as string;
    if (!aggregates.has(name)) {
      aggregates.set(name, {
        name,
        totalVotes: 0,
        points: 0,
        byPosition: Array(max_positions).fill(0),
      });
    }
  }

  // Build per-character summaries
  const summaries = Array.from(aggregates.values()).map((agg) => {
    const ladders_with_char = ladders.filter((ladder) =>
      ladder.includes(agg.name)
    ).length;

    const popularity_pct =
      total_ladders > 0 ? (ladders_with_char / total_ladders) * 100 : 0;

    return {
      id: agg.name,
      totalVotes: agg.totalVotes, // simple count of selections
      points: agg.points, // weighted points
      popularity: popularity_pct,
      byPosition: agg.byPosition,
    };
  });

  // Ladder array: sorted by points (totalVotes) descending, ranked
  const ladder = summaries
    .slice()
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({
      id: item.id,
      rank: index + 1,
      points: item.points,
      popularity: item.popularity,
    }));

  // Entities map
  const entities: Ladder_stats_output["characters"] = {};
  for (const item of summaries) {
    const ladderEntry = ladder.find((entry) => entry.id === item.id);

    entities[item.id] = {
      id: item.id,
      total_votes: item.totalVotes,
      popularity: item.popularity,
      points: item.points,
      rank: ladderEntry ? ladderEntry.rank : 0,
      total_votes_1: item.byPosition[0] ?? 0,
      total_votes_2: item.byPosition[1] ?? 0,
      total_votes_3: item.byPosition[2] ?? 0,
      total_votes_4: item.byPosition[3] ?? 0,
      total_votes_5: item.byPosition[4] ?? 0,
    };
  }

  return {
    // total_votes: number of users (ladders) that voted
    total_votes: total_ladders,
    ladder,
    characters: entities,
  };
}

async function main() {
  try {
    console.log("Fetching ladders from Firestore...");
    const ladders = await fetch_all_ladders();
    console.log(`Found ${ladders.length} ladders`);

    console.log("Computing stats...");
    const stats = compute_stats(ladders);

    const outputPath = "cms/ladders/characters.json";
    await writeFile(outputPath, JSON.stringify(stats, null, 2), "utf8");

    console.log(`Stats written to ${outputPath}`);
  } catch (error) {
    console.error("Error generating ladder stats:", error);
    process.exit(1);
  }
}

main();
