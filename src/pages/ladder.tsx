import * as React from "react";
import type { HeadFC } from "gatsby";
import { Navbar } from "@/components/navbar/navbar";
import { Seo } from "@/components/seo/seo";
import { characters } from "@/database/characters";
import clsx from "clsx";

type RankingEntry = {
  rank: number;
  name: string;
  displayName: string;
  points: number;
  top5Share: number;
};

const toDisplayName = (rawName: string) =>
  rawName
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const RANKING: RankingEntry[] = [
  {
    rank: 1,
    name: "ellen",
    displayName: "Ellen Joe",
    points: 2540,
    top5Share: 78,
  },
  {
    rank: 2,
    name: "zhu-yuan",
    displayName: "Zhu Yuan",
    points: 2130,
    top5Share: 64,
  },
  {
    rank: 3,
    name: "anby",
    displayName: "Anby",
    points: 1890,
    top5Share: 58,
  },
  {
    rank: 4,
    name: "nicole",
    displayName: "Nicole",
    points: 1560,
    top5Share: 46,
  },
  {
    rank: 5,
    name: "lycaon",
    displayName: "Lycaon",
    points: 1220,
    top5Share: 37,
  },
];

const FULL_RANKING: RankingEntry[] = (() => {
  const base = [...RANKING];
  const usedNames = new Set(base.map((entry) => entry.name));

  const others: RankingEntry[] = characters
    .filter((c) => !usedNames.has(c.name))
    .map((character, index) => {
      const rank = base.length + index + 1;
      const popularity = Math.max(2, 30 - index); // fake decreasing percentage
      const points = Math.max(120, 1000 - index * 15); // fake points

      return {
        rank,
        name: character.name,
        displayName: toDisplayName(character.name),
        points,
        top5Share: popularity,
      };
    });

  return [...base, ...others];
})();

const TOTAL_VOTES = 8420;

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
}: {
  entry: RankingEntry;
  character: (typeof characters)[number];
}) => {
  return (
    <div
      key={entry.rank}
      className={clsx("rounded overflow-hidden border-zinc-800")}
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
                <img
                  src={character?.image}
                  alt={entry.displayName}
                  className="w-full :t-"
                />
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-zinc-50">
                {entry.displayName}
              </span>
            </div>

            <div className="pb-4 flex w-full flex-col gap-1.5 px-4 text-[11px] text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Popularity</span>
                <span className="font-semibold text-zinc-100">
                  {entry.top5Share}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${get_bg_color_by_rank(
                    entry.rank
                  )}`}
                  style={{ width: `${entry.top5Share}%` }}
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
  entry: RankingEntry;
  character: (typeof characters)[number];
}) => {
  return (
    <div className="flex items-center rounded h-14 overflow-hidden bg-zinc-900 text-[10px] hover:bg-zinc-900/70">
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
              alt={props.entry.displayName}
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
            {props.entry.displayName}
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
              style={{ width: `${props.entry.top5Share}%` }}
            />
          </div>
          <span className="text-[9px] text-zinc-500">
            {props.entry.top5Share}%
          </span>
        </div>
      </div>
    </div>
  );
};

const CharactersLadderPage: React.FC = () => {
  return (
    <div className="text-zinc-50">
      {/* Fake git version is fine here, this page is static */}
      <Navbar git_version={"dev"} />

      <main className="mx-auto space-y-4 max-w-6xl">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
            Results
          </p>
          <h1 className="text-2xl font-semibold uppercase tracking-wide text-zinc-50 md:text-3xl">
            Top 5 Characters – Zenless Zone Zero
          </h1>
          <p className="max-w-3xl text-sm text-zinc-400 md:text-base">
            Global ranking of your favorite agents. This page uses{" "}
            <span className="font-semibold text-zinc-200">fake data</span> for
            now so we can iterate on the layout.
          </p>
        </header>

        <div className="space-y-4">
          {/* Top 5 ladder */}
          <section className="grid gap-4 grid-cols-2 md:grid-cols-5">
            {RANKING.map((entry) => {
              const character = characters.find((c) => c.name === entry.name);

              return (
                <Item key={entry.rank} entry={entry} character={character!} />
              );
            })}
          </section>

          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {FULL_RANKING.slice(5).map((entry) => {
              const character = characters.find((c) => c.name === entry.name);

              return (
                <SmallItem
                  key={entry.rank}
                  entry={entry}
                  character={character!}
                />
              );
            })}
          </div>
        </div>

        <footer className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-zinc-800 pt-4 text-xs text-zinc-400 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-1 font-semibold text-orange-300">
              Total votes:{" "}
              <span className="ml-1 text-orange-100">
                {TOTAL_VOTES.toLocaleString()}
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
