# Music Catalog

The app loads its full track catalog from a remote JSON file at startup.

## Source of truth

- **Runtime**: `catalog/tracks.json` on Cloudflare R2
- **Authoring (legacy)**: `src/database/albums/*.ts` used only by `yarn catalog:export`

## Commands

```bash
# Export local TS database to catalog/tracks.json
yarn catalog:export

# Upload catalog/tracks.json to R2
yarn catalog:sync

# Add track(s) from a JSON file
yarn catalog:add-track --track-file path/to/track.json --remote
```

## Automation flow

1. `yarn ask-musics:list-pending --write-manifest`
2. Download and move MP3 into `musics/`
3. `yarn sync-music`
4. Create a track JSON file and run `yarn catalog:add-track --track-file ... --remote`
5. `yarn ask-musics:update-status --url "..." --status added`

No Gatsby rebuild or PR is required for new tracks once the catalog is on R2.

Important: the runtime catalog lives on R2. Do not run `yarn catalog:export && yarn catalog:sync` in CI after automation adds tracks, or you will overwrite remote additions. Use `catalog:add-track --remote` for async additions.

## Typing & examples

- Types: `src/types/catalog.type.ts` (`CatalogJson`, `SerializedTrack`)
- Docs: `catalog/README.md`
- Examples: `catalog/track.example.json`, `catalog/catalog.example.json`

## Track JSON example

Use `catalog/track.example.json` as a template for `yarn catalog:add-track`.
