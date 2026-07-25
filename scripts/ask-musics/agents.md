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

## YouTube credentials (anti-bot)

YouTube often blocks datacenter IPs. Configure **one** of these in `.env` or Cursor secrets:

### Option A — Local (Mac/Linux with browser)

Reuse cookies from a browser where you're logged into YouTube:

```bash
# .env
YTDLP_COOKIES_BROWSER=chrome
# or: firefox, brave, chromium, edge, safari
```

Then test:

```bash
yarn ask-musics:process-pending --url "https://www.youtube.com/watch?v=..." --dry-run
```

### Option B — Cloud / automation (recommended for Cursor agent)

1. Install a cookies exporter extension in Chrome (e.g. "Get cookies.txt LOCALLY")
2. Go to [youtube.com](https://www.youtube.com) while logged in
3. Export cookies as `cookies.txt` (Netscape format)
4. Save the file **outside the repo** (e.g. `~/secrets/youtube-cookies.txt`)
5. Add to Cursor environment secrets:

```bash
YTDLP_COOKIES_FILE=/path/to/youtube-cookies.txt
```

Or in the project's `.env` (gitignored):

```bash
YTDLP_COOKIES_FILE=./secrets/youtube-cookies.txt
```

Add `secrets/` to `.gitignore` if you store cookies locally.

**Priority:** `YTDLP_COOKIES_FILE` overrides `YTDLP_COOKIES_BROWSER` if both are set.

Cookies expire — re-export every few weeks if downloads start failing again.

## Prerequisites

- Firebase Admin credentials
- Cloudflare R2 credentials
- `yt-dlp` and `ffprobe` installed
- YouTube cookies (see above) if downloads are blocked

## Automation (Cursor daily)

```bash
yarn ask-musics:process-pending
```

Exit code `1` if any request failed. Exit code `0` if all processed or nothing pending.
