import { IRepositoryResponse } from "./IRepositoryResponse";

export type LadderSelection = {
  characters: string[];
};

export interface ILadderRepository {
  fetch_selection(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<LadderSelection | null>>;

  store_selection(params: {
    user_id: string;
    selection: string[];
  }): Promise<IRepositoryResponse<LadderSelection>>;
}

