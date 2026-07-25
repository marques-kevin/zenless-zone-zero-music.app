import * as types from "./types";

const initialState: types.CatalogState = {
  is_loading: true,
  is_ready: false,
  error: null,
  version: 0,
  updated_at: null,
  tracks: [],
  official_playlists: [],
  top_100_playlist: null,
  most_played_playlist: null,
  all_playlists: [],
};

export function catalogReducer(
  state = initialState,
  action: types.CatalogActionTypes
): types.CatalogState {
  if (action.type === types.catalog_set_loading) {
    return {
      ...state,
      is_loading: action.payload.is_loading,
    };
  }

  if (action.type === types.catalog_hydrate) {
    return {
      is_loading: false,
      is_ready: true,
      error: null,
      version: action.payload.version,
      updated_at: action.payload.updated_at,
      tracks: action.payload.tracks,
      official_playlists: action.payload.official_playlists,
      top_100_playlist: action.payload.top_100_playlist,
      most_played_playlist: action.payload.most_played_playlist,
      all_playlists: action.payload.all_playlists,
    };
  }

  if (action.type === types.catalog_set_error) {
    return {
      ...state,
      is_loading: false,
      is_ready: false,
      error: action.payload.error,
    };
  }

  return state;
}
