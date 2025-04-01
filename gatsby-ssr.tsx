import React from "react";

import wrapWithIntl from "./wrap-page-element";
import wrapWithProvider from "./wrap-root-element";

export const wrapRootElement = wrapWithProvider;
export const wrapPageElement = wrapWithIntl;

export const onRenderBody = ({ setHeadComponents }) => {
  const scriptProps = {
    async: true,
    defer: true,
    "data-domain": "zenless-zone-zero-music.app",
    src: "https://plausible.foudroyer.com/js/script.outbound-links.pageview-props.tagged-events.js",
  };

  setHeadComponents([
    <link
      key="lexend-font"
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />,
    <link
      key="gatsby-plugin-plausible-preconnect"
      rel="preconnect"
      href={scriptProps.src}
    />,
    <script key="gatsby-plugin-plausible-script" {...scriptProps}></script>,

    <script
      key="gatsby-plugin-plausible-custom-events"
      dangerouslySetInnerHTML={{
        __html: `
          window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
          `,
      }}
    />,
  ]);
};
