import {
  Catalog,
  CatalogJson,
  SerializedPlaylist,
  SerializedTrack,
} from "@/types/catalog.type";
import { Playlist } from "@/types/playlist.type";
import { Track } from "@/types/track.type";
import { getCdnUrl } from "./get-cdn-url";

export const CATALOG_PATH = "/catalog/tracks.json";

export const getCatalogUrl = () => getCdnUrl(CATALOG_PATH);

export function deserializeTrack(track: SerializedTrack): Track {
  return {
    ...track,
    created_at: new Date(track.created_at),
  };
}

export function deserializePlaylist(playlist: SerializedPlaylist): Playlist {
  return {
    ...playlist,
    tracks: playlist.tracks.map(deserializeTrack),
  };
}

export function parseCatalog(data: CatalogJson): Catalog {
  const tracks = data.tracks.map(deserializeTrack);
  const official_playlists = data.playlists.official.map(deserializePlaylist);

  return {
    version: data.version,
    updated_at: data.updated_at,
    tracks,
    official_playlists,
    top_100_playlist: deserializePlaylist(data.playlists.top_100),
    most_played_playlist: deserializePlaylist(data.playlists.most_played),
    all_playlists: official_playlists,
  };
}

export async function fetchCatalog(): Promise<Catalog> {
  const response = await fetch(getCatalogUrl());

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.status}`);
  }

  const data = (await response.json()) as CatalogJson;
  return parseCatalog(data);
}
