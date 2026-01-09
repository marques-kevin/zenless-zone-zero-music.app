import React from "react";

import wrapWithIntl from "./wrap-page-element";
import wrapWithProvider from "./wrap-root-element";

export const wrapRootElement = wrapWithProvider;
export const wrapPageElement = wrapWithIntl;

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="lexend-font"
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />,
    <script
      key="umami-analytics-script"
      defer
      src="https://umami.foudroyer.com/analytics.js"
      data-website-id="c7a7c73a-632b-4a64-9a59-fdaa30dc68a4"
      data-domains="zenless-zone-zero-music.app"
      data-exclude-hash="true"
      data-exclude-search="true"
    />,
  ]);
};
