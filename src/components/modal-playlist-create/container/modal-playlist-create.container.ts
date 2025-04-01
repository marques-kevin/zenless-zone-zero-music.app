import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  create_playlist_fetching: state.playlists.create_playlist_fetching,
  playlists: state.playlists.playlists,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["create-playlist"] }));
  },
  onSubmit: (data: { name: string }) => {
    dispatch(actions.playlists.$create(data));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
