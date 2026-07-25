import { Playlist } from "./playlist.type";
import { Track } from "./track.type";

export type SerializedTrack = Omit<Track, "created_at"> & {
  created_at: string;
};

export type SerializedPlaylist = Omit<Playlist, "tracks"> & {
  tracks: SerializedTrack[];
};

export type CatalogJson = {
  version: number;
  updated_at: string;
  tracks: SerializedTrack[];
  playlists: {
    official: SerializedPlaylist[];
    top_100: SerializedPlaylist;
    most_played: SerializedPlaylist;
  };
};

export type Catalog = {
  version: number;
  updated_at: string;
  tracks: Track[];
  official_playlists: Playlist[];
  top_100_playlist: Playlist;
  most_played_playlist: Playlist;
  all_playlists: Playlist[];
};
