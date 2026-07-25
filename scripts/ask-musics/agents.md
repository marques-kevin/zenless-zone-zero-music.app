# Ask Music Requests — Admin Scripts

Users can request new tracks from the app. Requests are stored in Firestore (`ask-musics` collection) with status `pending`, `added`, or `cancelled`.

These scripts standardize how automations and admins inspect and update that queue.

## Prerequisites

Firebase Admin credentials in environment:

- `GATSBY_FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## List pending requests

```bash
yarn ask-musics:list-pending
yarn ask-musics:list-pending --json
yarn ask-musics:list-pending --write-manifest
```

- `--json`: machine-readable output for automations
- `--write-manifest`: writes `scripts/ask-musics/pending-requests.json`
- exits with code `1` when pending requests exist (useful to trigger daily processing)

## Update request status

```bash
yarn ask-musics:update-status --url "https://www.youtube.com/watch?v=..." --status added
yarn ask-musics:update-status --id <firestore-doc-id> --status cancelled --reason "Already in app"
```

Statuses:

- `pending`: waiting for review
- `added`: track was added to the app
- `cancelled`: request declined (`--reason` required)

## Suggested automation flow

1. `yarn ask-musics:list-pending --json --write-manifest`
2. For each URL: download with `yarn mp3`, move/rename into `musics/`
3. `yarn sync-music`
4. `yarn catalog:add-track --track-file <track.json>`
5. `yarn ask-musics:update-status --url "<url>" --status added`
6. If a request cannot be fulfilled: mark it `cancelled` with a reason

See `scripts/catalog/agents.md` for the remote catalog format.
