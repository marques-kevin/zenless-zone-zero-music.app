import { uniqBy } from "lodash";
import {
  CatalogJson,
  SerializedPlaylist,
  SerializedTrack,
} from "../../src/types/catalog.type";
import { Track } from "../../src/types/track.type";

export function serializeTrack(track: Track): SerializedTrack {
  return {
    ...track,
    created_at: track.created_at.toISOString(),
  };
}

export function deserializeTrack(track: SerializedTrack): Track {
  return {
    ...track,
    created_at: new Date(track.created_at),
  };
}

export function buildOfficialPlaylists(
  catalogTracks: Track[]
): SerializedPlaylist[] {
  return uniqBy(catalogTracks, (track) => track.playlist_id)
    .map((playlist) => ({
      playlist_name: playlist.playlist_name,
      playlist_cover: playlist.playlist_cover,
      playlist_id: playlist.playlist_id,
      playlist_type: playlist.playlist_type,
      tracks: catalogTracks
        .filter((track) => track.playlist_id === playlist.playlist_id)
        .map(serializeTrack),
    }))
    .reverse();
}

export function rebuildCatalogPlaylists(catalog: CatalogJson): CatalogJson {
  const catalogTracks = catalog.tracks.map(deserializeTrack);

  return {
    ...catalog,
    updated_at: new Date().toISOString(),
    playlists: {
      official: buildOfficialPlaylists(catalogTracks),
      top_100: catalog.playlists.top_100,
      most_played: catalog.playlists.most_played,
    },
  };
}
