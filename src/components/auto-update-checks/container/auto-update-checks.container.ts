import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any, props: { git_version: string }) => ({
  onCheck: () => {
    dispatch(
      actions.global.$fetch_if_update_is_available({
        current_git_version: props.git_version,
      })
    );
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
