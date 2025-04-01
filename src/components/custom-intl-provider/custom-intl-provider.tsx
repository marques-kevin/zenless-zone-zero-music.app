import React, { ReactElement } from "react";
import { IntlProvider } from "react-intl";

type Props = {
  lang: string;
  messages: Record<string, any>;
  children: ReactElement;
};

export const CustomIntlProvider: React.FC<Props> = (props) => {
  const { lang, messages } = props;

  return (
    <IntlProvider locale={lang} messages={messages}>
      {props.children}
    </IntlProvider>
  );
};
