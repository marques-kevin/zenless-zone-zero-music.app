import React from "react";
import { connector, ContainerProps } from "./container/radio-button.container";
import { RadioIcon } from "lucide-react";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="relative text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
      title="Radio - Play 30 random songs"
    >
      <RadioIcon className="w-5 h-5" />
    </button>
  );
};

export const RadioButton = connector(Wrapper);

