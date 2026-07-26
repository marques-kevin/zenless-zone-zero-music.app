# Ask Music Requests — Admin Scripts

Users can request new tracks from the app. Requests are stored in Firestore (`ask-musics` collection) with status `pending`, `added`, or `cancelled`.

Everything is **local**: MP3 files live in `musics/`, track metadata in `src/database/`. Run these scripts on your machine — there is no remote catalog and no R2 upload step.

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
4. Moves file to `musics/{version}--{title-id}.mp3`
5. Appends track entry to `src/database/albums/<version>.ts`
6. Marks Firestore request as `added`

After a successful batch, **commit** the new MP3(s) and the updated album file(s), then deploy the site as usual.

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

## Automation (local)

Run these commands on your machine when you want to process pending requests:

```bash
yarn ask-musics:list-pending
# For each URL: validate ZZZ → process or cancel
yarn ask-musics:process-pending
yarn ask-musics:send-report
# Then commit musics/ + src/database/albums/ changes and deploy
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

Add the webhook URL to `.env`:

```bash
ASK_MUSIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```
