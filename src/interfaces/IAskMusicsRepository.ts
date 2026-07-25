import { AskMusic } from "@/types/ask-music.type";
import { IRepositoryResponse } from "./IRepositoryResponse";

export type SubmitAskMusicResult = {
  submitted_urls: string[];
  already_requested_urls: string[];
  invalid_lines: string[];
};

export interface IAskMusicsRepository {
  submit_requests(params: {
    user_id: string;
    urls: string[];
  }): Promise<IRepositoryResponse<SubmitAskMusicResult>>;

  fetch_user_requests(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<AskMusic[]>>;
}
