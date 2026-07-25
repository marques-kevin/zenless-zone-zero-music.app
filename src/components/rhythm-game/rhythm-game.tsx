import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  HitJudgment,
  RhythmChart,
  RhythmGameMode,
  RhythmNote,
  RhythmNoteLane,
} from "@/types/rhythm-chart.type";
import type { RhythmTrackConfig } from "@/constants/rhythm/tracks";
import { getCdnUrl } from "@/utils/get-cdn-url";
import {
  downloadChart,
  parseChartJson,
  sortNotes,
} from "@/lib/rhythm/chart-io";
import {
  clearChartDraft,
  loadChartDraft,
  saveChartDraft,
} from "@/lib/rhythm/chart-storage";
import {
  getFeverGain,
  getJudgment,
  getScoreForJudgment,
  isMissed,
} from "@/lib/rhythm/hit-detection";
import {
  beatToMs,
  formatRhythmTime,
  getNoteKey,
  GRID_SNAP,
  msToBeat,
  snapBeat,
} from "@/lib/rhythm/timing";
import { cn } from "@/lib/utils";
import {
  Download,
  Pause,
  Play,
  Trash2,
  Upload,
  Pencil,
  Gamepad2,
} from "lucide-react";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";

const HIT_ZONE_X = 120;
const PIXELS_PER_BEAT = 80;
const LANE_HEIGHT = 100;
const LOOKAHEAD_BEATS = 16;

const LANE_CYCLE: (RhythmNoteLane | null)[] = [
  null,
  "left",
  "right",
  "both",
];

type Props = {
  track: RhythmTrackConfig;
  initialChart: RhythmChart;
};

type GameState = "idle" | "playing" | "paused" | "finished";

export const RhythmGame: React.FC<Props> = ({ track, initialChart }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const judgedRef = useRef<Set<string>>(new Set());
  const heldNotesRef = useRef<Set<string>>(new Set());
  const keysRef = useRef({ f: false, j: false });

  const [mode, setMode] = useState<RhythmGameMode>("play");
  const [chart, setChart] = useState<RhythmChart>(() => {
    const draft = loadChartDraft(track.track_id);
    return draft ?? initialChart;
  });
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [fever, setFever] = useState(0);
  const [lastJudgment, setLastJudgment] = useState<HitJudgment | null>(null);
  const [judgedKeys, setJudgedKeys] = useState<Set<string>>(new Set());
  const [pixelsPerBeat, setPixelsPerBeat] = useState(PIXELS_PER_BEAT);
  const [editorViewBeat, setEditorViewBeat] = useState(0);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const dragStartRef = useRef({ x: 0, beat: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxBeat = useMemo(
    () => msToBeat(track.duration * 1000, chart.bpm),
    [track.duration, chart.bpm]
  );

  const currentBeat = useMemo(
    () => msToBeat(currentTime * 1000 + chart.offset, chart.bpm),
    [currentTime, chart.offset, chart.bpm]
  );

  const viewBeat = mode === "play" ? currentBeat : editorViewBeat;

  const sortedNotes = useMemo(() => sortNotes(chart.notes), [chart.notes]);

  const resetGameStats = useCallback(() => {
    judgedRef.current = new Set();
    heldNotesRef.current = new Set();
    setJudgedKeys(new Set());
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setFever(0);
    setLastJudgment(null);
  }, []);

  const resetPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setGameState("idle");
    resetGameStats();
  }, [resetGameStats]);

  const startGame = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    resetGameStats();
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().catch(() => {});
    setGameState("playing");
  }, [resetGameStats]);

  const togglePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (gameState === "playing") {
      audio.pause();
      setGameState("paused");
    } else if (gameState === "paused" || gameState === "idle") {
      if (gameState === "idle" && mode === "play") {
        startGame();
        return;
      }
      audio.play().catch(() => {});
      setGameState("playing");
    }
  }, [gameState, mode, startGame]);

  const toggleEditorPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      setGameState("playing");
    } else {
      audio.pause();
      setGameState("paused");
    }
  }, []);

  const processMisses = useCallback(
    (beat: number) => {
      if (mode !== "play" || gameState !== "playing") return;

      sortedNotes.forEach((note) => {
        const key = getNoteKey(note.beat, note.lane);
        if (judgedRef.current.has(key)) return;

        if (isMissed(beat, note.beat, chart.bpm)) {
          judgedRef.current.add(key);
          setJudgedKeys(new Set(judgedRef.current));
          setCombo(0);
          setFever((f) => Math.max(0, f + getFeverGain("miss")));
          setLastJudgment("miss");
        }
      });
    },
    [mode, gameState, sortedNotes, chart.bpm]
  );

  const registerHit = useCallback(
    (note: RhythmNote, judgment: HitJudgment) => {
      const key = getNoteKey(note.beat, note.lane);
      if (judgedRef.current.has(key)) return;

      judgedRef.current.add(key);
      setJudgedKeys(new Set(judgedRef.current));
      setLastJudgment(judgment);
      setScore((s) => s + getScoreForJudgment(judgment));
      setFever((f) => Math.min(100, Math.max(0, f + getFeverGain(judgment))));

      if (judgment === "miss") {
        setCombo(0);
      } else {
        setCombo((c) => {
          const next = c + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
      }
    },
    []
  );

  const tryHit = useCallback(
    (lane: "left" | "right") => {
      if (mode !== "play" || gameState !== "playing") return;

      const keys = keysRef.current;
      const bothPressed = keys.f && keys.j;

      sortedNotes.forEach((note) => {
        const key = getNoteKey(note.beat, note.lane);
        if (judgedRef.current.has(key)) return;

        const judgment = getJudgment(currentBeat, note.beat, chart.bpm);
        if (!judgment) return;

        if (note.lane === "both") {
          if (!bothPressed) return;
          if (note.duration) {
            heldNotesRef.current.add(key);
          }
          registerHit(note, judgment);
          return;
        }

        if (note.lane === lane) {
          registerHit(note, judgment);
        }
      });
    },
    [mode, gameState, sortedNotes, currentBeat, chart.bpm, registerHit]
  );

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = audio.currentTime;
    setCurrentTime(time);

    const beat = msToBeat(time * 1000 + chart.offset, chart.bpm);
    processMisses(beat);

    if (
      mode === "play" &&
      gameState === "playing" &&
      time >= track.duration - 0.5
    ) {
      audio.pause();
      setGameState("finished");
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [chart.offset, chart.bpm, processMisses, mode, gameState, track.duration]);

  useEffect(() => {
    if (gameState === "playing") {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, tick]);

  useEffect(() => {
    if (mode !== "edit") return;

    const timeout = setTimeout(() => {
      saveChartDraft(chart);
    }, 300);

    return () => clearTimeout(timeout);
  }, [chart, mode]);

  useEffect(() => {
    if (!isDraggingTimeline) return;

    const onMouseUp = () => setIsDraggingTimeline(false);
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [isDraggingTimeline]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "f") {
        keysRef.current.f = true;
        tryHit("left");
      }
      if (key === "j") {
        keysRef.current.j = true;
        tryHit("right");
      }
      if (key === " ") {
        e.preventDefault();
        if (mode === "play") togglePause();
        else toggleEditorPlayback();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "f") keysRef.current.f = false;
      if (key === "j") keysRef.current.j = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [tryHit, togglePause, toggleEditorPlayback, mode]);

  const handleLaneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "edit" || !laneRef.current || isDraggingTimeline || e.shiftKey)
      return;

    const rect = laneRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickBeat = snapBeat(
      viewBeat + (clickX - HIT_ZONE_X) / pixelsPerBeat
    );

    if (clickBeat < 0) return;

    if (e.button === 2) {
      setChart((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => Math.abs(n.beat - clickBeat) >= GRID_SNAP / 2),
      }));
      return;
    }

    setChart((prev) => {
      const existingIndex = prev.notes.findIndex(
        (n) => Math.abs(n.beat - clickBeat) < GRID_SNAP / 2
      );

      if (existingIndex === -1) {
        return {
          ...prev,
          notes: sortNotes([
            ...prev.notes,
            { beat: clickBeat, lane: "left" },
          ]),
        };
      }

      const existing = prev.notes[existingIndex];
      const cycleIndex = LANE_CYCLE.indexOf(existing.lane);
      const nextLane = LANE_CYCLE[(cycleIndex + 1) % LANE_CYCLE.length];

      if (nextLane === null) {
        return {
          ...prev,
          notes: prev.notes.filter((_, i) => i !== existingIndex),
        };
      }

      const updated: RhythmNote = {
        beat: clickBeat,
        lane: nextLane,
        ...(nextLane === "both" ? { duration: existing.duration ?? 1 } : {}),
      };

      const notes = [...prev.notes];
      notes[existingIndex] = updated;
      return { ...prev, notes: sortNotes(notes) };
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseChartJson(reader.result as string);
        setChart(parsed);
      } catch {
        // invalid file
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => downloadChart(chart);

  const handleClearDraft = () => {
    clearChartDraft(track.track_id);
    setChart(initialChart);
  };

  const switchMode = (nextMode: RhythmGameMode) => {
    resetPlayback();
    if (nextMode === "edit") {
      setEditorViewBeat(currentBeat);
    }
    setMode(nextMode);
  };

  const clampViewBeat = useCallback(
    (beat: number) => Math.max(0, Math.min(maxBeat, beat)),
    [maxBeat]
  );

  const scrollTimeline = useCallback(
    (beatDelta: number) => {
      setEditorViewBeat((prev) => clampViewBeat(prev + beatDelta));
    },
    [clampViewBeat]
  );

  const handleTimelineWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (mode !== "edit") return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    scrollTimeline(delta / pixelsPerBeat);
  };

  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "edit") return;
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsDraggingTimeline(true);
      dragStartRef.current = { x: e.clientX, beat: editorViewBeat };
    }
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingTimeline || mode !== "edit") return;
    const deltaX = dragStartRef.current.x - e.clientX;
    setEditorViewBeat(
      clampViewBeat(dragStartRef.current.beat + deltaX / pixelsPerBeat)
    );
  };

  const handleTimelineMouseUp = () => {
    setIsDraggingTimeline(false);
  };

  const seekToViewBeat = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Math.max(
      0,
      (beatToMs(editorViewBeat, chart.bpm) - chart.offset) / 1000
    );
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const visibleNotes = sortedNotes.filter(
    (n) =>
      n.beat >= viewBeat - 2 &&
      n.beat <= viewBeat + LOOKAHEAD_BEATS
  );

  const gradeProgress = Math.min(100, (score / 50000) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <audio ref={audioRef} src={getCdnUrl(track.source)} preload="auto" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-sky-100">{track.title}</h1>
          <p className="text-sm text-sky-300/70">
            {chart.bpm} BPM · {chart.notes.length} notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchMode("play")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              mode === "play"
                ? "bg-sky-500 text-white"
                : "bg-sky-900/60 text-sky-200 hover:bg-sky-800"
            )}
          >
            <Gamepad2 className="h-4 w-4" />
            <FormattedMessage id="rhythm/mode/play" />
          </button>
          <button
            onClick={() => switchMode("edit")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              mode === "edit"
                ? "bg-pink-500 text-white"
                : "bg-sky-900/60 text-sky-200 hover:bg-sky-800"
            )}
          >
            <Pencil className="h-4 w-4" />
            <FormattedMessage id="rhythm/mode/edit" />
          </button>
        </div>
      </div>

      {/* HUD */}
      <div className="mb-3 flex items-center gap-3 rounded-2xl bg-sky-950/80 px-4 py-2 border border-sky-700/40">
        <button
          onClick={mode === "play" ? togglePause : toggleEditorPlayback}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-500"
        >
          {gameState === "playing" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <div className="text-sm font-mono text-sky-200">
          {formatRhythmTime(currentTime)}
        </div>

        <div className="flex-1">
          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-300">
            Fever
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 transition-all duration-150"
              style={{ width: `${fever}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {score.toLocaleString()}
          </div>
          <div className="text-xs text-sky-300">
            {combo > 0 ? `${combo} COMBO` : "—"}
          </div>
        </div>

        <div className="hidden sm:block w-24">
          <div className="h-2 overflow-hidden rounded-full bg-sky-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-pink-400"
              style={{ width: `${gradeProgress}%` }}
            />
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] font-bold text-sky-400">
            <span>B</span>
            <span>A</span>
            <span>S</span>
          </div>
        </div>
      </div>

      {/* Console frame */}
      <div className="rounded-3xl border-4 border-sky-400/60 bg-gradient-to-b from-sky-300/20 to-sky-600/30 p-3 shadow-xl shadow-sky-900/50">
        {/* Top screen - gameplay lane */}
        <div
          className="relative mb-2 overflow-hidden rounded-2xl border-2 border-sky-300/40 bg-gradient-to-br from-sky-200/10 to-sky-500/20"
          onWheel={handleTimelineWheel}
        >
          {/* Grid lines */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: LOOKAHEAD_BEATS * 4 + 8 }).map((_, i) => {
              const beat = Math.floor(viewBeat) + i * GRID_SNAP - 2;
              const x = HIT_ZONE_X + (beat - viewBeat) * pixelsPerBeat;
              return (
                <div
                  key={i}
                  className={cn(
                    "absolute top-0 bottom-0 w-px",
                    beat % 1 === 0 ? "bg-sky-400/30" : "bg-sky-400/10"
                  )}
                  style={{ left: x }}
                />
              );
            })}
          </div>

          <div
            ref={laneRef}
            className={cn(
              "relative",
              mode === "edit"
                ? isDraggingTimeline
                  ? "cursor-grabbing"
                  : "cursor-crosshair"
                : ""
            )}
            style={{ height: LANE_HEIGHT }}
            onClick={handleLaneClick}
            onContextMenu={(e) => {
              e.preventDefault();
              handleLaneClick(e);
            }}
            onMouseDown={handleTimelineMouseDown}
            onMouseMove={handleTimelineMouseMove}
            onMouseUp={handleTimelineMouseUp}
          >
            {/* Hit zone */}
            <div
              className="absolute top-2 bottom-2 z-10 rounded-lg border-2 border-white/60 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              style={{ left: HIT_ZONE_X - 30, width: 60 }}
            />

            {/* Character portrait */}
            <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2">
              <img
                src={track.playlist_cover}
                alt=""
                className="h-14 w-14 rounded-full border-2 border-pink-300 object-cover"
              />
            </div>

            {/* Playhead in edit mode */}
            {mode === "edit" && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                style={{
                  left:
                    HIT_ZONE_X +
                    (currentBeat - viewBeat) * pixelsPerBeat,
                }}
              />
            )}

            {/* Notes */}
            {visibleNotes.map((note) => {
              const x =
                HIT_ZONE_X + (note.beat - viewBeat) * pixelsPerBeat - 20;
              const key = getNoteKey(note.beat, note.lane);
              const judged = judgedKeys.has(key);
              const width =
                note.lane === "both" && note.duration
                  ? note.duration * pixelsPerBeat
                  : 40;

              return (
                <div
                  key={key}
                  className={cn(
                    "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-lg border-2 font-bold text-white shadow-lg transition-opacity",
                    note.lane === "left" &&
                      "h-10 w-10 border-cyan-300 bg-cyan-500",
                    note.lane === "right" &&
                      "h-10 w-10 border-pink-300 bg-pink-500",
                    note.lane === "both" &&
                      "h-12 border-green-300 bg-green-500",
                    judged && mode === "play" && "opacity-30"
                  )}
                  style={{
                    left: x,
                    width: note.lane === "both" ? width : 40,
                  }}
                >
                  {note.lane === "left" && "←"}
                  {note.lane === "right" && "→"}
                  {note.lane === "both" && "↔"}
                </div>
              );
            })}

            {/* Key hints */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-16 text-[10px] font-bold text-white/50">
              <span>F</span>
              <span>J</span>
            </div>
          </div>

          {/* Judgment flash */}
          {lastJudgment && mode === "play" && (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-black uppercase",
                lastJudgment === "perfect" && "text-yellow-300",
                lastJudgment === "good" && "text-green-300",
                lastJudgment === "miss" && "text-red-400"
              )}
            >
              {lastJudgment}
            </div>
          )}
        </div>

        {mode === "edit" && (
          <div className="mb-2 rounded-xl border border-sky-700/40 bg-sky-950/60 px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-[11px] text-sky-300">
              <span>
                <FormattedMessage id="rhythm/editor/timeline-position" />{" "}
                {formatRhythmTime(
                  Math.max(
                    0,
                    (beatToMs(editorViewBeat, chart.bpm) - chart.offset) / 1000
                  )
                )}
              </span>
              <button
                onClick={seekToViewBeat}
                className="rounded px-2 py-0.5 text-sky-200 hover:bg-sky-800/60"
              >
                <FormattedMessage id="rhythm/editor/seek-to-view" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={maxBeat}
              step={GRID_SNAP}
              value={editorViewBeat}
              onChange={(e) =>
                setEditorViewBeat(clampViewBeat(Number(e.target.value)))
              }
              className="w-full accent-sky-400"
            />
          </div>
        )}

        {/* Bottom screen - decorative */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-sky-300/40 bg-gradient-to-b from-sky-400/30 to-sky-600/40"
          style={{ height: 140 }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute left-4 top-3">
            <span className="text-2xl font-black italic text-white drop-shadow-lg">
              {combo > 0 ? `${combo} COMBO` : "0 COMBO"}
            </span>
          </div>
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-2 pb-2">
            <img
              src={track.playlist_cover}
              alt=""
              className="h-20 w-16 object-cover object-top drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Editor toolbar */}
      {mode === "edit" && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-zinc-900/80 p-3 border border-zinc-700">
          <button
            onClick={toggleEditorPlayback}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            {gameState === "playing" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <FormattedMessage id="rhythm/editor/play-audio" />
          </button>

          <button
            onClick={() =>
              setPixelsPerBeat((p) => Math.min(160, p + 20))
            }
            className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            <FormattedMessage id="rhythm/editor/zoom-in" />
          </button>
          <button
            onClick={() =>
              setPixelsPerBeat((p) => Math.max(40, p - 20))
            }
            className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            <FormattedMessage id="rhythm/editor/zoom-out" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            <Upload className="h-4 w-4" />
            <FormattedMessage id="rhythm/editor/import" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600"
          >
            <Download className="h-4 w-4" />
            <FormattedMessage id="rhythm/editor/export" />
          </button>

          <button
            onClick={handleClearDraft}
            className="flex items-center gap-1.5 rounded-lg bg-red-900/60 px-3 py-1.5 text-sm text-red-200 hover:bg-red-800/60"
          >
            <Trash2 className="h-4 w-4" />
            <FormattedMessage id="rhythm/editor/clear-draft" />
          </button>

          <p className="w-full text-xs text-zinc-400">
            <FormattedMessage id="rhythm/editor/hint" />
          </p>
        </div>
      )}

      {/* Play mode overlays */}
      {mode === "play" && gameState === "idle" && (
        <div className="mt-4 text-center">
          <button
            onClick={startGame}
            className="rounded-full bg-sky-500 px-8 py-3 text-lg font-bold text-white hover:bg-sky-400 shadow-lg shadow-sky-500/30"
          >
            <FormattedMessage id="rhythm/play/start" />
          </button>
          <p className="mt-2 text-sm text-sky-300/70">
            <FormattedMessage id="rhythm/play/controls" />
          </p>
        </div>
      )}

      {mode === "play" && gameState === "finished" && (
        <div className="mt-4 rounded-xl bg-sky-950/80 border border-sky-700/40 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            <FormattedMessage id="rhythm/play/finished" />
          </h2>
          <p className="mt-2 text-sky-200">
            <FormattedMessage
              id="rhythm/play/results"
              values={{
                score: score.toLocaleString(),
                combo: maxCombo,
              }}
            />
          </p>
          <button
            onClick={startGame}
            className="mt-4 rounded-full bg-sky-500 px-6 py-2 font-bold text-white hover:bg-sky-400"
          >
            <FormattedMessage id="rhythm/play/retry" />
          </button>
        </div>
      )}
    </div>
  );
};
