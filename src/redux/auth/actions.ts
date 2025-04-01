import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import * as types from "./types";
import { actions } from "../actions";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { UserEntity } from "@/types/user";

export const authenticate = (
  payload: types.auth_authenticate_action["payload"]
): types.AuthActionTypes => ({
  type: types.auth_authenticate,
  payload,
});

export const logout = (): types.AuthActionTypes => ({
  type: types.auth_logout,
});

export const $logout =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di } = getState();

    await di.AuthRepository.logout();

    dispatcher(logout());

    await di.AnalyticsService.send({
      category: "auth",
      action: "logout",
    });

    window.location.href = window.location.pathname;
    window.location.reload();
  };

export const $isAuthenticated =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di } = getState();

    const response = await di.AuthRepository.isAuthenticated();

    if (response.authenticated) {
      dispatcher(authenticate({ user: response.user }));
    }
  };

export const $init =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di } = getState();

    const response = await di.AuthRepository.isAuthenticated();

    if (response.authenticated) {
      dispatcher(authenticate({ user: response.user }));
      dispatcher(actions.playlists.$fetch());
      dispatcher(actions.auth.$fetch_profile_picture());
      dispatcher(actions.player.$player_fetch_all_tracks_that_user_liked());
    }
  };

export const $authenticateWithGoogle =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di } = getState();

    const response = await di.AuthRepository.authenticateWithGoogle();

    if (response.authenticated) {
      dispatcher(authenticate({ user: response.user }));
      dispatcher(actions.auth.$init());
      dispatcher(actions.modals.$close({ key: MODAL_KEYS["request-login"] }));

      di.AnalyticsService.send({
        category: "auth",
        action: "login",
      });
    }
  };

export const set_profile_picture = (
  payload: types.auth_set_profile_picture_action["payload"]
): types.AuthActionTypes => ({
  type: types.auth_set_profile_picture,
  payload,
});

export const $set_profile_picture =
  (
    payload: types.auth_set_profile_picture_action["payload"]
  ): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        const response = await di.AuthRepository.set_profile_picture({
          ...payload,
          user_id: user.id,
        });

        if (response.error) {
          return alert(response.message);
        }

        dispatcher(set_profile_picture(payload));
        dispatcher(
          actions.modals.$close({ key: MODAL_KEYS["change-profile-picture"] })
        );

        di.AnalyticsService.send({
          category: "profile",
          action: "change-profile-picture",
          data: { character: payload.profile_picture },
        });
      })
    );
  };

export const $fetch_profile_picture =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) return;

    const response = await di.AuthRepository.get_profile_picture({
      user_id: auth.user.id,
    });

    if (response.error) {
      return alert(response.message);
    }

    if (!response.data) return;

    dispatcher(set_profile_picture({ profile_picture: response.data }));
  };

export const $request_login_if_not_authenticated =
  (
    callback: (user: UserEntity) => void
  ): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    const { di, auth } = getState();

    if (!auth.user) {
      return dispatcher(
        actions.modals.$open({ key: MODAL_KEYS["request-login"] })
      );
    } else {
      return callback(auth.user);
    }
  };
