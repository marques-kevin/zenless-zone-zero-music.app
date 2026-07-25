import { Track } from "@/types/track.type";

export const PLACEHOLDER_TRACK: Track = {
  title: "Loading...",
  title_id: "__loading__",
  artist: "",
  artist_id: "",
  source: "",
  duration: 0,
  playlist_cover: "",
  playlist_id: "",
  playlist_name: "",
  playlist_type: "jukebox",
  created_at: new Date(0),
};
