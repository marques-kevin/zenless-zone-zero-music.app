import { tracks } from "./tracks";
import { shuffle, uniqBy } from "lodash";
import { characters } from "./characters";
import { Playlist } from "@/types/playlist.type";

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

export const character_playlists: Playlist[] = characters.map((character) => ({
  playlist_name: character.name,
  playlist_cover: character.image,
  playlist_id: character.name,
  tracks: shuffle(tracks).slice(0, 10),
  playlist_type: "character",
}));

export const all_playlists = [...official_playlists];
