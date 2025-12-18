import * as types from "./types";

interface State {
  /**
   * Ordered list of character ids (names) the user selected for the ladder.
   * Index 0 is #1 favorite, then #2, etc.
   */
  selection: string[];
}

const initialState: State = {
  selection: [],
};

export function ladderReducer(
  state = initialState,
  action: types.LadderActionTypes
): State {
  if (action.type === types.ladder_set_selection) {
    return {
      ...state,
      selection: [...action.payload.characters],
    };
  }

  return state;
}
