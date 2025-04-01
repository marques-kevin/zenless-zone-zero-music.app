export const resolve_playlist_cover = (cover?: string | null) => {
  if (!cover) return "";

  if (cover.startsWith("/")) return cover;
  return `/characters/${cover}.png`;
};
