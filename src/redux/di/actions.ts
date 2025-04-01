import * as types from "./types";

export const register = (
  payload: types.registerAction["payload"]
): types.DiActionTypes => ({
  type: types.register,
  payload,
});
