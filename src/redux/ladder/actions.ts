import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import * as types from "./types";
import { $request_login_if_not_authenticated } from "../auth/actions";
import { actions } from "@/redux/actions";
import { MODAL_KEYS } from "@/constants/modal-keys";

export const ladder_set_selection = (
  payload: types.ladder_set_selection_action["payload"]
): types.LadderActionTypes => ({
  type: types.ladder_set_selection,
  payload,
});

/**
 * Publish the user's current ladder selection into the in-memory repository
 * and keep Redux state in sync.
 */
export const $ladder_publish_selection =
  (payload: { characters: string[] }): ThunkAction<any, RootState, any, any> =>
  async (dispatch, getState) => {
    dispatch(
      $request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        const response = await di.LadderRepository.store_selection({
          user_id: user.id,
          selection: payload.characters,
        });

        if (response.error) {
          alert(response.message);
          return;
        }

        dispatch(ladder_set_selection({ characters: payload.characters }));

        dispatch(
          actions.modals.$close({
            key: MODAL_KEYS["ladder-selection"],
          })
        );

        alert(
          "Selection published successfully, we will update the ladder soon!"
        );
      })
    );
  };

/**
 *
 * Load the user's ladder selection from the in-memory repository into Redux.
 *
 */
export const $ladder_fetch_selection =
  (): ThunkAction<any, RootState, any, any> => async (dispatch, getState) => {
    const { di, auth } = getState();

    const user_id = auth.user?.id;

    if (!user_id) {
      return;
    }

    const response = await di.LadderRepository.fetch_selection({ user_id });

    if (response.error) {
      alert(response.message);
      return;
    }

    dispatch(
      ladder_set_selection({ characters: response.data?.characters || [] })
    );
  };
