import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import * as types from "./types";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { actions } from "../actions";
import { characters } from "@/database/characters";
import { Track } from "@/types/track.type";
import { all_playlists } from "@/database/playlists";

export const playlists_store_playlists = (
  payload: types.playlists_store_playlists_action["payload"]
): types.PlaylistsActionTypes => ({
  type: types.playlists_store_playlists,
  payload,
});

export const playlists_set_fetching_playlists = (
  payload: types.playlists_set_fetching_playlists_action["payload"]
): types.PlaylistsActionTypes => ({
  type: types.playlists_set_fetching_playlists,
  payload,
});

export const playlists_set_fetching_create_playlist = (
  payload: types.playlists_set_fetching_create_playlist_action["payload"]
): types.PlaylistsActionTypes => ({
  type: types.playlists_set_fetching_create_playlist,
  payload,
});

export const playlists_set_playlist_details_pane = (
  payload: types.playlists_set_playlist_details_pane_action["payload"]
): types.PlaylistsActionTypes => ({
  type: types.playlists_set_playlist_details_pane,
  payload,
});

export const $playlists_set_playlist_details_pane = (
  payload: types.playlists_set_playlist_details_pane_action["payload"]
) => {
  return async (dispatch: any) => {
    dispatch(actions.playlists.playlists_set_playlist_details_pane(payload));
    dispatch(
      actions.modals.$open({
        key: MODAL_KEYS["playlist-details"],
        value: payload.playlist_id,
      })
    );
  };
};

export const $playlists_change_playlist_name =
  (payload: {
    playlist_id: string;
    playlist_name: string;
  }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        dispatcher(
          actions.modals.$close({ key: MODAL_KEYS["change-playlist-name"] })
        );

        const response = await di.PlaylistsRepository.change_playlist_name({
          playlist_id: payload.playlist_id,
          playlist_name: payload.playlist_name,
          user_id: user.id,
        });

        if (response.error) {
          alert(response.message);
          return;
        }

        await dispatcher(actions.playlists.$fetch());
      })
    );
  };

export const $playlists_delete_playlist =
  (
    payload: types.playlists_delete_playlist_action["payload"]
  ): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) {
      return;
    }

    const response = await di.PlaylistsRepository.delete_playlist({
      playlist_id: payload.playlist_id,
      user_id: auth.user.id,
    });

    if (response.error) {
      alert(response.message);
      return;
    }

    await dispatcher(actions.playlists.$fetch());

    if (payload.close_playlist_pane) {
      await dispatcher(
        actions.modals.$close({
          key: MODAL_KEYS["playlist-details"],
        })
      );
    }
  };

export const $fetch =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) {
      return;
    }

    const response = await di.PlaylistsRepository.fetch({
      user_id: auth.user.id,
    });

    if (response.error) {
      alert(response.message);
      return;
    }

    dispatcher(playlists_store_playlists({ playlists: response.data }));
  };

export const $open_create_playlist_modal =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    return dispatcher(
      actions.auth.$request_login_if_not_authenticated((user) => {
        dispatcher(
          actions.modals.$open({ key: MODAL_KEYS["create-playlist"] })
        );
      })
    );
  };

export const $change_playlist_picture =
  (params: {
    playlist_id: string;
    character: string;
  }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        dispatcher(
          actions.modals.$close({ key: MODAL_KEYS["change-playlist-picture"] })
        );

        const response = await di.PlaylistsRepository.change_playlist_picture({
          playlist_id: params.playlist_id,
          character: params.character,
          user_id: user.id,
        });

        if (response.error) {
          alert(response.message);
          return;
        }

        await dispatcher(actions.playlists.$fetch());
      })
    );
  };

const getRandomAlbumCover = () => {
  return characters[Math.floor(Math.random() * characters.length)];
};

export const $create =
  (payload: { name: string }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) {
      return;
    }

    dispatcher(playlists_set_fetching_create_playlist({ fetching: true }));

    const response = await di.PlaylistsRepository.create({
      user_id: auth.user.id,
      name: payload.name,
      cover: getRandomAlbumCover().name,
    });

    dispatcher(playlists_set_fetching_create_playlist({ fetching: false }));

    if (response.error) {
      alert(response.message);
      return;
    }

    await dispatcher(
      actions.modals.$close({ key: MODAL_KEYS["create-playlist"] })
    );
    await dispatcher(actions.playlists.$fetch());
  };

export const $playlists_open_add_to_playlist_modal =
  (payload: { title_id: string }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(() => {
        dispatcher(
          actions.modals.$open({
            key: MODAL_KEYS["add-to-playlist"],
            value: payload.title_id,
          })
        );
      })
    );
  };

export const $playlists_add_track_on_playlist =
  (payload: {
    playlist_id: string;
    track: Track;
  }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) {
      return;
    }

    await dispatcher(
      actions.modals.$close({ key: MODAL_KEYS["add-to-playlist"] })
    );

    const response = await di.PlaylistsRepository.add_track_on_playlist({
      playlist_id: payload.playlist_id,
      track: payload.track,
      user_id: auth.user.id,
    });

    if (response.error) {
      alert(response.message);
      return;
    }

    await dispatcher(actions.playlists.$fetch());
  };

export const $playlist_play_all =
  (payload: { playlist_id: string }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    const { playlists } = getState();

    const playlist = [...all_playlists, ...playlists.playlists].find(
      (playlist) => playlist.playlist_id === payload.playlist_id
    );

    if (!playlist || !playlist.tracks[0]) return;

    dispatcher(actions.player.player_set_tracks({ tracks: playlist.tracks }));
    dispatcher(
      actions.player.$player_set_playing_track({ track: playlist.tracks[0] })
    );
  };

export const $playlist_remove_track =
  (payload: {
    title_id: string;
    playlist_id: string;
  }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    return dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        const response =
          await di.PlaylistsRepository.remove_track_from_playlist({
            playlist_id: payload.playlist_id,
            title_id: payload.title_id,
            user_id: user.id,
          });

        if (response.error) {
          alert(response.message);
          return;
        }

        await dispatcher(actions.playlists.$fetch());
      })
    );
  };
