import React from "react";
import { FormattedMessage as ReactFormattedMessage } from "react-intl";
import { Translations } from "@/types/translations.type";

type FormattedMessageProps = {
  id: Translations["keys"];
  values?: Record<string, () => React.ReactNode> | Record<string, any>;
  children?: () => React.ReactElement;
  className?: string;
};

export function FormattedMessage(props: FormattedMessageProps) {
  return <ReactFormattedMessage {...props}></ReactFormattedMessage>;
}
