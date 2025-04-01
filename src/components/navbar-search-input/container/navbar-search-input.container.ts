import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  query: state.player.search_query,
});

const mapDispatch = (dispatch: any) => ({
  onChangeQuery: (query: string) => {
    dispatch(actions.player.$player_change_search_query({ query }));
  },
  onClick: () => {
    dispatch(actions.player.$player_open_search_modal());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
