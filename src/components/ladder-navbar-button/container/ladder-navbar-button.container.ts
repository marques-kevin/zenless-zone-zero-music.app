import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  is_authenticated: state.auth.authenticated,
  ladder_selection: state.ladder.selection,
});

const mapDispatch = () => ({});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;

