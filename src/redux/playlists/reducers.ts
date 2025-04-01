import * as types from "./types";
import { Playlist } from "@/types/playlist.type";

interface State {
  playlists: Playlist[];
  playlists_fetching: boolean;
  create_playlist_fetching: boolean;
  playlist_details_pane_playlist_id: string | null;
}

const initialState: State = {
  playlists: [],
  playlists_fetching: false,
  create_playlist_fetching: false,
  playlist_details_pane_playlist_id: null,
};

export function playlistsReducer(
  state = initialState,
  action: types.PlaylistsActionTypes
): State {
  if (action.type === types.playlists_store_playlists) {
    return {
      ...state,
      playlists: action.payload.playlists,
    };
  }

  if (action.type === types.playlists_set_playlist_details_pane) {
    return {
      ...state,
      playlist_details_pane_playlist_id: action.payload.playlist_id,
    };
  }

  if (action.type === types.playlists_set_fetching_playlists) {
    return {
      ...state,
      playlists_fetching: action.payload.fetching,
    };
  }

  if (action.type === types.playlists_set_fetching_create_playlist) {
    return {
      ...state,
      create_playlist_fetching: action.payload.fetching,
    };
  }

  return state;
}
