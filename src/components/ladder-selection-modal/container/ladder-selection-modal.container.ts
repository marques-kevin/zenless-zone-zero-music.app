import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (_state: RootState) => ({
  selection: _state.ladder.selection,
});

const mapDispatch = (dispatch: any) => ({
  on_close: () => {
    dispatch(
      actions.modals.$close({
        key: MODAL_KEYS["ladder-selection"],
      })
    );
  },
  on_save: (characters: string[]) => {
    dispatch(actions.ladder.$ladder_publish_selection({ characters }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
