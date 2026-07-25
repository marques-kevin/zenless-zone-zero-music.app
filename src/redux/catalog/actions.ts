import { fetchCatalog } from "@/utils/catalog";
import { RootState } from "../store";
import { ThunkDispatch } from "redux-thunk";
import { actions } from "../actions";
import * as types from "./types";

export const catalog_set_loading = (
  payload: types.catalog_set_loading_action["payload"]
): types.CatalogActionTypes => ({
  type: types.catalog_set_loading,
  payload,
});

export const catalog_hydrate = (
  payload: types.catalog_hydrate_action["payload"]
): types.CatalogActionTypes => ({
  type: types.catalog_hydrate,
  payload,
});

export const catalog_set_error = (
  payload: types.catalog_set_error_action["payload"]
): types.CatalogActionTypes => ({
  type: types.catalog_set_error,
  payload,
});

export const $fetch_catalog = () => {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    dispatch(catalog_set_loading({ is_loading: true }));

    try {
      const catalog = await fetchCatalog();

      dispatch(catalog_hydrate(catalog));
      dispatch(actions.player.$init_from_catalog({ tracks: catalog.tracks }));
      dispatch(actions.auth.$init());
      dispatch(actions.global.$select_current_track_by_url());
      dispatch(actions.player.$player_fetch_track_with_likes());
    } catch (error: any) {
      console.error(error);
      dispatch(
        catalog_set_error({
          error: error?.message || "Failed to load music catalog",
        })
      );
    }
  };
};
