# Music Catalog

The app loads its full track catalog from a remote JSON file at startup.

## Source of truth

- **Runtime**: `catalog/tracks.json` on Cloudflare R2
- **Authoring (legacy)**: `src/database/albums/*.ts` used only by `yarn catalog:export`

## Commands

```bash
# Download remote catalog to local (safe)
yarn catalog:pull

# Export local TS database to catalog/tracks.json
yarn catalog:export
yarn catalog:export --merge-remote

# Upload catalog/tracks.json to R2 (with safety checks)
yarn catalog:sync
yarn catalog:sync --force

# Add track(s) from a JSON file (preferred for automation)
yarn catalog:add-track --track-file path/to/track.json --remote
```

## Avoid overwriting the catalog

| Command | Risk |
|---------|------|
| `catalog:add-track --remote` | Safe — reads remote, appends, uploads |
| `catalog:pull` | Safe — download only |
| `catalog:export` | Drops R2-only tracks unless `--merge-remote` |
| `catalog:sync` | Blocked if local is older/smaller than remote |
| `catalog:sync --force` | Dangerous — overwrites remote |

Never run `catalog:export && catalog:sync` after automation additions.

## Typing & examples

- Types: `src/types/catalog.type.ts` (`CatalogJson`, `SerializedTrack`)
- Docs: `catalog/README.md`
- Examples: `catalog/track.example.json`, `catalog/catalog.example.json`

## Track JSON example

Use `catalog/track.example.json` as a template for `yarn catalog:add-track`.
