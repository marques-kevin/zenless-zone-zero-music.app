import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  playlists: state.playlists.playlists,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(
      actions.modals.$close({ key: MODAL_KEYS["change-playlist-name"] })
    );
  },
  onSave: (params: { playlist_id: string; playlist_name: string }) => {
    dispatch(actions.playlists.$playlists_change_playlist_name(params));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
