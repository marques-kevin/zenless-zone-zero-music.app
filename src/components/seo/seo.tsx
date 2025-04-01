import { useLocation } from "@reach/router";
import React from "react";
import { siteUrl } from "@/constants/config";

export const Seo: React.FC<{
  title: string;
  description: string;
  lang: string;
  article?: boolean;
  langUrls: Array<{ lang: string; url: string; isDefault: boolean }>;
}> = ({ title, description, lang, langUrls, ...props }) => {
  const { pathname } = useLocation();

  const seo = {
    title,
    description: description,
    image: `https://zenless-zone-zero-music.app/og/home.png`,
    url: `${siteUrl}${pathname}`,
  };

  const defaultLangUrl = langUrls.find((lang) => lang.isDefault === true);

  return (
    <>
      <html lang={lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />

      {langUrls.map(({ lang, url }) => (
        <link rel="alternate" hrefLang={lang} href={siteUrl + url} key={lang} />
      ))}

      <link
        rel="alternate"
        hrefLang={"x-default"}
        href={siteUrl + defaultLangUrl?.url}
      />

      <meta name="theme-color" content="#18181b" />

      <meta name="viewport" content="width=device-width, user-scalable=no" />

      <meta name="image" content={seo.image} />
      <meta property="og:image" content={seo.image} />
      <meta name="twitter:image" content={seo.image} />

      {seo.url && <meta property="og:url" content={seo.url} />}
      {seo.title && <meta property="og:title" content={seo.title} />}

      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:creator" content={"@KM_Marques"} />

      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
    </>
  );
};
