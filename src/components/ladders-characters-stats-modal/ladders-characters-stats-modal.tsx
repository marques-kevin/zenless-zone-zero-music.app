import React from "react";
import { Modal } from "@/components/ui/modal";
import { Ladder } from "@/types/ladders.type";
import { characters } from "@/database/characters";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";

const get_bg_color_by_rank = (rank: number) => {
  if (rank === 1) return "bg-amber-400 text-zinc-950";
  if (rank === 2) return "bg-violet-400 text-zinc-950";
  if (rank === 3) return "bg-orange-400 text-zinc-950";
  if (rank === 4) return "bg-fuchsia-400 text-zinc-950";
  if (rank === 5) return "bg-emerald-400 text-zinc-950";
  return "bg-zinc-950";
};

export const LaddersCharactersStatsModal: React.FC<{
  data: Ladder["characters"][string] | null;
  character: (typeof characters)[number] | null;
  onClose: () => void;
}> = (props) => {
  const character = props.character ?? {
    name: "",
    image: "",
  };
  const data = props.data ?? {
    id: "",
    total_votes: 0,
    popularity: 0,
    rank: 0,
    points: 0,
    total_votes_1: 0,
    total_votes_2: 0,
    total_votes_3: 0,
    total_votes_4: 0,
    total_votes_5: 0,
  };
  const is_open = props.data !== null && props.character !== null;

  const positions = [
    {
      labelId: "ladder/characters/stats/position-top1",
      value: data.total_votes_1,
    },
    {
      labelId: "ladder/characters/stats/position-top2",
      value: data.total_votes_2,
    },
    {
      labelId: "ladder/characters/stats/position-top3",
      value: data.total_votes_3,
    },
    {
      labelId: "ladder/characters/stats/position-top4",
      value: data.total_votes_4,
    },
    {
      labelId: "ladder/characters/stats/position-top5",
      value: data.total_votes_5,
    },
  ] as const;

  return (
    <Modal isOpen={is_open} onClose={props.onClose}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `url(/characters/characters-background.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-zinc-50">
                  {character.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-full  px-2 py-0.5 text-[11px] font-semibold ${get_bg_color_by_rank(
                    data.rank
                  )}`}
                >
                  #{data.rank}
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                {character.name}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-zinc-300">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              <FormattedMessage id="ladder/characters/stats/total-votes-label" />
            </p>
            <p className="text-base font-semibold text-zinc-50">
              {data.total_votes.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              <FormattedMessage id="ladder/characters/stats/popularity-label" />
            </p>
            <p className="text-base font-semibold text-zinc-50">
              {data.popularity.toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              <FormattedMessage id="ladder/characters/stats/points-label" />
            </p>
            <p className="text-base font-semibold text-zinc-50">
              {data.points.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">
            <FormattedMessage id="ladder/characters/stats/positions-label" />
          </p>
          <div className="space-y-1.5">
            {positions.map((position) => {
              // Calculate ratio relative to the maximum value among all positions
              const maxPositionVotes = Math.max(
                data.total_votes_1,
                data.total_votes_2,
                data.total_votes_3,
                data.total_votes_4,
                data.total_votes_5
              );
              const ratio = Math.min(
                1,
                position.value / Math.max(1, maxPositionVotes)
              );

              return (
                <div
                  key={position.labelId}
                  className="flex items-center gap-2 text-[11px]"
                >
                  <span className="w-16 text-zinc-400">
                    <FormattedMessage
                      id={
                        position.labelId as
                          | "ladder/characters/stats/position-top1"
                          | "ladder/characters/stats/position-top2"
                          | "ladder/characters/stats/position-top3"
                          | "ladder/characters/stats/position-top4"
                          | "ladder/characters/stats/position-top5"
                      }
                    />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-zinc-200">
                    {position.value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
