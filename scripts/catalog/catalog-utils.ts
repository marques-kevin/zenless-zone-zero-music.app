import { CatalogJson } from "../../src/types/catalog.type";
import { Track } from "../../src/types/track.type";
import {
  deserializeTrack,
  rebuildCatalogPlaylists,
  serializeTrack,
} from "./build-catalog";

export function parseCatalogJson(content: string): CatalogJson {
  return JSON.parse(content) as CatalogJson;
}

export function getTrackKey(track: Pick<Track, "title_id" | "playlist_id">): string {
  return `${track.title_id}::${track.playlist_id}`;
}

export function mergeTrackLists(
  baseTracks: Track[],
  incomingTracks: Track[]
): Track[] {
  const merged = new Map<string, Track>();

  for (const track of baseTracks) {
    merged.set(getTrackKey(track), track);
  }

  for (const track of incomingTracks) {
    merged.set(getTrackKey(track), track);
  }

  return [...merged.values()];
}

export function getCatalogStats(catalog: CatalogJson) {
  return {
    version: catalog.version,
    track_count: catalog.tracks.length,
    playlist_count: catalog.playlists.official.length,
    updated_at: catalog.updated_at,
  };
}

export function rebuildCatalog(catalog: CatalogJson): CatalogJson {
  return rebuildCatalogPlaylists(catalog);
}

export function serializeTracks(tracks: Track[]) {
  return tracks.map(serializeTrack);
}

export function deserializeTracks(tracks: CatalogJson["tracks"]) {
  return tracks.map(deserializeTrack);
}
