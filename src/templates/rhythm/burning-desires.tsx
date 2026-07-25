import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Navbar } from "@/components/navbar/navbar";
import { Seo } from "@/components/seo/seo";
import { RhythmGame } from "@/components/rhythm-game/rhythm-game";
import { getRhythmTrack } from "@/constants/rhythm/tracks";
import { validateChart } from "@/lib/rhythm/chart-io";
import { SelectLanguageModal } from "@/components/select-language-modal/select-language-modal";
import { AutoUpdateChecks } from "@/components/auto-update-checks/auto-update-checks";
import { DownloadAppIosModal } from "@/components/download-app-ios-modal/download-app-ios-modal";
import { ModalChangeProfilePicture } from "@/components/modal-change-profile-picture/modal-change-profile-picture";
import { ModalChangePlaylistPicture } from "@/components/modal-change-playlist-picture/modal-change-playlist-picture";
import { ModalChangePlaylistName } from "@/components/modal-change-playlist-name/modal-change-playlist-name";
import { NewsEntry } from "@/types/news.type";
import initialChartData from "../../../static/rhythm/burning-desires.json";

type PageContext = {
  lang: string;
  messages: Record<string, string>;
  git_version: string;
  news: NewsEntry[];
  otherLangs: Array<{ lang: string; url: string; isDefault: boolean }>;
};

const track = getRhythmTrack("burning-desires")!;
const initialChart = validateChart(initialChartData);

const BurningDesiresRhythmPage: React.FC<PageProps<null, PageContext>> = (
  props
) => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-sky-950 via-indigo-950 to-zinc-950 text-zinc-50">
        <Navbar
          git_version={props.pageContext.git_version}
          news={props.pageContext.news}
        />

        <main className="pb-8">
          <RhythmGame track={track} initialChart={initialChart} />
        </main>
      </div>

      <SelectLanguageModal />
      <AutoUpdateChecks git_version={props.pageContext.git_version} />
      <DownloadAppIosModal />
      <ModalChangeProfilePicture />
      <ModalChangePlaylistPicture />
      <ModalChangePlaylistName />
    </>
  );
};

export default BurningDesiresRhythmPage;

export const Head: HeadFC<null, PageContext> = (props) => {
  const messages = props.pageContext.messages;
  return (
    <Seo
      title={messages["rhythm/seo-title"]}
      description={messages["rhythm/seo-description"]}
      lang={props.pageContext.lang}
      langUrls={props.pageContext.otherLangs}
    />
  );
};
