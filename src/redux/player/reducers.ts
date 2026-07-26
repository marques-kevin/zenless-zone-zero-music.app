import { tracks } from "@/database/tracks";
import * as types from "./types";
import { ReplayMode, Track, TrackWithLikes } from "@/types/track.type";
import { shuffle } from "lodash";

interface State {
  is_playing: boolean;
  current_track: Track;
  volume: number;
  is_player_mobile_full_screen_opened: boolean;
  tracks_currently_playing: Track[];
  replay_mode: ReplayMode;
  slider_track_time: number;
  next_track: Track | null;
  search_query: string;
  __volume_before_muted: number;
  __tracks_before_random: Track[];
  is_random_tracks_enabled: boolean;
  audio_meta_data: {
    current_time: number;
    duration: number;
    volume: number;
    muted: boolean;
  };
  is_loading: boolean;
  loading_tracks: {
    loading_start_time: number;
    track_id: string;
  }[];

  all_tracks_with_likes: Map<TrackWithLikes["title_id"], TrackWithLikes>;
  tracks_user_liked: Set<TrackWithLikes["title_id"]>;
}

const tracks_currently_playing_default = shuffle(tracks)[0];

const initialState: State = {
  slider_track_time: 0,
  search_query: "",
  is_playing: false,
  is_player_mobile_full_screen_opened: false,
  current_track: tracks_currently_playing_default,
  tracks_currently_playing: [tracks_currently_playing_default],
  next_track: null,
  volume: 100,
  replay_mode: "replay_playlist",
  __volume_before_muted: 100,
  __tracks_before_random: [],
  is_random_tracks_enabled: false,
  audio_meta_data: {
    current_time: 0,
    duration: 0,
    volume: 100,
    muted: false,
  },
  is_loading: false,
  loading_tracks: [],
  all_tracks_with_likes: new Map(),
  tracks_user_liked: new Set(),
};

export function playerReducer(
  state = initialState,
  action: types.PlayerActionTypes
): State {
  if (action.type === types.player_set_playing) {
    if (action.payload?.is_playing !== undefined) {
      return {
        ...state,
        is_playing: action.payload.is_playing,
      };
    }

    return {
      ...state,
      is_playing: !state.is_playing,
    };
  }

  if (action.type === types.player_set_all_tracks_with_likes) {
    return {
      ...state,
      all_tracks_with_likes: new Map(
        action.payload.tracks.map((track) => [track.title_id, track])
      ),
    };
  }

  if (action.type === types.player_add_liked_track) {
    const track = state.all_tracks_with_likes.get(action.payload.title_id) || {
      number_of_likes: 0,
      title_id: action.payload.title_id,
      user_id: null,
    };

    return {
      ...state,
      all_tracks_with_likes: new Map(
        state.all_tracks_with_likes.set(action.payload.title_id, {
          ...track,
          number_of_likes: track.number_of_likes + 1,
        })
      ),
      tracks_user_liked: new Set([
        ...state.tracks_user_liked,
        action.payload.title_id,
      ]),
    };
  }

  if (action.type === types.player_remove_liked_track) {
    const track = state.all_tracks_with_likes.get(action.payload.title_id);

    if (!track) return state;

    return {
      ...state,
      all_tracks_with_likes: new Map(
        state.all_tracks_with_likes.set(action.payload.title_id, {
          ...track,
          number_of_likes: Math.max(track.number_of_likes - 1, 0),
        })
      ),
      tracks_user_liked: new Set(
        [...state.tracks_user_liked].filter(
          (t) => t !== action.payload.title_id
        )
      ),
    };
  }

  if (action.type === types.player_set_tracks_user_liked) {
    return {
      ...state,
      tracks_user_liked: new Set(action.payload.tracks),
    };
  }

  if (action.type === types.player_set_loading) {
    return {
      ...state,
      is_loading: action.payload.is_loading,
    };
  }

  if (action.type === types.player_set_volume) {
    return {
      ...state,
      audio_meta_data: {
        ...state.audio_meta_data,
        volume: action.payload.volume,
        muted: action.payload.volume === 0,
      },
    };
  }

  if (action.type === types.player_add_track_to_queue) {
    const track = tracks.find((t) => t.title_id === action.payload.title_id);

    if (!track) return state;

    const tracks_currently_playing = [...state.tracks_currently_playing].filter(
      (t) => t.title_id !== track.title_id
    );

    if (action.payload.play_next) {
      const current_track_index = tracks_currently_playing.findIndex(
        (t) => t.title_id === state.current_track.title_id
      );

      return {
        ...state,
        tracks_currently_playing: [
          ...tracks_currently_playing.slice(0, current_track_index + 1),
          track,
          ...tracks_currently_playing.slice(current_track_index + 1),
        ],
      };
    }

    return {
      ...state,
      tracks_currently_playing: [...tracks_currently_playing, track],
    };
  }

  if (action.type === types.player_toggle_random_tracks) {
    if (state.is_random_tracks_enabled) {
      return {
        ...state,
        tracks_currently_playing: state.__tracks_before_random,
        is_random_tracks_enabled: false,
        __tracks_before_random: [],
      };
    }

    return {
      ...state,
      is_random_tracks_enabled: true,
      tracks_currently_playing: shuffle(state.tracks_currently_playing),
      __tracks_before_random: state.tracks_currently_playing,
    };
  }

  if (action.type === types.player_toggle_mute) {
    if (!state.audio_meta_data.muted) {
      return {
        ...state,
        audio_meta_data: {
          ...state.audio_meta_data,
          muted: true,
          volume: 0,
        },
        __volume_before_muted: state.audio_meta_data.volume,
      };
    }

    return {
      ...state,
      audio_meta_data: {
        ...state.audio_meta_data,
        muted: false,
        volume: state.__volume_before_muted,
      },
    };
  }

  if (action.type === types.player_change_search_query) {
    return {
      ...state,
      search_query: action.payload.query,
    };
  }

  if (action.type === types.player_set_slider_track_time) {
    return {
      ...state,
      slider_track_time: action.payload.slider_track_time,
    };
  }

  if (action.type === types.player_set_mobile_player_open) {
    return {
      ...state,
      is_player_mobile_full_screen_opened: action.payload.is_open,
    };
  }

  if (action.type === types.player_set_track_time) {
    return {
      ...state,
      audio_meta_data: {
        ...state.audio_meta_data,
        current_time: action.payload.track_time,
        duration: action.payload.duration,
      },
      is_loading: false,
    };
  }

  if (action.type === types.player_change_track_time) {
    return {
      ...state,
      audio_meta_data: {
        ...state.audio_meta_data,
        current_time: action.payload.track_time,
      },
    };
  }

  if (action.type === types.player_toggle_replay_mode) {
    if (state.replay_mode === "replay_playlist") {
      return {
        ...state,
        replay_mode: "replay_track",
      };
    }

    return {
      ...state,
      replay_mode: "replay_playlist",
    };
  }

  if (action.type === types.player_on_end) {
    if (state.replay_mode === "replay_track") {
      return {
        ...state,
        audio_meta_data: {
          ...state.audio_meta_data,
          current_time: 0,
        },
      };
    }

    return {
      ...state,
    };
  }

  if (action.type === types.player_set_tracks) {
    return {
      ...state,
      tracks_currently_playing: action.payload.tracks,
      __tracks_before_random: [],
      is_random_tracks_enabled: false,
    };
  }

  if (action.type === types.player_next) {
    const findIndex = state.tracks_currently_playing.findIndex(
      (track) => track.title_id === state.current_track.title_id
    );

    if (
      findIndex === state.tracks_currently_playing.length - 1 ||
      findIndex === -1
    ) {
      return {
        ...state,
        current_track: state.tracks_currently_playing[0],
      };
    }

    return {
      ...state,
      current_track: state.tracks_currently_playing[findIndex + 1],
      next_track: state.tracks_currently_playing[findIndex + 2] || null,
    };
  }

  if (action.type === types.player_previous) {
    const findIndex = state.tracks_currently_playing.findIndex(
      (track) => track.title_id === state.current_track.title_id
    );

    if (findIndex === -1 || findIndex === 0) {
      return state;
    }

    const current_track = state.tracks_currently_playing[findIndex - 1];

    return {
      ...state,
      current_track,
      next_track: state.tracks_currently_playing[findIndex] || null,
    };
  }

  if (action.type === types.player_set_playing_track) {
    return {
      ...state,
      is_playing: true,
      current_track: action.payload.track,
      is_player_mobile_full_screen_opened: true,
      next_track: null,
    };
  }

  if (action.type === types.player_store_current_track) {
    return {
      ...state,
      is_playing: false,
      current_track: action.payload.track,
      is_player_mobile_full_screen_opened: true,
      next_track: null,
      tracks_currently_playing: [action.payload.track],
    };
  }

  return state;
}
