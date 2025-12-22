import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Navbar } from "@/components/navbar/navbar";
import { Seo } from "@/components/seo/seo";
import { Modal } from "@/components/ui/modal";
import { useDispatch } from "react-redux";
import { actions } from "@/redux/actions";
import { MODAL_KEYS } from "@/constants/modal-keys";
import clsx from "clsx";
import { LadderSelectionModal } from "@/components/ladder-selection-modal/ladder-selection-modal";
import { ModalRequestLogin } from "@/components/modal-request-login/modal-request-login";
import { Ladder } from "@/types/ladders.type";
import { characters as ALL_CHARACTERS } from "@/database/characters";
import { LaddersCharactersStatsModal } from "@/components/ladders-characters-stats-modal/ladders-characters-stats-modal";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";
import { useIntl } from "react-intl";
import { SelectLanguageModal } from "@/components/select-language-modal/select-language-modal";
import { AudioGlobalHtmlComponent } from "@/components/audio-global-html-component/audio-global-html-component";
import { PlayerBar } from "@/components/player-bar/player-bar";
import { KeyboardEventsListener } from "@/components/keyboard-events-listener/keyboard-events-listener";
import { AutoUpdateChecks } from "@/components/auto-update-checks/auto-update-checks";
import { DownloadAppIosModal } from "@/components/download-app-ios-modal/download-app-ios-modal";
import { ModalChangeProfilePicture } from "@/components/modal-change-profile-picture/modal-change-profile-picture";
import { ModalChangePlaylistPicture } from "@/components/modal-change-playlist-picture/modal-change-playlist-picture";
import { ModalChangePlaylistName } from "@/components/modal-change-playlist-name/modal-change-playlist-name";
import { MobileNavbar } from "@/components/mobile-navbar/mobile-navbar";
import { PlayerMobileFullScreen } from "@/components/player-mobile-full-screen/player-mobile-full-screen";
import { TrophyIcon } from "lucide-react";
import { NewsEntry } from "@/types/news.type";
import { formatRelativeTime } from "@/lib/utils";

const characters_map = ALL_CHARACTERS.reduce((acc, character) => {
  acc[character.name] = character;
  return acc;
}, {} as Record<string, (typeof ALL_CHARACTERS)[number]>);

const to_display_name = (raw: string) =>
  raw
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

type Character = {
  name: string;
  image: string;
};

const get_bg_color_by_rank = (rank: number) => {
  if (rank === 1) return "bg-amber-400";
  if (rank === 2) return "bg-violet-400";
  if (rank === 3) return "bg-orange-400";
  if (rank === 4) return "bg-fuchsia-400";
  if (rank === 5) return "bg-emerald-400";
  return "";
};

const Item = ({
  entry,
  character,
  onClick,
}: {
  entry: Ladder["ladder"][number];
  character: (typeof ALL_CHARACTERS)[number];
  onClick: () => void;
}) => {
  return (
    <div
      key={entry.rank}
      className={clsx(
        "rounded overflow-hidden border-zinc-800 cursor-pointer hover:bg-zinc-800/40 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex h-full flex-col bg-zinc-900">
        <div className="flex relative h-full flex-col bg-transparent">
          <div className="flex absolute px-2 py-2 top-0 left-0 right-0 items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-300">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ${
                entry.rank === 1
                  ? "bg-amber-400 text-zinc-950"
                  : entry.rank === 2
                  ? "bg-violet-400 text-zinc-950"
                  : entry.rank === 3
                  ? "bg-orange-400 text-zinc-950"
                  : entry.rank === 4
                  ? "bg-fuchsia-400 text-zinc-950"
                  : "bg-emerald-400 text-zinc-950"
              }`}
            >
              {entry.rank}
            </span>

            <span className="text-[11px] bg-zinc-800 px-2 py-1 rounded-full text-zinc-50">
              {entry.points.toLocaleString()}{" "}
              <FormattedMessage id="ladder/characters/item/points-suffix" />
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="w-full overflow-hidden aspect-square">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(/characters/characters-background.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={character?.image}
                  alt={entry.id}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-zinc-50">
                {entry.id}
              </span>
            </div>

            <div className="pb-4 flex w-full flex-col gap-1.5 px-4 text-[11px] text-zinc-400">
              <div className="flex items-center justify-between">
                <span>
                  <FormattedMessage id="ladder/characters/item/popularity-label" />
                </span>
                <span className="font-semibold text-zinc-100">
                  {entry.popularity.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${get_bg_color_by_rank(
                    entry.rank
                  )}`}
                  style={{ width: `${entry.popularity}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmallItem = (props: {
  entry: {
    id: string;
    rank: number;
    points: number;
    popularity: number;
  };
  character: Character;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center rounded h-14 overflow-hidden bg-zinc-900 text-[10px] hover:bg-zinc-900/70 cursor-pointer transition-colors"
      onClick={props.onClick}
    >
      <div className="relative aspect-square h-full">
        <div className=" overflow-hidden w-full h-full bg-zinc-900">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(/characters/characters-background.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={props.character?.image}
              alt={props.entry.id}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <span
          className={clsx(
            "inline-flex absolute bottom-0 left-0 px-1 ml-0.5 mb-0.5 bg-zinc-800 text-zinc-200 rounded text-[9px] font-semibold"
          )}
        >
          {props.entry.rank}
        </span>
      </div>

      <div className="flex flex-1 px-2 flex-col">
        <div className="mt-0.5 flex items-center justify-between gap-1">
          <span className="truncate text-[9px] uppercase tracking-wide text-zinc-50">
            {props.entry.id}
          </span>
          <span className="text-[9px] text-zinc-50">
            {props.entry.points.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={clsx(
                "h-full rounded-full bg-zinc-500",
                get_bg_color_by_rank(props.entry.rank)
              )}
              style={{ width: `${props.entry.popularity}%` }}
            />
          </div>
          <span className="text-[9px] text-zinc-500">
            {props.entry.popularity.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

type PageContext = {
  ladders: {
    characters: Ladder;
  };
  lang: string;
  messages: Record<string, string>;
  git_version: string;
  build_time: string;
  otherLangs: Array<{ lang: string; url: string; isDefault: boolean }>;
  news?: NewsEntry[];
};

type Props = PageProps<null, PageContext>;

const CharactersLadderPage: React.FC<Props> = (props) => {
  const characters = props.pageContext.ladders.characters;

  const dispatch = useDispatch<any>();
  const intl = useIntl();
  const deployed_at = new Date(props.pageContext.build_time);

  const [character_details_selected, set_character_details_selected] =
    React.useState<string | null>(null);

  const top5 = characters.ladder.slice(0, 5);
  const top1 = top5[0];
  const top2 = top5[1];
  const top3 = top5[2];
  const top4 = top5[3];
  const top5_entry = top5[4];

  const top1_stats = top1 ? characters.characters[top1.id] : undefined;
  const top2_stats = top2 ? characters.characters[top2.id] : undefined;
  const top3_stats = top3 ? characters.characters[top3.id] : undefined;
  const top4_stats = top4 ? characters.characters[top4.id] : undefined;
  const top5_stats = top5_entry
    ? characters.characters[top5_entry.id]
    : undefined;

  const has_full_top5 =
    !!top1_stats &&
    !!top2_stats &&
    !!top3_stats &&
    !!top4_stats &&
    !!top5_stats;

  return (
    <>
      <div className="text-zinc-50">
        <Navbar
          git_version={props.pageContext.git_version}
          news={props.pageContext.news}
        />

        {/* Floating action button to pick top 5 */}
        <button
          type="button"
          onClick={() =>
            dispatch(
              actions.modals.$open({ key: MODAL_KEYS["ladder-selection"] })
            )
          }
          className="fixed bottom-6 right-4 md:right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-950 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50 transition-all duration-300 hover:animate-none border-2 border-amber-400/30"
        >
          <TrophyIcon className="w-5 h-5 md:w-6 md:h-6 drop-shadow-lg" />
          <span className="hidden sm:inline drop-shadow-sm">
            <FormattedMessage id="ladder/characters/fab/label-full" />
          </span>
          <span className="sm:hidden drop-shadow-sm">
            <FormattedMessage id="ladder/characters/fab/label-short" />
          </span>
        </button>

        <main className="mx-auto space-y-10 mt-8 max-w-6xl px-4">
          <div id="ladder-content" className="space-y-4">
            {/* Top 1 - Full width on mobile */}
            {top1 && (
              <div className="md:hidden">
                <Item
                  key={top1.rank}
                  entry={{
                    id: top1.id,
                    rank: top1.rank,
                    points: top1.points,
                    popularity: top1.popularity,
                  }}
                  character={characters_map[top1.id]!}
                  onClick={() => set_character_details_selected(top1.id)}
                />
              </div>
            )}

            {/* Top 2-5 - 2 columns on mobile, 5 columns on desktop */}
            <section className="grid gap-4 grid-cols-2 md:grid-cols-5">
              {characters.ladder.slice(0, 5).map((entry) => {
                const character = characters_map[entry.id];

                return (
                  <div
                    key={entry.rank}
                    className={entry.rank === 1 ? "hidden md:block" : ""}
                  >
                    <Item
                      entry={{
                        id: entry.id,
                        rank: entry.rank,
                        points: entry.points,
                        popularity: entry.popularity,
                      }}
                      character={character!}
                      onClick={() => set_character_details_selected(entry.id)}
                    />
                  </div>
                );
              })}
            </section>

            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
              {characters.ladder.slice(5).map((entry) => {
                const character = characters_map[entry.id];

                return (
                  <SmallItem
                    key={entry.rank}
                    entry={entry}
                    character={character!}
                    onClick={() => set_character_details_selected(entry.id)}
                  />
                );
              })}
            </div>
          </div>

          <header className="space-y-2 mt-8">
            <h1 className="text-2xl font-semibold uppercase tracking-wide text-zinc-50 md:text-3xl">
              <FormattedMessage id="ladder/characters/title" />
            </h1>

            <p className="max-w-3xl text-sm text-zinc-400 md:text-base">
              <FormattedMessage
                id="ladder/characters/description/intro"
                values={{
                  top5_label: (
                    <span className="font-semibold text-zinc-200">
                      <FormattedMessage id="ladder/characters/description/top5-label" />
                    </span>
                  ),
                  how_strongly_label: (
                    <span className="font-semibold text-zinc-200">
                      <FormattedMessage id="ladder/characters/description/how-strongly-label" />
                    </span>
                  ),
                }}
              />
              {has_full_top5 && (
                <>
                  {" "}
                  <FormattedMessage
                    id="ladder/characters/description/top1"
                    values={{
                      top1_name: (
                        <span className="font-semibold text-zinc-100">
                          {to_display_name(top1.id)}
                        </span>
                      ),
                      top1_total_votes: (
                        <span className="font-semibold text-zinc-100">
                          {top1_stats.total_votes.toLocaleString()}
                        </span>
                      ),
                      top1_first_votes: (
                        <span className="font-semibold text-zinc-100">
                          {top1_stats.total_votes_1.toLocaleString()}
                        </span>
                      ),
                      first_place_label: (
                        <span className="font-semibold text-zinc-100">
                          <FormattedMessage id="ladder/characters/description/first-place-label" />
                        </span>
                      ),
                    }}
                  />{" "}
                  <FormattedMessage
                    id="ladder/characters/description/top2-5"
                    values={{
                      top2_name: (
                        <span className="font-semibold text-zinc-100">
                          {to_display_name(top2.id)}
                        </span>
                      ),
                      top3_name: (
                        <span className="font-semibold text-zinc-100">
                          {to_display_name(top3.id)}
                        </span>
                      ),
                      top4_name: (
                        <span className="font-semibold text-zinc-100">
                          {to_display_name(top4.id)}
                        </span>
                      ),
                      top5_name: (
                        <span className="font-semibold text-zinc-100">
                          {to_display_name(top5_entry.id)}
                        </span>
                      ),
                      total_top5_votes: (
                        <span className="font-semibold text-zinc-100">
                          {(
                            top2_stats.total_votes +
                            top3_stats.total_votes +
                            top4_stats.total_votes +
                            top5_stats.total_votes
                          ).toLocaleString()}
                        </span>
                      ),
                    }}
                  />
                </>
              )}
            </p>
          </header>

          <LaddersCharactersStatsModal
            data={characters.characters[character_details_selected as string]}
            character={
              character_details_selected
                ? characters_map[character_details_selected as string]
                : null
            }
            onClose={() => set_character_details_selected(null)}
          />

          <footer className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-zinc-800 pt-4 text-xs text-zinc-400 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-1 font-semibold text-orange-300">
                <FormattedMessage
                  id="ladder/characters/footer/total-votes"
                  values={{
                    count: (
                      <span className="ml-1 text-orange-100">
                        {characters.total_votes.toLocaleString()}
                      </span>
                    ),
                  }}
                />
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              <FormattedMessage
                id="ladder/characters/footer/last-updated"
                values={{
                  timestamp: (
                    <span className="font-medium">
                      {formatRelativeTime(deployed_at, intl.locale)}
                    </span>
                  ),
                }}
              />
            </p>
          </footer>
        </main>
      </div>

      <LadderSelectionModal />
      <ModalRequestLogin />
      <SelectLanguageModal />
      <AutoUpdateChecks git_version={props.pageContext.git_version} />
      <DownloadAppIosModal />
      <ModalChangeProfilePicture />
      <ModalChangePlaylistPicture />
      <ModalChangePlaylistName />
    </>
  );
};

export default CharactersLadderPage;

export const Head: HeadFC<null, PageContext> = (props) => {
  const messages = props.pageContext.messages;
  return (
    <Seo
      title={messages["ladder/characters/seo-title"]}
      description={messages["ladder/characters/seo-description"]}
      lang={props.pageContext.lang}
      langUrls={props.pageContext.otherLangs}
    />
  );
};
