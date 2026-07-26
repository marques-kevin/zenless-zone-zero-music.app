import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { Track } from "@/types/track.type";

const mapState = (state: RootState) => ({
  create_playlist_fetching: state.playlists.create_playlist_fetching,
  playlists: state.playlists.playlists,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["add-to-playlist"] }));
  },
  onSubmit: (data: { name: string }) => {
    dispatch(actions.playlists.$create(data));
  },
  onSelect: (playlist_id: string, track: Track) => {
    dispatch(
      actions.playlists.$playlists_add_track_on_playlist({ playlist_id, track })
    );
  },
  onCreatePlaylist: () => {
    dispatch(actions.modals.$open({ key: MODAL_KEYS["create-playlist"] }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
