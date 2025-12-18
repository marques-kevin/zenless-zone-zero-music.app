import {
  ILadderRepository,
  LadderSelection,
} from "@/interfaces/ILadderRepository";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";

export class LadderRepositoryInMemory implements ILadderRepository {
  private selections: Record<string, LadderSelection> = {};

  async fetch_selection(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<LadderSelection | null>> {
    const existing = this.selections[params.user_id];

    return {
      error: false,
      data: existing ? { ...existing } : null,
    };
  }

  async store_selection(params: {
    user_id: string;
    selection: string[];
  }): Promise<IRepositoryResponse<LadderSelection>> {
    const entry: LadderSelection = {
      characters: [...params.selection],
    };

    this.selections[params.user_id] = entry;

    return {
      error: false,
      data: entry,
    };
  }
}
