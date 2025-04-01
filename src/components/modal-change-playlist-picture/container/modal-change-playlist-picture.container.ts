import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  profile_picture: state.auth.profile_picture,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(
      actions.modals.$close({ key: MODAL_KEYS["change-playlist-picture"] })
    );
  },
  onSelect: (params: { playlist_id: string; character: string }) => {
    dispatch(actions.playlists.$change_playlist_picture(params));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
