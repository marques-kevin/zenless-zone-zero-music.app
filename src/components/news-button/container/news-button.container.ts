import { connect, ConnectedProps } from "react-redux";
import { actions } from "@/redux/actions";
import { RootState } from "@/redux/store";

const mapState = (state: RootState) => ({
  last_time_news_was_seen: state.news.last_time_news_was_seen,
  current_news_date: state.news.current_news_date,
});

const mapDispatch = (dispatch: any) => ({
  onClick: () => {
    dispatch(actions.news.$open_news_modal());
  },
  onMount: () => {
    dispatch(actions.news.$fetch_if_news_has_been_seen());
  },
});

export const connector = connect(mapState, mapDispatch);
export type ContainerProps = ConnectedProps<typeof connector>;
