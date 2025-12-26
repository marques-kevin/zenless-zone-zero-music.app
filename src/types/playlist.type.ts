import { Track } from "./track.type";

export type Playlist = {
  playlist_name: string;
  playlist_id: string;
  playlist_cover: string;
  playlist_type: "jukebox" | "character" | "most_liked" | "most_played";
  tracks: Track[];
};

export type PlaylistOnDatabaseEntity = {
  playlist_name: string;
  playlist_id: string;
  playlist_cover: string;
  tracks: Track["title_id"][];
};
