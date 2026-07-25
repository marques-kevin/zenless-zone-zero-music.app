import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { MODAL_KEYS } from "@/constants/modal-keys";

const mapState = (state: RootState) => ({
  requests: state.ask_musics.requests,
  requests_fetching: state.ask_musics.requests_fetching,
  submit_fetching: state.ask_musics.submit_fetching,
  submit_result: state.ask_musics.submit_result,
});

const mapDispatch = (dispatch: any) => ({
  onClose: () => {
    dispatch(actions.modals.$close({ key: MODAL_KEYS["ask-music"] }));
  },
  onSubmit: (data: { links: string }) => {
    dispatch(actions.ask_musics.$ask_musics_submit(data));
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
