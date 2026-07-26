import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  tracks_currently_playing: state.player.tracks_currently_playing,
  query: state.player.search_query,
});

const mapDispatch = (dispatch: any) => ({
  onPlayTrack: (title_id: string) => {
    dispatch(actions.player.$player_close_search_modal());
    dispatch(actions.player.$player_set_current_track_from_queue({ title_id }));
  },
  onClose: () => {
    dispatch(actions.player.$player_close_search_modal());
  },
  onChangeQuery: (query: string) => {
    dispatch(actions.player.$player_change_search_query({ query }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
