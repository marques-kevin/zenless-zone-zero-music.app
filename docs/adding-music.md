# Adding Music to the Database

This guide explains how to add new music tracks to the application database.

## Overview

Music tracks are stored in the `musics/` directory and their metadata is defined in TypeScript files within `src/database/`. The application uses a file-based database system where tracks are organized by albums and artists.

## Step-by-Step Process

### 1. Prepare the Music File

You have two options for obtaining music files:

#### Option A: Using the YouTube Downloader (Recommended)

The project includes a Docker-based YouTube downloader that automatically converts videos to MP3.

**Prerequisites:**

- Docker must be installed and running on your system

**Steps:**

1. **Add YouTube URLs** to `scripts/youtube-downloader/files-to-download.txt`:

   - One URL per line
   - Lines starting with `#` or blank lines are ignored
   - Example:
     ```
     https://www.youtube.com/watch?v=example1
     https://www.youtube.com/watch?v=example2
     ```

2. **Run the downloader**:

   ```bash
   yarn mp3
   ```

   - The script will automatically build the Docker image if needed (first run only)
   - Downloads will be saved to `scripts/youtube-downloader/files/`

3. **Move and rename files**:
   - Move downloaded files from `scripts/youtube-downloader/files/` to `musics/`
   - Rename files according to the naming convention (see below)

#### Option B: Manual Download

1. **Download or convert your music file** to MP3 format

   - You can use tools like [y2mate.nu](https://y2mate.nu) to convert YouTube videos to MP3

2. **Place the file** in the `musics/` directory

#### File Naming Convention

Regardless of how you obtain the file, **name it correctly**:

- Filenames should begin with the Zenless Zone Zero version (e.g., `2.4`)
- Follow with the title in kebab-case
- Format: `{version}--{title-in-kebab-case}.mp3`
- Example: `Where Winds Meet (Battle Theme).mp3` → `2.4--where-winds-meet--battle-theme.mp3`

**Note:** Files downloaded via `yarn mp3` will have their original YouTube titles and need to be renamed manually to match this convention.

### 2. Get the Track Duration

You need to know the duration of the track in seconds. Use the provided script:

```bash
./scripts/get-music-durations.sh "your-filename.mp3"
```

Or use `ffprobe` directly:

```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 musics/your-filename.mp3
```

### 3. Determine the Album and Artist

- **Albums** are defined in `src/database/albums.ts`

  - Albums can be version-based (e.g., `1.4`, `2.4`) or character-based (e.g., `anby`, `ellen`)
  - Albums can also be jukebox collections (e.g., `come-alive`, `roaming-the-ether`)

- **Artists** are defined in `src/database/artists.ts`
  - Currently, ZZZ versions are used as artists (e.g., `1.4`, `2.4`, `san-z`)

### 4. Add the Track Metadata

#### Option A: Adding to an Existing Album File

If the album already has a dedicated file in `src/database/albums/`:

1. Open the album file (e.g., `src/database/albums/1.4.ts`)
2. Add a new track object to the array:

```typescript
{
  title: "Your Track Title",
  title_id: "your-track-title-id", // kebab-case, unique identifier
  source: "/musics/your-filename.mp3", // path relative to public directory
  duration: 183, // duration in seconds
  created_at: new Date("2024-12-22"), // release date
  ...Artists["1.4"], // spread the artist object
  ...Albums["1.4"], // spread the album object
}
```

#### Option B: Adding to the Main Tracks File

If adding to a collection defined in `src/database/tracks.ts`:

1. Open `src/database/tracks.ts`
2. Find or create the appropriate track array (e.g., `Album14Tracks`)
3. Add your track following the same pattern
4. Make sure the array is exported and included in the final `Tracks` export

### 5. Update Album/Artist References (if needed)

- If creating a new album, add it to `src/database/albums.ts`
- If creating a new artist, add it to `src/database/artists.ts`
- Ensure the album is imported and used in `src/database/tracks.ts`

### 6. Multiple Albums

If a track belongs to multiple albums (e.g., a version album and a character album):

1. Create separate track entries for each album
2. Use the same `title_id` but different album spreads
3. Example: A track in both `1.4` album and `anby` character album

### 7. Sync to Cloud Storage (Optional)

If you have Cloudflare R2 configured, sync the music files:

```bash
yarn sync-music
```

This script will:

- Compare local files with R2 storage
- Upload any missing files
- Ensure all music files are available in the cloud

## Example: Adding a New Track

Let's say you want to add a new track "Battle Theme" from version 2.5:

1. **File**: `musics/2.5--battle-theme.mp3`

2. **Get duration**: `./scripts/get-music-durations.sh "2.5--battle-theme.mp3"` → `245 seconds`

3. **Add to album file** (`src/database/albums/2.5.ts`):

```typescript
import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const Album25: Track[] = [
  {
    title: "Battle Theme",
    title_id: "battle-theme",
    source: "/musics/2.5--battle-theme.mp3",
    duration: 245,
    created_at: new Date("2024-12-22"),
    ...Artists["2.5"],
    ...Albums["2.5"],
  },
];
```

4. **Ensure album exists** in `src/database/albums.ts`:

```typescript
"2.5": {
  playlist_name: "Version 2.5",
  playlist_cover: "/covers/2.5.jpg",
  playlist_id: "2.5",
  playlist_type: "jukebox",
}
```

5. **Ensure artist exists** in `src/database/artists.ts`:

```typescript
["2.5"]: {
  artist: "2.5",
  artist_id: "2.5",
}
```

6. **Import and export** in `src/database/tracks.ts`:

```typescript
import { Album25Tracks } from "./albums/2.5";

// ... in the export
export const Tracks: Track[] = [
  // ... other tracks
  ...Album25Tracks,
];
```

## Track Properties

Each track must have the following properties:

- `title`: Display name of the track
- `title_id`: Unique identifier in kebab-case
- `source`: Path to the MP3 file (relative to public directory)
- `duration`: Duration in seconds (number)
- `created_at`: Release date (Date object)
- `artist`: Artist name (from Artists spread)
- `artist_id`: Artist identifier (from Artists spread)
- `playlist_name`: Album/playlist name (from Albums spread)
- `playlist_cover`: Cover image path (from Albums spread)
- `playlist_id`: Album/playlist identifier (from Albums spread)
- `playlist_type`: Either `"jukebox"` or `"character"` (from Albums spread)

## Notes

- Always use kebab-case for `title_id` and filenames
- Ensure `title_id` is unique across all tracks
- The `source` path should match the actual file location in the `musics/` directory
- Duration should be accurate (use the script to get exact values)
- Cover images should be placed in `static/covers/` or `static/characters/` depending on the album type
