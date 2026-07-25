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

1. Fetches YouTube metadata (title, description, channel, duration)
2. Infers version album from title (or uses `--version`)
3. Downloads MP3 via yt-dlp
4. Moves file to `musics/{version}--{title-id}.mp3` (local staging only)
5. Uploads MP3 to R2
6. Adds track to remote catalog (CRUD)
7. Marks Firestore request as `added`
8. Deletes the local MP3 (R2 is the source of truth; `musics/*.mp3` is gitignored)

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
4. Add the file content to Cursor environment secrets:

```bash
YTDLP_COOKIES_CONTENT=<paste full cookies.txt content here>
```

Cursor secrets support multiline values. If newlines are escaped, the script normalizes `\n` automatically.

### Option C — Local file path

Save the exported file outside the repo (e.g. `~/secrets/youtube-cookies.txt`) or in the project:

```bash
YTDLP_COOKIES_FILE=./secrets/youtube-cookies.txt
```

Add `secrets/` to `.gitignore` if you store cookies locally.

**Priority:** `YTDLP_COOKIES_FILE` > `YTDLP_COOKIES_CONTENT` > `YTDLP_COOKIES_BROWSER`

Cookies expire — re-export every few weeks if downloads start failing again.

## Prerequisites

- Firebase Admin credentials
- Cloudflare R2 credentials
- `yt-dlp` and `ffprobe` installed
- YouTube cookies (see above) if downloads are blocked

## ZZZ validation (required before downloading)

Only accept tracks that belong to **Zenless Zone Zero**. Validate from the **video title and description** — that is enough; no need to dig further.

**Always validate before downloading the MP3.** Do not call `process-pending` without `--dry-run` until ZZZ validation passes.

### Step 1 — Read the YouTube page (before any download)

From cloud/datacenter IPs, `yt-dlp` is often blocked ("Sign in to confirm you're not a bot"). **Do not rely on yt-dlp for the first validation step.**

Read the public YouTube page for the URL (e.g. web fetch / browser) and extract:

- Video **title**
- Video **description** (if visible on the page)

If `--dry-run` works (yt-dlp returns title + description), you may use it instead — but prefer reading the page when yt-dlp fails.

**Do not say YouTube is "resolved" or "working" until a real `process-pending` run (without `--dry-run`) successfully downloads the MP3.**

### Step 2 — Validate ZZZ, then act

```bash
# After reading title + description from the page:

# 2a. If ZZZ → download and add
yarn ask-musics:process-pending --url "<youtube-url>"

# 2b. If not ZZZ → reject (no download)
yarn ask-musics:update-status --url "<youtube-url>" --status cancelled --reason "Not ZZZ music"
```

Optional: `yarn ask-musics:process-pending --url "<youtube-url>" --dry-run` to double-check metadata via yt-dlp when cookies work. This is **not** a substitute for reading the page when yt-dlp is blocked.

For a daily batch: list pending → read each page → validate → process or cancel → next request.

### Accept when title or description mentions

- `Zenless Zone Zero`, `ZZZ`, `ゼンレスゾーンゼロ`
- Official publisher: `HoYoverse`, `miHoYo`, `COGNOSPHERE`
- ZZZ soundtrack context: `OST`, `Agent Story`, `EP -`, `Battle Theme`, `Exploration Theme`
- Known ZZZ character names (e.g. Nicole, Ellen, Yixuan, Yuzuha)
- Official ZZZ channel or playlist references

### Reject when

- Clearly another game (`Genshin Impact`, `Honkai`, `Wuthering Waves`, etc.) with no ZZZ link
- Fan cover / remix / unrelated music with no ZZZ mention in title **or** description
- Title and description together give **no credible link** to Zenless Zone Zero

When unsure, prefer **rejecting** with reason `"Not ZZZ music"` rather than adding unrelated tracks.

## Automation (Cursor daily)

```bash
yarn ask-musics:list-pending
# For each URL: read YouTube page → validate ZZZ → process or cancel (never download before validation)
yarn ask-musics:process-pending
yarn ask-musics:send-report
```

`process-pending` writes `scripts/ask-musics/last-run-report.json` and does **not** post to Discord.
The agent sends one report at the end with `send-report`.

Exit code `1` if any request failed. Exit code `0` if all processed or nothing pending.

### Discord report

When `ASK_MUSIC_DISCORD_WEBHOOK_URL` is set, post a single summary after the run:

```bash
yarn ask-musics:send-report
```

Optional:

```bash
yarn ask-musics:send-report --file scripts/ask-musics/last-run-report.json
yarn ask-musics:send-report --error "Firestore unavailable"
```

Add the webhook URL to Cursor environment secrets or `.env`:

```bash
ASK_MUSIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```
