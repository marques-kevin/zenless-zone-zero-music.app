# Music Catalog

The remote catalog on R2 is treated as a database. Once bootstrapped, only CRUD operations are allowed.

## Typing

TypeScript types: [`src/types/catalog.type.ts`](../src/types/catalog.type.ts)

Examples: [`track.example.json`](./track.example.json), [`catalog.example.json`](./catalog.example.json)

## Commands

### Read-only

```bash
yarn catalog:pull      # download R2 → local (inspection / dev)
yarn catalog:export    # export TS → local file (never uploads)
```

### One-time setup

```bash
yarn catalog:bootstrap   # initialize R2 from TS (only if R2 is empty)
```

### CRUD (remote database)

```bash
# Tracks
yarn catalog:add-track --track-file track.json
yarn catalog:update-track --title-id <id> --playlist-id <id> --track-file track.json
yarn catalog:remove-track --title-id <id> --playlist-id <id>

# Playlists (metadata on all tracks in the playlist)
yarn catalog:update-playlist --playlist-id <id> --name "..." --cover "/covers/....jpg"
```

There is **no** `catalog:sync` command. The full JSON cannot be overwritten.

## Automation flow

```bash
yarn ask-musics:list-pending --write-manifest
yarn sync-music
yarn catalog:add-track --track-file track.json
yarn ask-musics:update-status --url "..." --status added
```
