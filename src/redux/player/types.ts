import { ReplayMode, Track, TrackWithLikes } from "@/types/track.type";

export const player_set_playing = "player_set_playing";
export interface player_set_playing_action {
  type: typeof player_set_playing;
  payload?: {
    is_playing?: boolean;
  };
}

export const player_set_tracks = "player_set_tracks";
export interface player_set_tracks_action {
  type: typeof player_set_tracks;
  payload: {
    tracks: Track[];
  };
}

export const player_add_track_to_queue = "player_add_track_to_queue";
export interface player_add_track_to_queue_action {
  type: typeof player_add_track_to_queue;
  payload: {
    title_id: string;
    play_next?: boolean;
  };
}

export const player_change_track_time = "player_change_track_time";
export interface player_change_track_time_action {
  type: typeof player_change_track_time;
  payload: {
    track_time: number;
  };
}

export const player_set_track_time = "player_set_track_time";
export interface player_set_track_time_action {
  type: typeof player_set_track_time;
  payload: {
    track_time: number;
    duration: number;
  };
}

export const player_set_slider_track_time = "player_set_slider_track_time";
export interface player_set_slider_track_time_action {
  type: typeof player_set_slider_track_time;
  payload: {
    slider_track_time: number;
  };
}

export const player_set_playlist_details_pane =
  "player_set_playlist_details_pane";
export interface player_set_playlist_details_pane_action {
  type: typeof player_set_playlist_details_pane;
  payload: {
    is_open: boolean;
    playlist_id: string;
  };
}

export const player_change_search_query = "player_change_search_query";
export interface player_change_search_query_action {
  type: typeof player_change_search_query;
  payload: {
    query: string;
  };
}

export const player_close_playlist_details_pane =
  "player_close_playlist_details_pane";
export interface player_close_playlist_details_pane_action {
  type: typeof player_close_playlist_details_pane;
}

export const player_toggle_replay_mode = "player_toggle_replay_mode";
export interface player_toggle_replay_mode_action {
  type: typeof player_toggle_replay_mode;
  payload?: {};
}

export const player_next = "player_next";
export interface player_next_action {
  type: typeof player_next;
}

export const player_previous = "player_previous";
export interface player_previous_action {
  type: typeof player_previous;
}

export const player_on_end = "player_on_end";
export interface player_on_end_action {
  type: typeof player_on_end;
}

export const player_set_playing_track = "player_set_playing_track";
export interface player_set_playing_track_action {
  type: typeof player_set_playing_track;
  payload: {
    track: Track;
  };
}

export const player_store_current_track = "player_store_current_track";
export interface player_store_current_track_action {
  type: typeof player_store_current_track;
  payload: {
    track: Track;
  };
}

export const player_set_all_tracks_with_likes =
  "player_set_all_tracks_with_likes";
export interface player_set_all_tracks_with_likes_action {
  type: typeof player_set_all_tracks_with_likes;
  payload: {
    tracks: TrackWithLikes[];
  };
}

export const player_set_tracks_user_liked = "player_set_tracks_user_liked";
export interface player_set_tracks_user_liked_action {
  type: typeof player_set_tracks_user_liked;
  payload: {
    tracks: TrackWithLikes["title_id"][];
  };
}

export const player_add_liked_track = "player_add_liked_track";
export interface player_add_liked_track_action {
  type: typeof player_add_liked_track;
  payload: {
    title_id: string;
  };
}

export const player_remove_liked_track = "player_remove_liked_track";
export interface player_remove_liked_track_action {
  type: typeof player_remove_liked_track;
  payload: {
    title_id: string;
  };
}

export const player_set_mobile_player_open = "player_set_mobile_player_open";
export interface player_set_mobile_player_open_action {
  type: typeof player_set_mobile_player_open;
  payload: {
    is_open: boolean;
  };
}

export const player_set_volume = "player_set_volume";
export interface player_set_volume_action {
  type: typeof player_set_volume;
  payload: {
    volume: number;
  };
}

export const player_toggle_random_tracks = "player_toggle_random_tracks";
export interface player_toggle_random_tracks_action {
  type: typeof player_toggle_random_tracks;
}

export const player_toggle_mute = "player_toggle_mute";
export interface player_toggle_mute_action {
  type: typeof player_toggle_mute;
}

export const player_set_loading = "player_set_loading";
export interface player_set_loading_action {
  type: typeof player_set_loading;
  payload: {
    is_loading: boolean;
  };
}

export type PlayerActionTypes =
  | player_set_playing_action
  | player_set_tracks_action
  | player_set_playing_track_action
  | player_next_action
  | player_set_track_time_action
  | player_on_end_action
  | player_set_playlist_details_pane_action
  | player_close_playlist_details_pane_action
  | player_toggle_replay_mode_action
  | player_set_mobile_player_open_action
  | player_previous_action
  | player_set_volume_action
  | player_toggle_mute_action
  | player_change_track_time_action
  | player_toggle_random_tracks_action
  | player_set_slider_track_time_action
  | player_add_track_to_queue_action
  | player_change_search_query_action
  | player_set_loading_action
  | player_store_current_track_action
  | player_set_all_tracks_with_likes_action
  | player_set_tracks_user_liked_action
  | player_add_liked_track_action
  | player_remove_liked_track_action;
