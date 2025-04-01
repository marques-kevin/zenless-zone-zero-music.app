import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Playlist } from "@/types/playlist.type";
import { Track } from "@/types/track.type";

const mapState = (
  state: RootState,
  props: { most_played_songs_of_the_month: Track[] }
) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  most_played_songs_of_the_month: props.most_played_songs_of_the_month,
});

const mapDispatch = (dispatch: any) => ({
  onPlayAlbum: (playlist_id: string) => {
    dispatch(actions.playlists.$playlist_play_all({ playlist_id }));
  },
  onOpenPlaylist: (playlist: Playlist) => {
    dispatch(
      actions.playlists.$playlists_set_playlist_details_pane({
        playlist_id: playlist.playlist_id,
      })
    );
  },
  onPlay: (track: Track) => {
    dispatch(actions.player.$player_set_playing_track({ track }));
  },

  onAddToQueue: (title_id: string, options?: { play_next: boolean }) => {
    dispatch(
      actions.player.$player_set_current_track_from_queue({
        title_id,
      })
    );
  },

  onAddToPlaylist: (track: Track) => {
    dispatch(
      actions.playlists.$playlists_open_add_to_playlist_modal({
        title_id: track.title_id,
      })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
