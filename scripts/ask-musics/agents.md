# Ask Music Requests — Admin Scripts

Users can request new tracks from the app. Requests are stored in Firestore (`ask-musics` collection) with status `pending`, `added`, or `cancelled`.

## Full pipeline

```bash
# Process all pending requests
yarn ask-musics:process-pending

# Dry run (no download, no writes)
yarn ask-musics:process-pending --dry-run

# Process a single URL
yarn ask-musics:process-pending --url "https://www.youtube.com/watch?v=..."

# Force a version album (default: latest or inferred from title)
yarn ask-musics:process-pending --version 2.8
```

Per request, the pipeline:

1. Fetches YouTube metadata (title, duration)
2. Infers version album from title (or uses `--version`)
3. Downloads MP3 via yt-dlp
4. Moves file to `musics/{version}--{title-id}.mp3`
5. Uploads MP3 to R2
6. Adds track to remote catalog (CRUD)
7. Marks Firestore request as `added`

## Individual commands

```bash
yarn ask-musics:list-pending [--json] [--write-manifest]
yarn ask-musics:update-status --url "..." --status added
yarn ask-musics:update-status --url "..." --status cancelled --reason "..."
```

## Prerequisites

- Firebase Admin credentials
- Cloudflare R2 credentials
- `yt-dlp` and `ffprobe` installed

## Automation (Cursor daily)

```bash
yarn ask-musics:process-pending
```

Exit code `1` if any request failed. Exit code `0` if all processed or nothing pending.
