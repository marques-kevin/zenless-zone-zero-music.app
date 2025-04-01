import { Playlist } from "@/types/playlist.type";

export const playlists_store_playlists = "playlists_store_playlists";
export interface playlists_store_playlists_action {
  type: typeof playlists_store_playlists;
  payload: {
    playlists: Playlist[];
  };
}

export const playlists_set_playlist_details_pane =
  "playlists_set_playlist_details_pane";
export interface playlists_set_playlist_details_pane_action {
  type: typeof playlists_set_playlist_details_pane;
  payload: {
    playlist_id: string | null;
  };
}

export const playlists_delete_playlist = "playlists_delete_playlist";
export interface playlists_delete_playlist_action {
  type: typeof playlists_delete_playlist;
  payload: {
    playlist_id: string;
    close_playlist_pane?: boolean;
  };
}

export const playlists_set_fetching_create_playlist =
  "playlists_set_fetching_create_playlist";
export interface playlists_set_fetching_create_playlist_action {
  type: typeof playlists_set_fetching_create_playlist;
  payload: {
    fetching: boolean;
  };
}

export const playlists_set_fetching_playlists =
  "playlists_set_fetching_playlists";
export interface playlists_set_fetching_playlists_action {
  type: typeof playlists_set_fetching_playlists;
  payload: {
    fetching: boolean;
  };
}

export type PlaylistsActionTypes =
  | playlists_store_playlists_action
  | playlists_set_fetching_playlists_action
  | playlists_set_fetching_create_playlist_action
  | playlists_set_playlist_details_pane_action
  | playlists_delete_playlist_action;
