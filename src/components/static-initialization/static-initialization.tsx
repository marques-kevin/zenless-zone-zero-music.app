import React, { ReactElement, useEffect } from "react";
import {
  connector,
  ContainerProps,
} from "./containers/static-initialization.container";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    setTimeout(() => props.onMount());
  }, []);

  return <>{props.children}</>;
};

export const StaticInitialization = connector(Wrapper);
