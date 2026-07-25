import { uniqBy } from "lodash";
import { tracks } from "../../src/database/tracks";
import { songs as top_100_songs } from "../../src/database/top_100.json";
import { songs as most_played_songs } from "../../src/database/most_played.json";
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

export function buildCatalog(params?: {
  version?: number;
  updated_at?: string;
  tracks?: Track[];
}): CatalogJson {
  const catalogTracks = params?.tracks ?? tracks;

  const official = buildOfficialPlaylists(catalogTracks);

  const top_100: SerializedPlaylist = {
    playlist_name: "Top 10 Liked Songs",
    playlist_cover: "/covers/top-100.jpg",
    playlist_id: "top-100",
    playlist_type: "most_liked",
    tracks: top_100_songs.slice(0, 10).flatMap((song) => {
      const track = catalogTracks.find((item) => item.title_id === song.title_id);
      if (!track) return [];

      return [
        serializeTrack({
          ...track,
          number_of_likes: song.number_of_likes,
        }),
      ];
    }),
  };

  const most_played: SerializedPlaylist = {
    playlist_name: "Most Played Songs of the Month",
    playlist_cover: "/covers/top-100.jpg",
    playlist_id: "most-played",
    playlist_type: "most_played",
    tracks: most_played_songs
      .flatMap((song) => {
        const track = catalogTracks.find((item) => item.title_id === song.track_id);
        if (!track) return [];

        return [
          serializeTrack({
            ...track,
            number_of_plays: song.number_of_plays,
          }),
        ];
      })
      .slice(0, 10),
  };

  return {
    version: params?.version ?? 1,
    updated_at: params?.updated_at ?? new Date().toISOString(),
    tracks: catalogTracks.map(serializeTrack),
    playlists: {
      official,
      top_100,
      most_played,
    },
  };
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
