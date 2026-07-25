When adding keys in i18n, only modify en.json.

Never translate. We already have a script that do that yarn i18n.

## Cursor Cloud specific instructions

- Product: single Gatsby 5 static site ("ZZZ Music", a Zenless Zone Zero soundtrack player). Package manager is `yarn`.
- Run dev with `yarn start` (see `package.json`). It runs two processes concurrently: the Gatsby dev server on port 28473 (`http://localhost:28473`) and a static music server on port 28474 (`npx serve`). Both must be running for audio to play — the player streams from `http://localhost:28474/musics/...` in non-production (`src/utils/get-cdn-url.ts`).
- A `.env` is not committed (gitignored). The app boots without valid keys. Firebase env vars (`GATSBY_FIREBASE_*`) are optional for local dev: with them empty, the app shows a Firebase `auth/invalid-api-key` error on load, but core music playback works fine. Auth, playlists, likes, and ladder features require real Firebase keys.
- Standard commands (in `package.json`): `yarn test` (Vitest), `yarn typecheck` (tsc), `yarn build` (production Gatsby build), `yarn serve` (serve built output). There is no lint script/ESLint config; `yarn typecheck` is the closest static-analysis gate.
- Known pre-existing failures (not environment issues): `yarn test` has 1 failing `addHash` case, and `yarn typecheck` reports errors in `src/components/ui/resizable.tsx`, `src/components/ui/skeleton.tsx`, and `src/hooks/use-toast.ts`. `yarn build` still succeeds.
