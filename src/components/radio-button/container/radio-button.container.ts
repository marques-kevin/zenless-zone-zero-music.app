import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";

const mapState = () => ({});

const mapDispatch = (dispatch: any) => ({
  onClick: () => {
    dispatch(actions.player.$player_play_radio());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;

