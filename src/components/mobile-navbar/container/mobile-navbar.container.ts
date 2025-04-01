import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  replay_mode: state.player.replay_mode,
});

const mapDispatch = (dispatch: any) => ({
  onClickHome: () => {
    dispatch(actions.player.$player_close_playlist_details_pane());
  },
  onClickQueue: () => {
    dispatch(actions.player.$player_set_mobile_player_open({ is_open: true }));
  },
  onClickPlaylists: () => {
    dispatch(actions.modals.$open({ key: MODAL_KEYS["playlists-list-modal"] }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
