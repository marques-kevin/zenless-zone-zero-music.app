# Catalog JSON

Remote music catalog served from R2 at `/catalog/tracks.json`.

Once online, the catalog is treated as a **database**: only CRUD operations are allowed. The full JSON cannot be overwritten.

## Typing

| Type | File |
|------|------|
| `CatalogJson` | [`src/types/catalog.type.ts`](../src/types/catalog.type.ts) |
| `SerializedTrack` | same |
| `Track` (base fields) | [`src/types/track.type.ts`](../src/types/track.type.ts) |

## Examples

- [`track.example.json`](./track.example.json) — single track for `catalog:add-track`
- [`catalog.example.json`](./catalog.example.json) — full structure

## Commands

See [`scripts/catalog/agents.md`](../scripts/catalog/agents.md).

| Command | Touches R2? |
|---------|-------------|
| `catalog:pull` | No (download only) |
| `catalog:export` | No (local file only) |
| `catalog:bootstrap` | Yes, once, if empty |
| `catalog:add-track` | Yes (CRUD) |
| `catalog:update-track` | Yes (CRUD) |
| `catalog:remove-track` | Yes (CRUD) |
| `catalog:update-playlist` | Yes (CRUD) |
| ~~`catalog:sync`~~ | Removed |
