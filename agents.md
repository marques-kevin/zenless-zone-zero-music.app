When adding keys in i18n, only modify en.json.

Never translate. We already have a script that do that yarn i18n.

## Cursor Cloud specific instructions

- Product: single Gatsby 5 static site ("ZZZ Music", a Zenless Zone Zero soundtrack player). Package manager is `yarn`.
- Run dev with `yarn start` (Gatsby on port 28473 + local music server on 28474). Track metadata lives in `src/database/`; MP3s are **not in git** — use `yarn download-music` to fetch them from Cloudflare R2 into `musics/` for local dev. Production serves audio from R2 (`src/utils/get-cdn-url.ts`). When adding tracks manually, run `yarn sync-music` to upload new local MP3s to R2. `ask-musics:process-pending` uploads to R2 automatically.
- A `.env` is not committed (gitignored). The app boots without valid keys. Firebase env vars (`GATSBY_FIREBASE_*`) are optional for local dev: with them empty, the app shows a Firebase `auth/invalid-api-key` error on load, but core music playback works fine. Auth, playlists, likes, and ladder features require real Firebase keys.
- Standard commands (in `package.json`): `yarn test` (Vitest), `yarn typecheck` (tsc), `yarn build` (production Gatsby build), `yarn serve` (serve built output). There is no lint script/ESLint config; `yarn typecheck` is the closest static-analysis gate.
- Known pre-existing failures (not environment issues): `yarn test` has 1 failing `addHash` case, and `yarn typecheck` reports errors in `src/components/ui/resizable.tsx`, `src/components/ui/skeleton.tsx`, and `src/hooks/use-toast.ts`. `yarn build` still succeeds.

### Music helper scripts (yt-dlp / ffmpeg)

- These scripts call the local `yt-dlp` binary directly (no Docker). `ffmpeg`/`ffprobe` is installed system-wide.
- `./scripts/get-music-durations.sh` uses `ffprobe`.
- `yarn mp3` (`scripts/youtube-downloader/download.ts`), `yarn playlist`, and `yarn check-zzz-playlists` use `yt-dlp` via the shared helper `scripts/youtube-downloader/ytdlp.ts`. `yt-dlp` must be on `PATH` (the update script installs it to `/usr/local/bin`).
- `yarn mp3` reads URLs from `scripts/youtube-downloader/files-to-download.txt` and writes MP3s to `scripts/youtube-downloader/files/`.
