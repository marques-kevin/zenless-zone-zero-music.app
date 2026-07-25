import { connect, ConnectedProps } from "react-redux";
import { actions } from "../../../redux/actions";

const mapState = (state: any, props: { children: React.ReactNode }) => ({
  children: props.children,
});

const mapDispatch = (dispatch: any) => ({
  onMount: () => {
    dispatch(actions.catalog.$fetch_catalog());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
