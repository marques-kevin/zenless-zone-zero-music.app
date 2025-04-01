import clsx from "clsx";
import { EllipsisIcon, LibraryIcon, PlusIcon, TrashIcon } from "lucide-react";
import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/playlists-list.container";
import { FormattedMessage } from "../formatted-message/formatted-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { resolve_playlist_cover } from "@/utils/resolve_playlist_cover";

const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <>
      <div className="flex items-center gap-2 px-4 text-zinc-400">
        <LibraryIcon className="h-6 w-6" />

        <span className="font-semibold ">
          <FormattedMessage id="playlist-column/title" />
        </span>

        <div className="text-zinc-400 text-sm ml-auto">
          <button
            onClick={props.onCreatePlaylist}
            className="hover:bg-zinc-800 rounded-md w-10 h-10 flex items-center justify-center"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-full mt-2 overflow-auto">
        <div className="px-2">
          <div className="grid">
            {props.playlists.map((playlist) => (
              <div
                key={playlist.playlist_id}
                onClick={() => props.onOpenPlaylist(playlist)}
                className="flex relative items-center cursor-pointer group p-2 px-2 rounded hover:bg-zinc-800"
              >
                <div className="relative flex-shrink-0">
                  <img
                    alt="Track artwork"
                    style={{
                      backgroundImage: `url(/characters/characters-background.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="rounded bg-zinc-700 h-12 w-12 object-cover object-center"
                    src={resolve_playlist_cover(playlist.playlist_cover)}
                  />
                </div>

                <div className="ml-3 ">
                  <div className={clsx("overflow-ellipsis")}>
                    {playlist.playlist_name}
                  </div>
                  <div className="text-sm text-zinc-500">Playlist</div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="w-10 h-10 z-10 hover:text-zinc-50 hover:opacity-100 group-hover:opacity-100 data-[state=open]:bg-zinc-700 data-[state=open]:opacity-100 opacity-0 rounded-full hover:bg-zinc-700 absolute flex right-0 bottom-0 top-0 my-auto items-center justify-center">
                    <EllipsisIcon className="h-4 w-4 " />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onPlayPlaylist(playlist.playlist_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/play" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onOpenChangePlaylistName(playlist.playlist_id);
                      }}
                    >
                      <FormattedMessage id="playlists-dropdown/change-name" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onOpenChangePlaylistPicture(playlist.playlist_id);
                      }}
                    >
                      <FormattedMessage id="playlists-dropdown/change-picture" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDeletePlaylist(playlist.playlist_id);
                      }}
                    >
                      <FormattedMessage id="playlists-dropdown/delete" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const PlaylistsList = connector(Wrapper);
