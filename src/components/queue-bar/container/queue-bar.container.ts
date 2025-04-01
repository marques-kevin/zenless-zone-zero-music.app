import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  tracks_currently_playing: state.player.tracks_currently_playing,
});

const mapDispatch = (dispatch: any) => ({
  togglePlay: () => {
    dispatch(actions.player.player_set_playing({}));
  },
  onPlayTrack: (title_id: string) => {
    dispatch(actions.player.$player_set_current_track_from_queue({ title_id }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
