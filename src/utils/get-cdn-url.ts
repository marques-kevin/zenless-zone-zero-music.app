export const R2_CDN_BASE_URL =
  "https://pub-c6d74e47e1734ec0af83f0e20518da2c.r2.dev";

export const getR2CdnUrl = (path: string) => `${R2_CDN_BASE_URL}${path}`;

export const getCdnUrl = (path: string) => getR2CdnUrl(path);
