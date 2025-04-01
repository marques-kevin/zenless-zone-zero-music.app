import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any) => ({
  onTogglePlay: () => {
    dispatch(actions.player.player_set_playing({}));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
