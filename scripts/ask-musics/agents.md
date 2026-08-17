# Ask Music Requests — Admin Scripts

Users can request new tracks from the app. Requests are stored in Firestore (`ask-musics` collection) with status `pending`, `added`, or `cancelled`.

Processing is **local**: MP3 files are saved to `musics/` (gitignored) and track metadata is committed in `src/database/`. Run these scripts on your machine.

`process-pending` uploads each new MP3 to Cloudflare R2 automatically. Only commit the database changes — not `musics/`.

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
3. Translates the track title to **English** if the YouTube title is not in English (use the description when it contains an official English name)
4. Downloads MP3 via yt-dlp
5. Moves file to `musics/{version}--{title-id}.mp3`
6. Appends track entry to `src/database/albums/<version>.ts`
7. Uploads MP3 to Cloudflare R2
8. Marks Firestore request as `added`

After a successful batch, **commit** the updated album file(s) and open a PR. MP3s are already on R2 — do not commit `musics/`.

## Individual commands

```bash
yarn ask-musics:list-pending [--json] [--write-manifest]
yarn ask-musics:update-status --url "..." --status added
yarn ask-musics:update-status --url "..." --status cancelled --reason "..."
```

## Local playback

In dev, `yarn start` runs Gatsby (port 28473) and `yarn serve:musics` (port 28474). New tracks in `musics/` are playable locally without any extra upload step.

## Prerequisites

- Firebase Admin credentials (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- Cloudflare R2 credentials (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET_NAME`)
- `yt-dlp` and `ffprobe` installed

## ZZZ validation (required before downloading)

Only accept tracks that belong to **Zenless Zone Zero**. Validate from the **video title and description** — that is enough; no need to dig further.

**Always validate before downloading the MP3.** Do not call `process-pending` without `--dry-run` until ZZZ validation passes.

### Step 1 — Read metadata

Use `--dry-run` or read the YouTube page for the URL and extract:

- Video **title**
- Video **description**

### Step 2 — Validate ZZZ, then act

```bash
# After reading title + description:

# 2a. If ZZZ → download and add
yarn ask-musics:process-pending --url "<youtube-url>"

# 2b. If not ZZZ → reject (no download)
yarn ask-musics:update-status --url "<youtube-url>" --status cancelled --reason "Not ZZZ music"
```

Optional: `yarn ask-musics:process-pending --url "<youtube-url>" --dry-run` to preview metadata before downloading.

For a batch: list pending → validate each URL → process or cancel → next request.

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

## Track titles (English only)

All track titles stored in `src/database/` must be in **English**.

- If the YouTube title is in Japanese, Chinese, or another language, translate it to English before adding the track
- Use the video **description** when it contains the official English track name
- Keep proper nouns as in-game (character names, locations, etc.)
- `title_id` is derived from the English title

Example:

- YouTube title: `【ゼンゼロ 3.0 OST】「ヴェリナ PV」お茶会は、いつも通り「BGM」Off Vocal`
- Description: `Velina Trailer Theme - A Routine Tea Party | Soundtrack | Zenless Zone Zero 3.0 OST`
- Stored title: `Velina PV - A Routine Tea Party (Off Vocal)`

## Automation (local)

Run these commands on your machine when you want to process pending requests:

```bash
yarn ask-musics:list-pending
# For each URL: validate ZZZ → process or cancel
yarn ask-musics:process-pending
# Then commit src/database/albums/ changes and open a PR
```

`process-pending` writes `scripts/ask-musics/last-run-report.json` for local review.

Exit code `1` if any request failed. Exit code `0` if all processed or nothing pending.
