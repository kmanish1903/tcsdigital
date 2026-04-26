// Updated CurriculumTracker that calls a per-video save callback
import { useMemo, useState } from "react";
import { ChevronDown, CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import {
  CURRICULUM, CurriculumProgress, Topic,
  topicCompleted, topicPct,
} from "@/lib/curriculum";

interface Props {
  progress: CurriculumProgress;
  onSetVideo: (videoId: string, percent: number) => void;
  onVideoComplete?: (videoId: string) => void;
}

function pctTone(p: number) {
  if (p >= 100) return "text-success";
  if (p >= 60) return "text-primary";
  if (p >= 25) return "text-warning";
  if (p > 0) return "text-muted-foreground";
  return "text-muted-foreground/60";
}

function barTone(p: number) {
  if (p >= 100) return "bg-success";
  if (p >= 60) return "bg-primary";
  if (p >= 25) return "bg-warning";
  return "bg-destructive";
}

function TopicBlock({
  topic, progress, onSetVideo, onVideoComplete,
}: { topic: Topic } & Props) {
  const [open, setOpen] = useState(topic.id === "7.1.1");
  const pct = topicPct(topic, progress);
  const done = topicCompleted(topic, progress);

  const setVid = (id: string, val: number) => {
    const prev = progress[id] ?? 0;
    onSetVideo(id, val);
    if (val >= 100 && prev < 100) onVideoComplete?.(id);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-muted/40"
      >
        <span className="font-mono text-xs text-muted-foreground">{topic.id}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {topic.title}
            </h3>
            <span className={`shrink-0 text-xs font-semibold tabular-nums ${pctTone(pct)}`}>
              {done}/{topic.videos.length} • {pct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barTone(pct)}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="divide-y divide-border border-t border-border bg-background/40">
          {topic.videos.map((v) => {
            const p = progress[v.id] ?? 0;
            const complete = p >= 100;
            return (
              <li key={v.id} className="grid grid-cols-[20px_1fr_auto] items-center gap-3 px-5 py-3 sm:grid-cols-[20px_1fr_180px_56px]">
                <button
                  onClick={() => setVid(v.id, complete ? 0 : 100)}
                  className="text-foreground/80 transition hover:scale-110"
                  aria-label={complete ? "Mark incomplete" : "Mark complete"}
                >
                  {complete ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : p > 0 ? (
                    <PlayCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-medium ${complete ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    <span className="mr-2 font-mono text-[10px] text-muted-foreground">{v.id}</span>
                    {v.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {v.duration}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${barTone(p)}`}
                      style={{ width: `${p}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={p}
                      onChange={(e) => setVid(v.id, parseInt(e.target.value))}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label={`${v.title} progress`}
                    />
                  </div>
                </div>
                <span className={`text-right text-xs font-semibold tabular-nums ${pctTone(p)}`}>
                  {p}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function CurriculumTracker({ progress, onSetVideo, onVideoComplete }: Props) {
  const overall = useMemo(() => {
    const all = CURRICULUM.flatMap((t) => t.videos);
    return Math.round(all.reduce((a, v) => a + (progress[v.id] ?? 0), 0) / all.length);
  }, [progress]);
  const completed = useMemo(
    () => CURRICULUM.flatMap((t) => t.videos).filter((v) => (progress[v.id] ?? 0) >= 100).length,
    [progress],
  );
  const total = CURRICULUM.flatMap((t) => t.videos).length;

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">DSA Curriculum — Python</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {completed}/{total} videos completed • Drag the bars or click the icon to mark
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold text-primary tabular-nums">{overall}%</div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">overall</p>
        </div>
      </div>
      <div className="space-y-3">
        {CURRICULUM.map((t) => (
          <TopicBlock
            key={t.id}
            topic={t}
            progress={progress}
            onSetVideo={onSetVideo}
            onVideoComplete={onVideoComplete}
          />
        ))}
      </div>
    </div>
  );
}
