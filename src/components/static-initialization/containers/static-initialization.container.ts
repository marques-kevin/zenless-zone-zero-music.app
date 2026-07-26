import { connect, ConnectedProps } from "react-redux";
import { actions } from "../../../redux/actions";

const mapState = (state: any, props: { children: React.ReactNode }) => ({
  children: props.children,
});

const mapDispatch = (dispatch: any) => ({
  onMount: () => {
    dispatch(actions.auth.$init());
    dispatch(actions.global.$select_current_track_by_url());
    dispatch(actions.player.$player_fetch_track_with_likes());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
