import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Track } from "@/types/track.type";
import { Playlist } from "@/types/playlist.type";

const mapState = (
  state: RootState,
  props: {
    tracks: Track[];
    can_be_removed_from_playlist?: boolean;
    playlist?: Playlist;
    show_duration?: boolean;
    show_cover?: boolean;
    play_all_on_click?: boolean;
    custom_playlist_id?: string | null;
  }
) => {
  return {
    is_playing: state.player.is_playing,
    current_track: state.player.current_track,
    tracks: props.tracks,
    can_be_removed_from_playlist: props.can_be_removed_from_playlist,
    playlist: props.playlist,
    show_duration: props.show_duration,
    show_cover: props.show_cover,
  };
};

const mapDispatch = (
  dispatch: any,
  props: { play_all_on_click?: boolean; custom_playlist_id?: string | null }
) => ({
  onPlay: (params: { title_id: string }) => {
    if (props.play_all_on_click) {
      dispatch(
        actions.player.$player_play_album_with_tracks({
          title_id: params.title_id,
          custom_playlist_id: props.custom_playlist_id,
        })
      );
    } else {
      dispatch(actions.player.$player_set_current_track_from_queue(params));
    }
  },
  onPlayAlbum: (playlist_id: string) => {
    dispatch(actions.playlists.$playlist_play_all({ playlist_id }));
  },
  onClose: () => {
    dispatch(actions.player.$player_close_playlist_details_pane());
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

  onShare: (track_id: string) => {
    dispatch(actions.global.$copy_track_share_url({ track_id }));
  },

  onDownloadTrack: (title_id: string) => {
    dispatch(actions.player.$player_download_track({ title_id }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
