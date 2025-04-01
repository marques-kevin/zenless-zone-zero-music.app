import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  replay_mode: state.player.replay_mode,
  is_open: state.player.is_player_mobile_full_screen_opened,
  duration: state.player.audio_meta_data.duration,
  current_time: state.player.audio_meta_data.current_time,
  tracks_currently_playing: state.player.tracks_currently_playing,
  is_random_tracks_enabled: state.player.is_random_tracks_enabled,
  is_loading: state.player.is_loading,
  is_liked: state.player.tracks_user_liked.has(
    state.player.current_track.title_id
  ),
  current_track_number_of_likes:
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
  onSliderTimeUpdate: (slider_track_time: number) => {
    dispatch(
      actions.player.player_set_slider_track_time({
        slider_track_time,
      })
    );
  },
  onShare: (track_id: string) => {
    dispatch(actions.global.$copy_track_share_url({ track_id }));
  },
  onToggleRandomTracks: () => {
    dispatch(actions.player.player_toggle_random_tracks());
  },
  onClose: () => {
    dispatch(actions.player.$player_set_mobile_player_open({ is_open: false }));
  },
  onPlayTrack: (title_id: string) => {
    dispatch(actions.player.$player_set_current_track_from_queue({ title_id }));
  },
  onAddToPlaylist: (title_id: string) => {
    dispatch(
      actions.playlists.$playlists_open_add_to_playlist_modal({ title_id })
    );
  },
  onToggleLike: (title_id: string) => {
    dispatch(actions.player.$player_toggle_like({ title_id }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
