import { TrackWithLikes } from "@/types/track.type";
import { IRepositoryResponse } from "./IRepositoryResponse";

export interface ILikesRepository {
  fetch_user_liked_titles(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<string[]>>;

  store_user_liked_title(params: {
    user_id: string;
    title_id: string;
  }): Promise<IRepositoryResponse<null>>;

  delete_user_liked_title(params: {
    user_id: string;
    title_id: string;
  }): Promise<IRepositoryResponse<null>>;

  fetch_all_tracks_with_likes(): Promise<IRepositoryResponse<TrackWithLikes[]>>;
}
