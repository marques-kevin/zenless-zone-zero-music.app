# Catalog JSON

Remote music catalog served from R2 at `/catalog/tracks.json`.

## Typing

TypeScript types live in [`src/types/catalog.type.ts`](../src/types/catalog.type.ts):

| Type | Usage |
|------|-------|
| `CatalogJson` | Full `catalog/tracks.json` file on R2 |
| `SerializedTrack` | One track entry in the JSON |
| `SerializedPlaylist` | One playlist entry in the JSON |
| `Catalog` | Hydrated version used in the app (with `Date` objects) |

Base track fields are defined in [`src/types/track.type.ts`](../src/types/track.type.ts).

## Examples

| File | Description |
|------|-------------|
| [`track.example.json`](./track.example.json) | Single track for `yarn catalog:add-track` |
| [`catalog.example.json`](./catalog.example.json) | Full catalog structure |

## `playlist_type` values

- `jukebox` — version album (e.g. `2.6`)
- `character` — character album
- `most_liked` — top 100 playlist
- `most_played` — most played playlist

## Required fields per track

```ts
{
  title: string;           // Display name
  title_id: string;        // Unique kebab-case ID (used for likes, share URLs)
  artist: string;
  artist_id: string;
  source: string;          // "/musics/2.6--my-track.mp3"
  duration: number;        // Seconds
  playlist_cover: string;  // "/covers/2.6.jpg" or "/characters/foo.webp"
  playlist_id: string;
  playlist_name: string;
  playlist_type: "jukebox" | "character" | "most_liked" | "most_played";
  created_at: string;      // ISO 8601 date
  number_of_likes?: number;  // Optional, for top 100
  number_of_plays?: number;  // Optional, for most played
}
```

## Commands

```bash
# Download remote catalog to local (safe, preferred)
yarn catalog:pull

# Export local TS to catalog/tracks.json (legacy authoring)
yarn catalog:export
yarn catalog:export --merge-remote   # preserves R2-only tracks

# Upload local catalog to R2 (protected against accidental overwrite)
yarn catalog:sync
yarn catalog:sync --force            # dangerous, overwrites remote

# Add track(s) directly on R2 (preferred for automation)
yarn catalog:add-track --track-file path/to/track.json --remote
```

## Avoid overwriting the catalog

R2 is the runtime source of truth. These commands are safe:

- `catalog:pull` — download remote → local
- `catalog:add-track --remote` — append on R2

These can be dangerous:

- `catalog:export` without `--merge-remote` — regenerates from TS, drops R2-only tracks locally
- `catalog:sync` — blocked if local is older/smaller than remote (use `--force` to override)

`catalog:sync` refuses to upload when:

- local `version` < remote `version`
- local track count < remote track count

See [`scripts/catalog/agents.md`](../scripts/catalog/agents.md).
