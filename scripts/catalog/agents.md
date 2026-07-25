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

## Track JSON example

```json
[
  {
    "title": "My Track",
    "title_id": "my-track",
    "artist": "2.6",
    "artist_id": "2.6",
    "source": "/musics/2.6--my-track.mp3",
    "duration": 180,
    "playlist_cover": "/covers/2.6.jpg",
    "playlist_id": "2.6",
    "playlist_name": "2.6",
    "playlist_type": "jukebox",
    "created_at": "2026-07-25"
  }
]
```
