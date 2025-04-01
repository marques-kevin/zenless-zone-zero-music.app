import React, { useEffect } from "react";
import {
  connector,
  ContainerProps,
} from "./container/keyboard-events-listener.container";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLInputElement) return;

      if (event.key === " ") {
        event.preventDefault();
        props.onTogglePlay();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.onTogglePlay]);

  return null;
};

export const KeyboardEventsListener = connector(Wrapper);
