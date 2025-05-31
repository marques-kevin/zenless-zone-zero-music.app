import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Playlist } from "@/types/playlist.type";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: any) => ({
  onOpen: () => {
    dispatch(
      actions.global.$analytics({
        category: "buy-me-coffee",
        action: "button-navbar-clicked",
      })
    );
    dispatch(actions.modals.$open({ key: MODAL_KEYS["buy-me-coffee"] }));
  },
  onClickLink: () => {
    dispatch(
      actions.global.$analytics({
        category: "buy-me-coffee",
        action: "clicked-on-link",
      })
    );
  },
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["buy-me-coffee"] }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
