import React from "react";
import { Navbar } from "@/components/navbar/navbar";
import { AudioGlobalHtmlComponent } from "@/components/audio-global-html-component/audio-global-html-component";
import { PlaylistsColumn } from "@/components/playlists-column/playlists-column";
import { CentralBar } from "@/components/central-bar/central-bar";
import { PlaylistDetailsPane } from "@/components/playlist-details-pane/playlist-details-pane";
import { MobileNavbar } from "@/components/mobile-navbar/mobile-navbar";
import { PlayerBar } from "@/components/player-bar/player-bar";
import { PlayerMobileFullScreen } from "@/components/player-mobile-full-screen/player-mobile-full-screen";
import { QueueBar } from "@/components/queue-bar/queue-bar";
import { SearchModal } from "@/components/search-modal/search-modal";
import { KeyboardEventsListener } from "@/components/keyboard-events-listener/keyboard-events-listener";
import { SelectLanguageModal } from "@/components/select-language-modal/select-language-modal";
import { ModalPlaylistCreate } from "@/components/modal-playlist-create/modal-playlist-create";
import { ModalPlaylistAddTrack } from "@/components/modal-playlist-add-track/modal-playlist-add-track";
import { MobilePlaylistsColumn } from "@/components/mobile-playlists-column/mobile-playlists-column";
import { PlaylistDetailsPaneMobile } from "@/components/playlist-details-pane-mobile/playlist-details-pane-mobile";
import { ModalNews } from "@/components/modal-news/modal-news";
import { Track } from "@/types/track.type";
import { ModalRequestLogin } from "@/components/modal-request-login/modal-request-login";
import { AutoUpdateChecks } from "@/components/auto-update-checks/auto-update-checks";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import { ModalChangeProfilePicture } from "@/components/modal-change-profile-picture/modal-change-profile-picture";
import { ModalChangePlaylistPicture } from "@/components/modal-change-playlist-picture/modal-change-playlist-picture";
import { ModalChangePlaylistName } from "@/components/modal-change-playlist-name/modal-change-playlist-name";
import { DownloadAppIosModal } from "@/components/download-app-ios-modal/download-app-ios-modal";

export const Home: React.FC<{
  lang: string;
  otherLangs: Array<{ lang: string; url: string; isDefault: boolean }>;
  most_played_songs_of_the_month: Track[];
  git_version: string;
}> = (props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <AudioGlobalHtmlComponent />

      <div
        className={clsx(
          "grid grid-rows-[auto,1fr,auto] dark bg-zinc-950 text-zinc-50",
          isMobile ? "" : "h-screen"
        )}
      >
        <Navbar git_version={props.git_version} />

        <div className="grid md:grid-cols-[auto,1fr,auto] gap-2 overflow-hidden md:px-4 md:pb-0 pb-[141px]">
          <PlaylistsColumn />
          <div className="relative h-full rounded-md overflow-hidden">
            <div className="relative h-full overflow-auto">
              <CentralBar
                most_played_songs_of_the_month={
                  props.most_played_songs_of_the_month
                }
              />
            </div>
            <SearchModal />
            <PlaylistDetailsPane />
          </div>
          <QueueBar />
        </div>

        <PlayerBar />
      </div>

      <ModalChangeProfilePicture />
      <ModalChangePlaylistPicture />
      <ModalChangePlaylistName />
      <DownloadAppIosModal />
      <MobileNavbar />
      <AutoUpdateChecks git_version={props.git_version} />
      <MobilePlaylistsColumn />
      <ModalPlaylistAddTrack />
      <ModalRequestLogin />
      <SelectLanguageModal />
      <KeyboardEventsListener />
      <PlayerMobileFullScreen />
      <ModalPlaylistCreate />
      <PlaylistDetailsPaneMobile />
      <ModalNews />
    </>
  );
};
