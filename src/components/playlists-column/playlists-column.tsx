import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/playlists-column.container";
import { PlaylistsList } from "../playlists-list/playlists-list";

const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div className="w-[280px] hidden md:block rounded-md overflow-hidden bg-zinc-900 py-8">
      <PlaylistsList />
    </div>
  );
};

export const PlaylistsColumn = connector(Wrapper);
