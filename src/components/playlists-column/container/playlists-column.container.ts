import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Playlist } from "@/types/playlist.type";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  playlists: state.playlists.playlists,
});

const mapDispatch = (dispatch: any) => ({
  onCreatePlaylist: () => {
    dispatch(actions.playlists.$open_create_playlist_modal());
  },

  onOpenPlaylist: (playlist: Playlist) => {
    dispatch(
      actions.playlists.$playlists_set_playlist_details_pane({
        playlist_id: playlist.playlist_id,
      })
    );
  },

  onPlayPlaylist: (playlist_id: string) => {
    dispatch(actions.playlists.$playlist_play_all({ playlist_id }));
  },

  onDeletePlaylist: (playlist_id: string) => {
    dispatch(actions.playlists.$playlists_delete_playlist({ playlist_id }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
