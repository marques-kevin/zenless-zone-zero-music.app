import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";

const mapDispatch = (dispatch: any) => ({
  onClick: () => {
    dispatch(actions.ask_musics.$ask_musics_open_modal());
  },
});

export const connector = connect(null, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
