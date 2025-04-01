import React, { useEffect } from "react";
import {
  connector,
  ContainerProps,
} from "./container/auto-update-checks.container";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const checkForUpdates = () => {
    return props.onCheck();
  };

  useEffect(() => {
    setTimeout(checkForUpdates, 1000);

    const each_10_minutes = 10 * 60 * 1000;

    const interval = setInterval(checkForUpdates, each_10_minutes);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export const AutoUpdateChecks = connector(Wrapper);
