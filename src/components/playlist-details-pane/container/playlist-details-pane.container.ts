import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { official_playlists } from "@/database/playlists";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => {
  return {
    is_playing: state.player.is_playing,
    playlists: [...official_playlists, ...state.playlists.playlists],
    current_track: state.player.current_track,
  };
};

const mapDispatch = (dispatch: any) => ({
  onPlay: (params: { title_id: string }) => {
    dispatch(actions.player.$player_set_current_track_from_queue(params));
  },

  onPlayAlbum: (playlist_id: string) => {
    dispatch(actions.playlists.$playlist_play_all({ playlist_id }));
  },

  onClose: () => {
    dispatch(actions.player.$player_close_playlist_details_pane());
  },

  onOpenChangePlaylistPictureModal: (playlist_id: string) => {
    dispatch(
      actions.modals.$open({
        key: MODAL_KEYS["change-playlist-picture"],
        value: playlist_id,
      })
    );
  },

  onOpenChangePlaylistNameModal: (playlist_id: string) => {
    dispatch(
      actions.modals.$open({
        key: MODAL_KEYS["change-playlist-name"],
        value: playlist_id,
      })
    );
  },

  onAddToQueue: (title_id: string, options?: { play_next: boolean }) => {
    dispatch(
      actions.player.player_add_track_to_queue({ title_id, ...options })
    );
  },

  onAddToPlaylist: (title_id: string) => {
    dispatch(
      actions.playlists.$playlists_open_add_to_playlist_modal({ title_id })
    );
  },

  onRemoveTrackFromPlaylist: (params: {
    title_id: string;
    playlist_id: string;
  }) => {
    dispatch(actions.playlists.$playlist_remove_track(params));
  },

  onRemovePlaylist: (playlist_id: string) => {
    dispatch(
      actions.playlists.$playlists_delete_playlist({
        playlist_id,
        close_playlist_pane: true,
      })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
