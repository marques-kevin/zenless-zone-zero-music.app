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
              {entry.points.toLocaleString()} pts
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="overflow-hidden">
              <div
                style={{
                  backgroundImage: `url(/characters/characters-background.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img src={character?.image} alt={entry.id} className="w-full" />
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-zinc-50">
                {entry.id}
              </span>
            </div>

            <div className="pb-4 flex w-full flex-col gap-1.5 px-4 text-[11px] text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Popularity</span>
                <span className="font-semibold text-zinc-100">
                  {entry.popularity}%
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
            {props.entry.popularity}%
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
};

type Props = PageProps<null, PageContext>;

const CharactersLadderPage: React.FC<Props> = (props) => {
  const characters = props.pageContext.ladders.characters;

  const dispatch = useDispatch<any>();

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
        {/* Fake git version is fine here, this page is static */}
        <Navbar git_version={"dev"} />

        {/* Floating action button to pick top 5 */}
        <button
          type="button"
          onClick={() =>
            dispatch(
              actions.modals.$open({ key: MODAL_KEYS["ladder-selection"] })
            )
          }
          className="fixed bottom-6 right-4 md:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-950 shadow-lg hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          <span className="hidden sm:inline">Pick my top 5</span>
          <span className="sm:hidden">Top 5</span>
        </button>

        <main className="mx-auto space-y-10 mt-8 max-w-6xl">
          <div className="space-y-4">
            <section className="grid gap-4 grid-cols-2 md:grid-cols-5">
              {characters.ladder.slice(0, 5).map((entry) => {
                const character = characters_map[entry.id];

                return (
                  <Item
                    key={entry.rank}
                    entry={{
                      id: entry.id,
                      rank: entry.rank,
                      points: entry.points,
                      popularity: entry.popularity,
                    }}
                    character={character!}
                    onClick={() => set_character_details_selected(entry.id)}
                  />
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
              Most popular characters in Zenless Zone Zero
            </h1>

            <p className="max-w-3xl text-sm text-zinc-400 md:text-base">
              This ranking is built from players choosing their{" "}
              <span className="font-semibold text-zinc-200">
                top 5 characters
              </span>
              . Each first-place vote is worth 5 points (then 4, 3, 2, 1), so
              you can see not only who appears most often, but{" "}
              <span className="font-semibold text-zinc-200">
                how strongly each character is liked
              </span>{" "}
              based on community preferences.
              {has_full_top5 && (
                <>
                  {" "}
                  Right now, the community’s absolute favorite is{" "}
                  <span className="font-semibold text-zinc-100">
                    {to_display_name(top1.id)}
                  </span>
                  , who appears in the top 5{" "}
                  <span className="font-semibold text-zinc-100">
                    {top1_stats.total_votes.toLocaleString()}
                  </span>{" "}
                  times, with{" "}
                  <span className="font-semibold text-zinc-100">
                    {top1_stats.total_votes_1.toLocaleString()}
                  </span>{" "}
                  players putting them in{" "}
                  <span className="font-semibold text-zinc-100">
                    first place
                  </span>
                  . Just behind,{" "}
                  <span className="font-semibold text-zinc-100">
                    {to_display_name(top2.id)}
                  </span>
                  ,{" "}
                  <span className="font-semibold text-zinc-100">
                    {to_display_name(top3.id)}
                  </span>
                  ,{" "}
                  <span className="font-semibold text-zinc-100">
                    {to_display_name(top4.id)}
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-zinc-100">
                    {to_display_name(top5_entry.id)}
                  </span>{" "}
                  regularly appear in players’ shortlists, showing up a combined{" "}
                  <span className="font-semibold text-zinc-100">
                    {(
                      top2_stats.total_votes +
                      top3_stats.total_votes +
                      top4_stats.total_votes +
                      top5_stats.total_votes
                    ).toLocaleString()}
                  </span>{" "}
                  times in top 5 lists. Together, these five agents give a clear
                  picture of which characters Zenless Zone Zero players like the
                  most and who tends to dominate the first-place slot.
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
                Total votes:{" "}
                <span className="ml-1 text-orange-100">
                  {characters.total_votes.toLocaleString()}
                </span>
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              Last updated: <span className="font-medium">5 minutes ago</span>{" "}
              (placeholder).
            </p>
          </footer>
        </main>
      </div>

      <LadderSelectionModal />
      <ModalRequestLogin />
    </>
  );
};

export default CharactersLadderPage;

export const Head: HeadFC = () => (
  <Seo
    title="Top 5 Characters – Zenless Zone Zero"
    description="See the global ranking of your favorite Zenless Zone Zero characters. This page currently uses fake data while we build the voting system."
    lang="en"
    langUrls={[{ lang: "en", url: "/ladder/", isDefault: true }]}
  />
);
