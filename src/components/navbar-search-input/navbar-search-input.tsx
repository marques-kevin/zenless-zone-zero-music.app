import React from "react";
import { SearchIcon } from "lucide-react";
import {
  connector,
  ContainerProps,
} from "./container/navbar-search-input.container";
import { useIntl } from "react-intl";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const intl = useIntl();

  return (
    <div className="flex w-full px-4  flex-shrink-0 items-center justify-center gap-2 bg-zinc-900 rounded-full">
      <label
        htmlFor="search"
        className="flex items-center justify-center gap-2"
      >
        <SearchIcon className="h-5 w-5 text-zinc-500" />
      </label>
      <input
        onClick={() => props.onClick()}
        onChange={(e) => props.onChangeQuery(e.target.value)}
        name="search"
        value={props.query}
        className="w-full bg-transparent outline-none font-light py-3 border-none text-zinc-50 placeholder-zink-500"
        placeholder={intl.formatMessage({
          id: "navbar/search/placeholder",
        })}
      />
    </div>
  );
};

export const NavbarSearchInput = connector(Wrapper);
