import { characters } from "@/database/characters";

export const resolve_playlist_cover = (cover?: string | null) => {
  if (!cover) return "";

  if (cover.startsWith("/")) return cover;

  // Look up the character in the database to get the actual image path
  const character = characters.find(
    (c) => c.name.toLowerCase() === cover.toLowerCase()
  );

  if (character) {
    return character.image;
  }

  // Fallback to .png for backwards compatibility
  return `/characters/${cover}.png`;
};
