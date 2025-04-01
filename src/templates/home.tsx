import * as React from "react";
import { Home } from "@/routes/home";
import { Seo } from "@/components/seo/seo";

export default function HomeTemplate(props: {
  pageContext: {
    lang: string;
    otherLangs: Array<{ lang: string; url: string; isDefault: boolean }>;
  };
}) {
  return <Home {...props.pageContext} />;
}

export function Head(props: {
  pageContext: {
    lang: string;
    otherLangs: Array<{ lang: string; url: string; isDefault: boolean }>;
    messages: Record<string, string>;
  };
}) {
  return (
    <Seo
      title={props.pageContext.messages["seo/title"]}
      description={props.pageContext.messages["seo/description"]}
      lang={props.pageContext.lang}
      langUrls={props.pageContext.otherLangs}
    />
  );
}
