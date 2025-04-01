export type Track = {
  title: string;
  title_id: string;
  artist: string;
  artist_id: string;
  source: string;
  duration: number;
  playlist_cover: string;
  playlist_id: string;
  playlist_name: string;
  playlist_type: "jukebox" | "character";
  created_at: Date;
};

export type TrackWithLikes = {
  title_id: Track["title_id"];
  number_of_likes: number;
};

export type ReplayMode = "replay_playlist" | "replay_track";
