import React from "react";
import { FormattedMessage as ReactFormattedMessage } from "react-intl";
import en from "@/i18n/messages/en.json";

type FormattedMessageProps = {
  id: keyof typeof en;
  values?: Record<string, () => React.ReactNode> | Record<string, any>;
  children?: () => React.ReactElement;
  className?: string;
};

export function FormattedMessage(props: FormattedMessageProps) {
  return <ReactFormattedMessage {...props}></ReactFormattedMessage>;
}
