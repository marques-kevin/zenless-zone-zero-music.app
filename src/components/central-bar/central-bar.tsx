import React from "react";
import { official_playlists } from "@/database/playlists";
import { connector, ContainerProps } from "./container/central-bar.container";
import { PlayIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { uniqBy } from "lodash";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { tracks } from "@/database/tracks";
import { TracksList } from "../tracks-list/tracks-list";

const tracks_recently_added = tracks
  .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  .slice(0, 20);

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen: isPlaylistDetailsPaneOpen } = useModal("playlist-details");
  const { isOpen: isSearchPaneOpen } = useModal("search");

  return (
    <>
      <div
        className={clsx(
          "bg-zinc-900 rounded-md md:overflow-auto md:h-full transition-all duration-300",
          isPlaylistDetailsPaneOpen || isSearchPaneOpen
            ? "opacity-0 scale-95"
            : "opacity-100"
        )}
      >
        <div className="grid gap-6 py-8">
          <div className="px-4">
            <h1 className="mb-4 text-2xl pl-1 font-medium">
              <FormattedMessage id="central-bar/zenless-zone-zero-soundtrack" />
            </h1>
            <div className="grid grid-cols-2 xl:grid-cols-5 md:grid-cols-1 lg:grid-cols-2 gap-0">
              {official_playlists
                .filter((playlist) => playlist.playlist_type === "jukebox")
                .map((_, i) => (
                  <div
                    key={_.playlist_id}
                    onClick={(e) => {
                      props.onOpenPlaylist(_);
                    }}
                    className="cursor-pointer group hover:bg-zinc-800 rounded relative"
                  >
                    <div className="p-2">
                      <div className="relative">
                        <img
                          alt="Album cover"
                          className="aspect-square w-full rounded object-cover"
                          src={_.playlist_cover}
                        />

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            props.onPlayAlbum(_.playlist_id);
                          }}
                          className="absolute hover:scale-110 hover:bg-green-400 group-hover:opacity-100 transform translate-y-0 group-hover:-translate-y-2 opacity-0 transition-all duration-300 shadow-lg bottom-0 right-2 rounded-full bg-green-500 p-3"
                        >
                          <PlayIcon className="h-5 w-5 text-zinc-900" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="font-semibold">{_.playlist_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {uniqBy(_.tracks, "artist")
                            .map((track) => track.artist)
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="px-4 mt-8">
            <div className="mb-4 pl-1">
              <h2 className="text-2xl">
                <FormattedMessage id="central-bar/characters-playlists" />
              </h2>
              <p className="text-zinc-400">
                <FormattedMessage id="central-bar/characters-playlists-description" />
              </p>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 md:grid-cols-1 lg:grid-cols-2 gap-0">
              {official_playlists
                .filter((playlist) => playlist.playlist_type === "character")
                .map((_, i) => (
                  <div
                    key={_.playlist_id}
                    onClick={(e) => {
                      props.onOpenPlaylist(_);
                    }}
                    className="cursor-pointer group hover:bg-zinc-800 rounded relative"
                  >
                    <div className="p-2 flex items-center">
                      <img
                        alt="Album cover"
                        style={{
                          backgroundImage: `url(/characters/characters-background.png)`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className="aspect-square w-12 h-12 rounded object-cover"
                        src={_.playlist_cover}
                      />

                      <div className="ml-2">
                        <div className="">{_.playlist_name}</div>
                        <div className="text-sm text-zinc-400">
                          <FormattedMessage
                            id="central-bar/characters-playlists-tracks-count"
                            values={{ c: _.tracks.length }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="px-4 mt-8">
            <div className="mb-4 pl-1">
              <h2 className="text-2xl">
                <FormattedMessage id="central-bar/most-played-songs-of-the-month" />
              </h2>
              <p className="text-zinc-400">
                <FormattedMessage id="central-bar/most-played-songs-of-the-month-description" />
              </p>
            </div>
            <div className="grid pb-4">
              <TracksList
                tracks={props.most_played_songs_of_the_month}
                show_duration={true}
                show_cover={true}
                can_be_removed_from_playlist={false}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-4 mt-8 text-2xl pl-5 font-medium">
              <FormattedMessage id="central-bar/musics-recently-added" />
            </h2>

            <div className="grid pb-4 px-2">
              <TracksList
                tracks={tracks_recently_added}
                show_duration={true}
                show_cover={true}
                can_be_removed_from_playlist={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CentralBar = connector(Wrapper);
