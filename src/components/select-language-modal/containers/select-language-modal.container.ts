import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/redux/store";
import { actions } from "@/redux/actions";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["change-language"] }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
