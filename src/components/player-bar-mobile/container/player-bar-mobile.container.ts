import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  current_time: state.player.audio_meta_data.current_time,
  duration: state.player.audio_meta_data.duration,
});

const mapDispatch = (dispatch: any) => ({
  onPlay: () => {
    dispatch(actions.player.player_set_playing({ is_playing: true }));
  },
  onPause: () => {
    dispatch(actions.player.player_set_playing({ is_playing: false }));
  },
  onClick: () => {
    dispatch(actions.player.$player_set_mobile_player_open({ is_open: true }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
