import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState, props: { git_version: string }) => ({
  is_playing: state.player.is_playing,
  current_track: state.player.current_track,
  replay_mode: state.player.replay_mode,
  is_authenticated: state.auth.authenticated,
  git_version: props.git_version,
  deployed_git_version: state.global.deployed_git_version,
  current_git_version: state.global.current_git_version,
  profile_picture: state.auth.profile_picture,
});

const mapDispatch = (dispatch: any) => ({
  onClickHome: () => {
    dispatch(actions.player.$player_close_playlist_details_pane());
  },
  onSearch: () => {
    dispatch(actions.player.$player_open_search_modal());
  },
  onLogin: () => {
    dispatch(actions.auth.$authenticateWithGoogle());
  },
  onLogout: () => {
    dispatch(actions.auth.$logout());
  },
  onOpenNews: () => {
    dispatch(actions.modals.$open({ key: MODAL_KEYS["news"] }));
  },
  onReload: () => {
    dispatch(actions.global.$reload());
  },
  onChangeProfilePicture: () => {
    dispatch(
      actions.modals.$open({ key: MODAL_KEYS["change-profile-picture"] })
    );
  },

  onOpenChangeLanguage: () => {
    dispatch(actions.modals.$open({ key: MODAL_KEYS["change-language"] }));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
