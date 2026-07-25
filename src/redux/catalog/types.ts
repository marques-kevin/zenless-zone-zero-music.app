import { Catalog } from "@/types/catalog.type";
import { Playlist } from "@/types/playlist.type";
import { Track } from "@/types/track.type";

export const catalog_set_loading = "catalog_set_loading";
export interface catalog_set_loading_action {
  type: typeof catalog_set_loading;
  payload: {
    is_loading: boolean;
  };
}

export const catalog_hydrate = "catalog_hydrate";
export interface catalog_hydrate_action {
  type: typeof catalog_hydrate;
  payload: Catalog;
}

export const catalog_set_error = "catalog_set_error";
export interface catalog_set_error_action {
  type: typeof catalog_set_error;
  payload: {
    error: string;
  };
}

export type CatalogActionTypes =
  | catalog_set_loading_action
  | catalog_hydrate_action
  | catalog_set_error_action;

export interface CatalogState {
  is_loading: boolean;
  is_ready: boolean;
  error: string | null;
  version: number;
  updated_at: string | null;
  tracks: Track[];
  official_playlists: Playlist[];
  top_100_playlist: Playlist | null;
  most_played_playlist: Playlist | null;
  all_playlists: Playlist[];
}
