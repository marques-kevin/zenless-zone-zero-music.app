import React from "react";
import { cn } from "@/lib/utils";
import { GRID_SNAP } from "@/lib/rhythm/timing";

const BEATS_PER_MEASURE = 4;
const HIT_ZONE_X = 120;

type GridLineKind = "measure" | "beat" | "half" | "sub";

const snapToGrid = (beat: number) => Math.round(beat / GRID_SNAP) * GRID_SNAP;

const getGridLineKind = (beat: number): GridLineKind => {
  const b = snapToGrid(beat);
  const measurePos = ((b % BEATS_PER_MEASURE) + BEATS_PER_MEASURE) % BEATS_PER_MEASURE;

  if (measurePos < 0.001) return "measure";
  if (measurePos % 1 < 0.001) return "beat";
  if (measurePos % 0.5 < 0.001) return "half";
  return "sub";
};

const getBeatInMeasure = (beat: number) => {
  const b = Math.round(snapToGrid(beat));
  return (b % BEATS_PER_MEASURE) + 1;
};

const getMeasureNumber = (beat: number) =>
  Math.floor(snapToGrid(beat) / BEATS_PER_MEASURE) + 1;

type Props = {
  viewBeat: number;
  pixelsPerBeat: number;
  lookaheadBeats: number;
  showLabels?: boolean;
};

export const RhythmEditorGrid: React.FC<Props> = ({
  viewBeat,
  pixelsPerBeat,
  lookaheadBeats,
  showLabels = true,
}) => {
  const startBeat = Math.floor(viewBeat) - 2;
  const endBeat = viewBeat + lookaheadBeats;

  const gridBeats: number[] = [];
  const firstLine = Math.floor(startBeat / GRID_SNAP) * GRID_SNAP;
  for (let beat = firstLine; beat <= endBeat; beat += GRID_SNAP) {
    gridBeats.push(Number(beat.toFixed(2)));
  }

  const measureStarts: number[] = [];
  const firstMeasure =
    Math.floor(startBeat / BEATS_PER_MEASURE) * BEATS_PER_MEASURE;
  for (let beat = firstMeasure; beat <= endBeat; beat += BEATS_PER_MEASURE) {
    measureStarts.push(beat);
  }

  const beatAtHitZone = snapToGrid(viewBeat);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Measure background stripes */}
      {measureStarts.map((measureStart) => {
        const measureIndex = getMeasureNumber(measureStart) - 1;
        const x = HIT_ZONE_X + (measureStart - viewBeat) * pixelsPerBeat;
        const width = BEATS_PER_MEASURE * pixelsPerBeat;

        return (
          <div
            key={`measure-bg-${measureStart}`}
            className={cn(
              "absolute top-0 bottom-0",
              measureIndex % 2 === 0 ? "bg-sky-400/8" : "bg-sky-900/15"
            )}
            style={{ left: x, width }}
          />
        );
      })}

      {/* Grid lines */}
      {gridBeats.map((beat) => {
        const kind = getGridLineKind(beat);
        const x = HIT_ZONE_X + (beat - viewBeat) * pixelsPerBeat;

        if (x < -20 || x > 2000) return null;

        return (
          <React.Fragment key={`line-${beat}`}>
            <div
              className={cn(
                "absolute top-0 bottom-0",
                kind === "measure" && "w-[3px] -translate-x-px bg-pink-300/90",
                kind === "beat" && "w-[2px] -translate-x-px bg-sky-100/80",
                kind === "half" && "w-px bg-sky-200/35",
                kind === "sub" && "w-px bg-sky-300/15"
              )}
              style={{ left: x }}
            />
            {showLabels && kind === "measure" && (
              <div
                className="absolute top-1 text-[10px] font-bold text-pink-200 drop-shadow"
                style={{ left: x + 4 }}
              >
                {getMeasureNumber(beat)}
              </div>
            )}
            {showLabels && kind === "beat" && (
              <div
                className="absolute bottom-1 text-[9px] font-semibold text-sky-100/70"
                style={{ left: x + 3 }}
              >
                {getBeatInMeasure(beat)}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Hit-zone reference: beat attack at placement point */}
      <div
        className="absolute top-0 bottom-0 z-[5] w-[2px] -translate-x-px bg-yellow-300/90 shadow-[0_0_12px_rgba(253,224,71,0.6)]"
        style={{ left: HIT_ZONE_X }}
      />
      {showLabels && (
        <div
          className="absolute top-1 z-[6] -translate-x-1/2 rounded bg-yellow-400/90 px-1.5 py-0.5 text-[10px] font-bold text-yellow-950"
          style={{ left: HIT_ZONE_X }}
        >
          {beatAtHitZone.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export { HIT_ZONE_X, snapToGrid };
