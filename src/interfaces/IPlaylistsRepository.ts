import { Playlist } from "@/types/playlist.type";
import { Track } from "@/types/track.type";
import { IRepositoryResponse } from "./IRepositoryResponse";

export interface IPlaylistsRepository {
  fetch(params: { user_id: string }): Promise<IRepositoryResponse<Playlist[]>>;

  create(params: {
    user_id: string;
    name: string;
    cover: string;
  }): Promise<IRepositoryResponse<Playlist>>;

  change_playlist_name(params: {
    playlist_id: string;
    playlist_name: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>>;

  delete_playlist(params: {
    playlist_id: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>>;

  change_playlist_picture(params: {
    playlist_id: string;
    character: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>>;

  add_track_on_playlist(params: {
    playlist_id: string;
    track: Track;
    user_id: string;
  }): Promise<IRepositoryResponse<Playlist>>;

  remove_track_from_playlist(params: {
    playlist_id: string;
    title_id: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>>;
}
