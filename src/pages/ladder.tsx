import * as React from "react";
import type { HeadFC } from "gatsby";
import { Navbar } from "@/components/navbar/navbar";
import { Seo } from "@/components/seo/seo";
import { Card, CardContent } from "@/components/ui/card";
import { characters } from "@/database/characters";

type RankingEntry = {
  rank: number;
  name: string;
  displayName: string;
  points: number;
  top5Share: number;
  barColor: string;
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
    barColor: "from-amber-400 to-yellow-500",
  },
  {
    rank: 2,
    name: "zhu-yuan",
    displayName: "Zhu Yuan",
    points: 2130,
    top5Share: 64,
    barColor: "from-violet-400 to-purple-500",
  },
  {
    rank: 3,
    name: "anby",
    displayName: "Anby",
    points: 1890,
    top5Share: 58,
    barColor: "from-orange-400 to-amber-500",
  },
  {
    rank: 4,
    name: "nicole",
    displayName: "Nicole",
    points: 1560,
    top5Share: 46,
    barColor: "from-fuchsia-400 to-pink-500",
  },
  {
    rank: 5,
    name: "lycaon",
    displayName: "Lycaon",
    points: 1220,
    top5Share: 37,
    barColor: "from-emerald-400 to-green-500",
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
        barColor: "from-zinc-600 to-zinc-400",
      };
    });

  return [...base, ...others];
})();

const TOTAL_VOTES = 8420;

const podium = [
  { label: "1st", share: 45 },
  { label: "2nd", share: 30 },
  { label: "3rd", share: 25 },
];

const CharactersLadderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-50">
      {/* Fake git version is fine here, this page is static */}
      <Navbar git_version={"dev"} />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 md:px-6 lg:pt-10">
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

        {/* Top 5 ladder */}
        <section
          aria-label="Top 5 characters ranking"
          className="grid gap-4 md:grid-cols-5"
        >
          {RANKING.map((entry) => {
            const character = characters.find((c) => c.name === entry.name);

            return (
              <div
                key={entry.rank}
                className="relative flex flex-col rounded-xl bg-gradient-to-b from-zinc-700/60 via-zinc-900 to-zinc-950 p-[2px] shadow-lg shadow-black/40"
              >
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br opacity-75 ${entry.barColor}`}
                />

                <Card className="flex h-full flex-col border-none bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-black/90">
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-300">
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
                        <span className="ml-1 text-[10px]">
                          {entry.rank === 1
                            ? "st"
                            : entry.rank === 2
                            ? "nd"
                            : entry.rank === 3
                            ? "rd"
                            : "th"}
                        </span>
                      </span>

                      <span className="text-[11px] text-zinc-400">
                        {entry.points.toLocaleString()} pts
                      </span>
                    </div>

                    <div className="mt-4 flex flex-1 flex-col items-center gap-3">
                      <div className="relative h-28 w-24 overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-900/70 shadow-md shadow-black/60">
                        {character ? (
                          <img
                            src={character.image}
                            alt={entry.displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <span className="text-sm font-semibold uppercase tracking-wide text-zinc-50">
                          {entry.displayName}
                        </span>
                        <span className="mt-1 text-[11px] text-zinc-400">
                          {entry.top5Share}% of all Top 5 lists
                        </span>
                      </div>

                      <div className="mt-2 flex w-full flex-col gap-1.5 text-[11px] text-zinc-400">
                        <div className="flex items-center justify-between">
                          <span>Popularity</span>
                          <span className="font-semibold text-zinc-100">
                            {entry.top5Share}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${entry.barColor}`}
                            style={{ width: `${entry.top5Share}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </section>

        {/* Full ladder */}
        <section className="space-y-3">
          <Card className="border border-zinc-700/80 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
            <CardContent className="p-0">
              <div className="max-h-[480px] overflow-y-auto">
                <table className="min-w-full text-xs md:text-sm">
                  <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur">
                    <tr className="text-[11px] uppercase tracking-wide text-zinc-500">
                      <th className="px-4 py-2 text-left font-medium">Rank</th>
                      <th className="px-2 py-2 text-left font-medium">
                        Character
                      </th>
                      <th className="px-2 py-2 text-right font-medium">
                        Points
                      </th>
                      <th className="px-4 py-2 text-right font-medium">
                        % Top 5
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FULL_RANKING.slice(5).map((entry) => {
                      const character = characters.find(
                        (c) => c.name === entry.name
                      );

                      return (
                        <tr
                          key={entry.rank}
                          className={`border-t border-zinc-800/80 text-xs md:text-sm ${
                            entry.rank <= 5
                              ? "bg-zinc-900/60"
                              : "hover:bg-zinc-900/50"
                          }`}
                        >
                          <td className="px-4 py-2 align-middle">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                entry.rank === 1
                                  ? "bg-amber-400 text-zinc-950"
                                  : entry.rank === 2
                                  ? "bg-violet-400 text-zinc-950"
                                  : entry.rank === 3
                                  ? "bg-orange-400 text-zinc-950"
                                  : entry.rank === 4
                                  ? "bg-fuchsia-400 text-zinc-950"
                                  : entry.rank === 5
                                  ? "bg-emerald-400 text-zinc-950"
                                  : "bg-zinc-800 text-zinc-200"
                              }`}
                            >
                              {entry.rank}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
                                {character ? (
                                  <img
                                    src={character.image}
                                    alt={entry.displayName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">
                                    N/A
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-zinc-100">
                                  {entry.displayName}
                                </span>
                                <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                                  {entry.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right text-xs text-zinc-200">
                            {entry.points.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[11px] text-zinc-100">
                                {entry.top5Share}%
                              </span>
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${
                                    entry.rank <= 5
                                      ? entry.barColor
                                      : "from-zinc-600 to-zinc-400"
                                  }`}
                                  style={{ width: `${entry.top5Share}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

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
    langUrls={[{ lang: "en", url: "/characters-ladder/", isDefault: true }]}
  />
);
