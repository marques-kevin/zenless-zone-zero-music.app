When adding keys in i18n, only modify en.json.

Never translate. We already have a script that do that yarn i18n.

## Cursor Cloud specific instructions

- Product: single Gatsby 5 static site ("ZZZ Music", a Zenless Zone Zero soundtrack player). Package manager is `yarn`.
- Run dev with `yarn start` (see `package.json`). It runs two processes concurrently: the Gatsby dev server on port 28473 (`http://localhost:28473`) and a static music server on port 28474 (`npx serve`). Both must be running for audio to play — the player streams from `http://localhost:28474/musics/...` in non-production (`src/utils/get-cdn-url.ts`).
- A `.env` is not committed (gitignored). The app boots without valid keys. Firebase env vars (`GATSBY_FIREBASE_*`) are optional for local dev: with them empty, the app shows a Firebase `auth/invalid-api-key` error on load, but core music playback works fine. Auth, playlists, likes, and ladder features require real Firebase keys.
- Standard commands (in `package.json`): `yarn test` (Vitest), `yarn typecheck` (tsc), `yarn build` (production Gatsby build), `yarn serve` (serve built output). There is no lint script/ESLint config; `yarn typecheck` is the closest static-analysis gate.
- Known pre-existing failures (not environment issues): `yarn test` has 1 failing `addHash` case, and `yarn typecheck` reports errors in `src/components/ui/resizable.tsx`, `src/components/ui/skeleton.tsx`, and `src/hooks/use-toast.ts`. `yarn build` still succeeds.

### Music helper scripts (Docker / ffmpeg)

- `./scripts/get-music-durations.sh` needs `ffprobe` (ffmpeg), which is installed system-wide — it works directly, no Docker needed.
- `yarn mp3` (`scripts/youtube-downloader/download.ts`), `yarn playlist`, and `yarn check-zzz-playlists` require **Docker**: they build/run the `zzz-ytmp3` image (`scripts/youtube-downloader/ytmp3.dockerfile`, a `yt-dlp` + ffmpeg container) and call the `docker` CLI directly.
- The Docker daemon does not auto-start (no systemd here). Start it once with `sudo dockerd` (e.g. in a background tmux session). The `ubuntu` user is in the `docker` group, so `docker`/`yarn mp3` run without `sudo` in a fresh login shell; in an already-open shell, prefix with `sg docker -c '...'`.
- `yarn mp3` reads URLs from `scripts/youtube-downloader/files-to-download.txt` and writes MP3s to `scripts/youtube-downloader/files/`. From a cloud/datacenter IP, YouTube often returns "Sign in to confirm you're not a bot"; downloads then need cookies (`--cookies`/`--cookies-from-browser`). This is a YouTube-side limitation, not an environment problem.
