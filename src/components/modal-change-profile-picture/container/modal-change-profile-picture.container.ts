import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  profile_picture: state.auth.profile_picture,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(
      actions.modals.$close({ key: MODAL_KEYS["change-profile-picture"] })
    );
  },
  onSelect: (character: string) => {
    dispatch(actions.auth.$set_profile_picture({ profile_picture: character }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
