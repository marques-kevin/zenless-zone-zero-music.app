# How Ladders Work

The ladder system allows users to rank their favorite characters, and displays aggregated statistics showing character popularity and rankings across all users.

## Overview

The ladder system uses a **build-time data fetching** approach to minimize Firebase costs:

1. **Runtime**: Users submit their character rankings, which are stored in Firebase Firestore
2. **Build-time**: A script pulls all ladder data from Firebase and computes statistics
3. **Static Build**: The computed statistics are stored in JSON and included in the static build
4. **Result**: The app displays ladder data without making any runtime Firebase reads

This architecture ensures that:

- Firebase read costs are minimal (only during build-time, not on every page load)
- The ladder page loads instantly (no API calls needed)
- Data is always consistent for all users (snapshot at build time)

## Architecture Flow

```
┌─────────────────┐
│   User Browser  │
│                 │
│  Submit Ladder │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Firebase      │
│   Firestore     │
│                 │
│  Store user     │
│  ladder data    │
└────────┬────────┘
         │
         │ (Build-time only)
         ▼
┌─────────────────┐
│  generate-      │
│  ladder-stats   │
│  Script         │
│                 │
│  - Fetch all    │
│    ladders      │
│  - Compute      │
│    statistics   │
│  - Write JSON   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  cms/ladders/   │
│  characters.json │
│                 │
│  Static JSON    │
│  file           │
└────────┬────────┘
         │
         │ (Gatsby build)
         ▼
┌─────────────────┐
│  Static Site    │
│                 │
│  Ladder data    │
│  baked in       │
└─────────────────┘
```

## How It Works

### 1. User Submission (Runtime)

Users can submit their character rankings through the app:

- Each user can rank up to 5 characters (positions 1-5)
- Rankings are stored in Firebase Firestore under the `ladders` collection
- Each document is keyed by `user_id` and contains a `characters` array

**Example Firebase document:**

```json
{
  "user_id": "abc123",
  "characters": ["harumasa", "grace", "lucy", "burnice", "caesar"]
}
```

### 2. Statistics Generation (Build-time)

The `generate-ladder-stats.ts` script processes all ladder data:

**Location**: `scripts/generate-ladder-stats.ts`

**What it does:**

1. **Fetches all ladders** from Firebase Firestore

   - Uses Firebase Admin SDK (server-side)
   - Requires Firebase service account credentials

2. **Computes statistics** for each character:

   - **Points**: Weighted scoring system
     - Position 1 = 5 points
     - Position 2 = 4 points
     - Position 3 = 3 points
     - Position 4 = 2 points
     - Position 5 = 1 point
   - **Total votes**: Number of times a character appears in any position
   - **Popularity**: Percentage of ladders that include the character
   - **Rank**: Overall ranking based on points
   - **Position-specific votes**: Counts for each position (1-5)

3. **Writes JSON file** to `cms/ladders/characters.json`

**Running the script:**

```bash
yarn ladder:stats
```

**Prerequisites:**

- Firebase service account credentials in environment variables:
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

### 3. Build-time Integration

During the Gatsby build process (`gatsby-node.ts`):

1. **Imports the JSON file**:

   ```typescript
   import characters from "./cms/ladders/characters.json";
   ```

2. **Passes data as page context** to the ladder template:

   ```typescript
   createPage({
     path: "/ladders/characters/",
     component: CharactersLadderTemplate,
     context: {
       ladders: {
         characters: characters,
       },
       // ... other context
     },
   });
   ```

3. **Data is baked into the static HTML** - no runtime fetching needed

### 4. Display (Runtime)

The ladder page (`src/templates/ladders/characters.tsx`) receives the data as page context and displays:

- Overall character rankings
- Popularity percentages
- Points and vote counts
- Position-specific statistics

## Data Structure

### Input (Firebase)

Each ladder document in Firestore:

```typescript
{
  characters: string[]; // Array of character names, max 5
}
```

### Output (JSON)

The generated `cms/ladders/characters.json` file structure:

```typescript
{
  total_votes: number; // Total number of users who submitted ladders
  ladder: Array<{
    id: string; // Character name
    rank: number; // Overall rank (1-based)
    points: number; // Total weighted points
    popularity: number; // Percentage [0-100]
  }>;
  characters: Record<
    string,
    {
      id: string;
      total_votes: number; // Times selected in any position
      popularity: number; // Percentage [0-100]
      points: number; // Total weighted points
      rank: number; // Overall rank
      total_votes_1: number; // Votes in position 1
      total_votes_2: number; // Votes in position 2
      total_votes_3: number; // Votes in position 3
      total_votes_4: number; // Votes in position 4
      total_votes_5: number; // Votes in position 5
    }
  >;
}
```

## Cost Optimization

### Why This Approach?

**Problem**: If ladder data were fetched at runtime:

- Every page load would trigger Firebase reads
- With thousands of users, this could result in thousands of reads per day
- Firebase charges per read operation

**Solution**: Build-time data fetching

- Data is fetched **once** during the build process
- All users see the same snapshot (consistent experience)
- Zero runtime Firebase reads for ladder display
- Cost scales with build frequency, not user traffic

**Trade-offs:**

- ✅ Minimal Firebase costs
- ✅ Fast page loads (no API calls)
- ✅ Consistent data for all users
- ❌ Data is only updated when the site is rebuilt
- ❌ Not real-time (snapshot at build time)

## Updating Ladder Data

To update the ladder statistics:

1. **Run the generation script**:

   ```bash
   yarn ladder:stats
   ```

2. **Commit the updated JSON file**:

   ```bash
   git add cms/ladders/characters.json
   git commit -m "Update ladder statistics"
   ```

3. **Rebuild the site**:
   ```bash
   yarn build
   ```

The updated statistics will be included in the next deployment.

## Implementation Details

### Scoring System

The weighted point system ensures that higher positions contribute more to the overall ranking:

- **Position 1**: 5 points (most important)
- **Position 2**: 4 points
- **Position 3**: 3 points
- **Position 4**: 2 points
- **Position 5**: 1 point (least important)

This means a character ranked #1 by 10 users (50 points) ranks higher than a character ranked #2 by 15 users (60 points).

### Character Validation

The script validates character names against the known character list (`src/database/characters.ts`). Unknown characters are ignored to prevent invalid data from affecting statistics.

### Handling Missing Data

All characters from the database are included in the output, even if they have zero votes. This ensures the ladder page always displays all characters with consistent data structure.

## Related Files

- **Script**: `scripts/generate-ladder-stats.ts`
- **Output**: `cms/ladders/characters.json`
- **Template**: `src/templates/ladders/characters.tsx`
- **Build Config**: `gatsby-node.ts`
- **Types**: `src/types/ladders.type.ts`
- **Repository**: `src/repositories/ladder.repository.firebase.ts`
