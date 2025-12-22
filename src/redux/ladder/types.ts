export const ladder_set_selection = "ladder_set_selection";

export interface ladder_set_selection_action {
  type: typeof ladder_set_selection;
  payload: {
    characters: string[];
  };
}

export type LadderActionTypes = ladder_set_selection_action;
