const env = process.env.NODE_ENV;

export const getCdnUrl = (music_url: string) => {
  if (env !== "production") return `http://localhost:8002${music_url}`;

  return `https://pub-c6d74e47e1734ec0af83f0e20518da2c.r2.dev${music_url}`;
};
