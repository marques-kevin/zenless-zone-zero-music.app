import { tracks } from "@/database/tracks";
import * as types from "./types";
import { RootState } from "../store";
import { ThunkDispatch } from "redux-thunk";
import { navigate } from "@reach/router";
import { all_playlists } from "@/database/playlists";
import { addHash, removeHash } from "@/lib/utils";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { actions } from "../actions";
import { Track } from "@/types/track.type";
import { getCdnUrl } from "@/utils/get-cdn-url";

export const player_set_playing = (
  payload: types.player_set_playing_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_playing,
  payload,
});

export const player_next = (): types.PlayerActionTypes => ({
  type: types.player_next,
});

export const player_add_track_to_queue = (
  payload: types.player_add_track_to_queue_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_add_track_to_queue,
  payload,
});

export const player_change_search_query = (
  payload: types.player_change_search_query_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_change_search_query,
  payload,
});

export const $player_change_search_query = (
  payload: types.player_change_search_query_action["payload"]
) => {
  return async (dispatch: any) => {
    dispatch(player_change_search_query(payload));
    dispatch($player_open_search_modal());
  };
};

export const player_previous = (): types.PlayerActionTypes => ({
  type: types.player_previous,
});

export const player_set_loading = (
  payload: types.player_set_loading_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_loading,
  payload,
});

export const player_toggle_replay_mode = (): types.PlayerActionTypes => ({
  type: types.player_toggle_replay_mode,
});

export const player_on_end = (): types.PlayerActionTypes => ({
  type: types.player_on_end,
});

export const player_change_track_time = (
  payload: types.player_change_track_time_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_change_track_time,
  payload,
});

export const player_set_slider_track_time = (
  payload: types.player_set_slider_track_time_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_slider_track_time,
  payload,
});

export const player_toggle_random_tracks = (): types.PlayerActionTypes => ({
  type: types.player_toggle_random_tracks,
});

export const player_toggle_mute = (): types.PlayerActionTypes => ({
  type: types.player_toggle_mute,
});

export const player_set_tracks = (
  payload: types.player_set_tracks_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_tracks,
  payload,
});

export const player_set_mobile_player_open = (
  payload: types.player_set_mobile_player_open_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_mobile_player_open,
  payload,
});

export const $player_set_mobile_player_open = (
  payload: types.player_set_mobile_player_open_action["payload"]
) => {
  return async (dispatch: any, getState: () => RootState) => {
    const { player } = getState();
    dispatch(player_set_mobile_player_open(payload));

    if (payload.is_open) {
      navigate(
        addHash({
          path: MODAL_KEYS.player,
          currentHash: window.location.hash,
          value: player.current_track?.title_id,
        })
      );
    } else {
      navigate(
        removeHash({
          path: MODAL_KEYS.player,
          currentHash: window.location.hash,
        })
      );
    }
  };
};

export const player_set_volume = (
  payload: types.player_set_volume_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_volume,
  payload,
});

export const player_set_track_time = (
  payload: types.player_set_track_time_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_track_time,
  payload,
});

export const player_set_playing_track = (
  payload: types.player_set_playing_track_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_playing_track,
  payload,
});

export const player_store_current_track = (
  payload: types.player_store_current_track_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_store_current_track,
  payload,
});

export const $player_set_playing_track = (
  payload: types.player_set_playing_track_action["payload"]
) => {
  return async (dispatch: any, getState: () => RootState) => {
    dispatch(player_set_playing_track(payload));
    dispatch($player_set_mobile_player_open({ is_open: true }));
  };
};

export const player_close_playlist_details_pane =
  (): types.PlayerActionTypes => ({
    type: types.player_close_playlist_details_pane,
  });

export const $player_close_playlist_details_pane = () => {
  return async (dispatch: any) => {
    dispatch(player_close_playlist_details_pane());
    dispatch(actions.modals.$close({ key: MODAL_KEYS["playlist-details"] }));
  };
};

export const $player_close_search_modal = () => {
  return async (dispatch: any) => {
    navigate(
      removeHash({ path: MODAL_KEYS.search, currentHash: window.location.hash })
    );
  };
};

export const $player_open_search_modal = () => {
  return async (dispatch: any) => {
    navigate(
      addHash({ path: MODAL_KEYS.search, currentHash: window.location.hash })
    );
  };
};

export const $player_set_current_track_from_queue = (payload: {
  title_id: string;
}) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.PlayerActionTypes>,
    getState: () => RootState
  ) => {
    const { player } = getState();

    const track = tracks.find((track) => track.title_id === payload.title_id);

    if (!track) return;

    if (payload.title_id === player.current_track?.title_id) {
      return dispatch(player_set_playing({}));
    }

    const track_index = player.tracks_currently_playing.findIndex(
      (track) => track.title_id === payload.title_id
    );

    if (track_index !== -1) {
      const track = player.tracks_currently_playing[track_index];

      dispatch($player_set_playing_track({ track }));
    } else {
      dispatch(player_set_tracks({ tracks: [track] }));
      dispatch($player_set_playing_track({ track }));
    }
  };
};

export const $player_play_album_with_tracks = (payload: {
  title_id: string;
  custom_playlist_id?: string | null;
}) => {
  return async (dispatch: any, getState: () => RootState) => {
    const { playlists } = getState();

    const track = tracks.find((track) => track.title_id === payload.title_id);
    if (!track) return;

    let playlist_tracks;
    let selected_track_index;

    if (payload.custom_playlist_id) {
      const custom_playlist = playlists.playlists.find(
        (playlist) => playlist.playlist_id === payload.custom_playlist_id
      );
      if (!custom_playlist) return;

      /**
       * For custom playlists, we need to map the track IDs to full track objects
       * since custom playlists only store title_ids as references
       */
      playlist_tracks = custom_playlist.tracks.map(
        (track) => tracks.find((t) => t.title_id === track.title_id) as Track
      );
      selected_track_index = playlist_tracks.findIndex(
        (track) => track?.title_id === payload.title_id
      );
    } else {
      const album_playlist = all_playlists.find(
        (playlist) => playlist.playlist_id === track.playlist_id
      );
      if (!album_playlist) return;

      playlist_tracks = album_playlist.tracks;
      selected_track_index = playlist_tracks.findIndex(
        (track) => track.title_id === payload.title_id
      );
    }

    dispatch(player_set_tracks({ tracks: playlist_tracks }));
    dispatch(
      player_set_playing_track({
        track: playlist_tracks[selected_track_index],
      })
    );
    dispatch($player_set_mobile_player_open({ is_open: true }));
  };
};

export const $player_download_track = (payload: { title_id: string }) => {
  return async (dispatch: any, getState: () => RootState) => {
    const { di } = getState();

    const track = tracks.find((track) => track.title_id === payload.title_id);

    if (!track) return;
    const url_link = getCdnUrl(track.source);

    try {
      const response = await fetch(url_link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${track.title}.mp3`;

      di.AnalyticsService.send({
        category: "tracks",
        action: "download",
        data: {
          track_id: track.title_id,
        },
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error downloading track, contact support.");
    }
  };
};

export const player_set_all_tracks_with_likes = (
  payload: types.player_set_all_tracks_with_likes_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_all_tracks_with_likes,
  payload,
});

export const player_set_tracks_user_liked = (
  payload: types.player_set_tracks_user_liked_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_set_tracks_user_liked,
  payload,
});

export const player_add_liked_track = (
  payload: types.player_add_liked_track_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_add_liked_track,
  payload,
});

export const player_remove_liked_track = (
  payload: types.player_remove_liked_track_action["payload"]
): types.PlayerActionTypes => ({
  type: types.player_remove_liked_track,
  payload,
});

export const $player_toggle_like = (payload: { title_id: string }) => {
  return async (dispatch: any, getState: () => RootState) => {
    const { di, player } = getState();

    return dispatch(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const does_user_like_track = player.tracks_user_liked.has(
          payload.title_id
        );

        try {
          if (does_user_like_track) {
            await di.LikesRepository.delete_user_liked_title({
              user_id: user.id,
              title_id: payload.title_id,
            });

            dispatch(player_remove_liked_track({ title_id: payload.title_id }));

            di.AnalyticsService.send({
              category: "tracks",
              action: "unlike",
              data: {
                track_id: payload.title_id,
              },
            });
          } else {
            await di.LikesRepository.store_user_liked_title({
              user_id: user.id,
              title_id: payload.title_id,
            });

            dispatch(player_add_liked_track({ title_id: payload.title_id }));

            di.AnalyticsService.send({
              category: "tracks",
              action: "like",
              data: {
                track_id: payload.title_id,
              },
            });
          }
        } catch (error) {
          console.error(error);
        }
      })
    );
  };
};

export const $player_fetch_all_tracks_that_user_liked = () => {
  return async (dispatch: any, getState: () => RootState) => {
    const { di, auth } = getState();

    if (!auth.user) return;

    const tracks_with_likes = await di.LikesRepository.fetch_user_liked_titles({
      user_id: auth.user.id,
    });

    if (tracks_with_likes.error) {
      return;
    }

    dispatch(player_set_tracks_user_liked({ tracks: tracks_with_likes.data }));
  };
};

export const $player_fetch_track_with_likes = () => {
  return async (dispatch: any, getState: () => RootState) => {
    const { di, auth } = getState();

    const tracks_with_likes =
      await di.LikesRepository.fetch_all_tracks_with_likes();

    if (tracks_with_likes.error) {
      return console.error(tracks_with_likes.error);
    }

    dispatch(
      player_set_all_tracks_with_likes({ tracks: tracks_with_likes.data })
    );
  };
};
