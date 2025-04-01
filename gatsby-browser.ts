import "./src/styles/global.css";

import wrapWithIntl from "./wrap-page-element";
import wrapWithProvider from "./wrap-root-element";

export const wrapRootElement = wrapWithProvider;
export const wrapPageElement = wrapWithIntl;
