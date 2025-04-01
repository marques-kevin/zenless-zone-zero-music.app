import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  replay_mode: state.player.replay_mode,
  is_muted: state.player.audio_meta_data.muted,
  volume: state.player.audio_meta_data.volume,
  current_time: state.player.audio_meta_data.current_time,
  slider_track_time: state.player.slider_track_time,
  next_track: state.player.next_track,
});

const mapDispatch = (dispatch: any) => ({
  onTimeUpdate: (params: { duration: number; track_time: number }) => {
    dispatch(
      actions.player.player_set_track_time({
        duration: params.duration,
        track_time: params.track_time,
      })
    );
  },
  onNext: () => {
    dispatch(actions.player.player_next());
  },
  onEnd: () => {
    dispatch(actions.player.player_on_end());
  },
  onPrevious: () => {
    dispatch(actions.player.player_previous());
  },
  onLoading: () => {
    dispatch(actions.player.player_set_loading({ is_loading: true }));
  },
  onPause: () => {
    dispatch(
      actions.player.player_set_playing({
        is_playing: false,
      })
    );
  },
  onPlay: () => {
    dispatch(
      actions.player.player_set_playing({
        is_playing: true,
      })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
