import { addHash, removeHash } from "@/lib/utils";
import { navigate } from "@reach/router";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { RootState } from "../store";
import { ThunkDispatch } from "redux-thunk";
import { data } from "autoprefixer";

export const $open = (payload: { key: MODAL_KEYS; value?: any }) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    di.AnalyticsService.send({
      category: "modal",
      action: "open",
      data: {
        type: payload.key,
      },
    });

    navigate(
      addHash({
        path: MODAL_KEYS[payload.key],
        currentHash: window.location.hash,
        value: payload.value,
      })
    );
  };
};

export const $close = (payload: { key: MODAL_KEYS }) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    di.AnalyticsService.send({
      category: "modal",
      action: "close",
    });

    navigate(
      removeHash({
        path: MODAL_KEYS[payload.key],
        currentHash: window.location.hash,
      })
    );
  };
};
