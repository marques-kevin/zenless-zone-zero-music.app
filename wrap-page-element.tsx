import React from "react";
import { CustomIntlProvider } from "./src/components/custom-intl-provider/custom-intl-provider";

export default ({ element, props }) => {
  return (
    <CustomIntlProvider
      lang={props.pageContext.lang}
      messages={props.pageContext.messages}
    >
      <>{element}</>
    </CustomIntlProvider>
  );
};
