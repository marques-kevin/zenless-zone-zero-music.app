import { Modules } from "../../interfaces/IModule"

export type DiInjectable = Modules

export const register = "REDUX_DI_REGISTER"
export interface registerAction {
  type: typeof register
  payload: DiInjectable
}

export type DiActionTypes = registerAction
