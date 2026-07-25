# Music Catalog

The remote catalog on R2 is the source of truth. Only CRUD operations are allowed.

## Typing

TypeScript types: [`src/types/catalog.type.ts`](../src/types/catalog.type.ts)

Examples: [`track.example.json`](./track.example.json), [`catalog.example.json`](./catalog.example.json)

## Commands

```bash
# Tracks
yarn catalog:add-track --track-file track.json
yarn catalog:update-track --title-id <id> --playlist-id <id> --track-file track.json
yarn catalog:remove-track --title-id <id> --playlist-id <id>

# Playlists (metadata on all tracks in the playlist)
yarn catalog:update-playlist --playlist-id <id> --name "..." --cover "/covers/....jpg"
```

There is **no** full-catalog sync or overwrite command.

## Automation flow

```bash
yarn ask-musics:process-pending
```

This downloads the track, uploads the MP3 to R2, adds it to the catalog, and marks the Firestore request as `added`.
