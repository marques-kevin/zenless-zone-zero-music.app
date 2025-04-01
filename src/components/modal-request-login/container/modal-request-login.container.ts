import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["request-login"] }));
  },
  onLogin: () => {
    dispatch(actions.auth.$authenticateWithGoogle());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
