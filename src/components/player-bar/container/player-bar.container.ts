import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  replay_mode: state.player.replay_mode,
  current_time: state.player.audio_meta_data.current_time,
  duration: state.player.audio_meta_data.duration,
  volume: state.player.audio_meta_data.volume,
  is_muted: state.player.audio_meta_data.muted,
  is_random_tracks_enabled: state.player.is_random_tracks_enabled,
  is_loading: state.player.is_loading,
  is_liked: state.player.tracks_user_liked.has(
    state.player.current_track.title_id
  ),
  number_of_likes:
    state.player.all_tracks_with_likes.get(state.player.current_track.title_id)
      ?.number_of_likes || 0,
});

const mapDispatch = (dispatch: any) => ({
  onPlay: () => {
    dispatch(actions.player.player_set_playing({ is_playing: true }));
  },
  onPause: () => {
    dispatch(actions.player.player_set_playing({ is_playing: false }));
  },
  onNext: () => {
    dispatch(actions.player.player_next());
  },
  onPrevious: () => {
    dispatch(actions.player.player_previous());
  },
  onReplayMode: () => {
    dispatch(actions.player.player_toggle_replay_mode());
  },
  onVolumeChange: (value: number) => {
    dispatch(actions.player.player_set_volume({ volume: value }));
  },
  onSliderTimeUpdate: (value: number) => {
    dispatch(
      actions.player.player_set_slider_track_time({ slider_track_time: value })
    );
  },
  onToggleRandomTracks: () => {
    dispatch(actions.player.player_toggle_random_tracks());
  },
  onToggleMute: () => {
    dispatch(actions.player.player_toggle_mute());
  },
  onToggleLike: (payload: { title_id: string }) => {
    dispatch(actions.player.$player_toggle_like(payload));
  },
  onShare: (payload: { title_id: string }) => {
    dispatch(
      actions.global.$copy_track_share_url({ track_id: payload.title_id })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
