import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, ArrowRight } from "lucide-react";
import { pickRandomTopic } from "@/lib/topics";

interface Props {
  onTopicComplete?: () => void;
  topicsToday: number;
  goal?: number;
}

const DURATION = 60;

export function SpeakingCard({ onTopicComplete, topicsToday, goal = 6 }: Props) {
  const [topic, setTopic] = useState(() => pickRandomTopic());
  const [seconds, setSeconds] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          if (!completedRef.current) {
            completedRef.current = true;
            onTopicComplete?.();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onTopicComplete]);

  const next = () => {
    setTopic((t) => pickRandomTopic(t));
    setSeconds(DURATION);
    setRunning(false);
    completedRef.current = false;
  };
  const reset = () => {
    setSeconds(DURATION);
    setRunning(false);
    completedRef.current = false;
  };

  const pct = ((DURATION - seconds) / DURATION) * 100;
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="surface-card flex h-full flex-col p-6 lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">1-Min Speaking</h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {topicsToday} / {goal}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/70 bg-background/40 p-6 text-center">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Today's Topic
        </div>
        <p className="font-display text-xl font-bold leading-snug text-foreground sm:text-2xl">
          "{topic}"
        </p>

        <div className="relative my-6 h-44 w-44">
          <svg className="ring-progress absolute inset-0" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-500 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-primary tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : seconds === DURATION ? "Start" : "Resume"}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
            aria-label="Restart timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/60"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
