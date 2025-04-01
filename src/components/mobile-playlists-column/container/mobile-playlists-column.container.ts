import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Playlist } from "@/types/playlist.type";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(
      actions.modals.$close({ key: MODAL_KEYS["playlists-list-modal"] })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
