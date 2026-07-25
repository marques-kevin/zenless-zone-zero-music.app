import { Playlist } from "./playlist.type";
import { Track } from "./track.type";

/**
 * Track entry as stored in `catalog/tracks.json` on R2.
 * Same shape as `Track`, but `created_at` is an ISO string instead of a Date.
 */
export type SerializedTrack = Omit<Track, "created_at"> & {
  created_at: string;
};

/**
 * Playlist entry as stored in `catalog/tracks.json`.
 */
export type SerializedPlaylist = Omit<Playlist, "tracks"> & {
  tracks: SerializedTrack[];
};

/**
 * Full remote catalog served from R2 at `/catalog/tracks.json`.
 *
 * @example See `catalog/track.example.json` for a single track
 * @example See `catalog/catalog.example.json` for the full structure
 */
export type CatalogJson = {
  /** Incremented on each catalog update */
  version: number;
  /** ISO 8601 date of last update */
  updated_at: string;
  /** All track entries (same song can appear multiple times across albums) */
  tracks: SerializedTrack[];
  playlists: {
    /** Version and character albums */
    official: SerializedPlaylist[];
    /** Top 10 liked songs (joined at export time) */
    top_100: SerializedPlaylist;
    /** Most played songs of the month (joined at export time) */
    most_played: SerializedPlaylist;
  };
};

/**
 * Hydrated catalog used in the app after fetch + deserialization.
 */
export type Catalog = {
  version: number;
  updated_at: string;
  tracks: Track[];
  official_playlists: Playlist[];
  top_100_playlist: Playlist;
  most_played_playlist: Playlist;
  all_playlists: Playlist[];
};
