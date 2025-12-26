import { tracks } from "./tracks";
import { uniqBy } from "lodash";
import { Playlist } from "@/types/playlist.type";
import { songs as top_100_songs } from "@/database/top_100.json";
import { songs as most_played_songs } from "@/database/most_played.json";

export const official_playlists: Playlist[] = uniqBy(
  tracks,
  (track) => track.playlist_id
)
  .map((playlist) => ({
    playlist_name: playlist.playlist_name,
    playlist_cover: playlist.playlist_cover,
    playlist_id: playlist.playlist_id,
    playlist_type: playlist.playlist_type,
    tracks: tracks.filter(
      (track) => track.playlist_id === playlist.playlist_id
    ),
  }))
  .reverse();

export const top_100_playlists: Playlist = {
  playlist_name: "Top 10 Liked Songs",
  playlist_cover: "/covers/top-100.jpg",
  playlist_id: "top-100",
  playlist_type: "most_liked",
  tracks: top_100_songs.slice(0, 10).map((song) => ({
    ...tracks.find((track) => track.title_id === song.title_id)!,
    number_of_likes: song.number_of_likes,
  })),
};

export const most_played_playlists: Playlist = {
  playlist_name: "Most Played Songs of the Month",
  playlist_cover: "/covers/top-100.jpg",
  playlist_id: "most-played",
  playlist_type: "most_played",
  tracks: most_played_songs
    .map((song) => ({
      ...tracks.find((track) => track.title_id === song.track_id)!,
      number_of_plays: song.number_of_plays,
    }))
    .slice(0, 10),
};

export const all_playlists = [...official_playlists];
