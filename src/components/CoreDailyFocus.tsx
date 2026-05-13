import { useEffect, useState } from "react";
import { Check, Clock, Target } from "lucide-react";
import { todayISO } from "@/lib/dailyLog";

type Block = {
  id: string;
  time: string;
  label: string;
  sub: string;
  emoji: string;
  targetMin: number;
  accent: string; // hex
  gradient: string;
  glow: string;
};

const BLOCKS: Block[] = [
  {
    id: "wakeup",
    time: "5:00 — 6:00 AM",
    label: "Wakeup + Sadhana",
    sub: "Naam Jap 108 · Hanuman Chalisa 3 · Meditation",
    emoji: "🕉️",
    targetMin: 60,
    accent: "#FBBF24",
    gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
    glow: "0 10px 30px rgba(251,191,36,0.20)",
  },
  {
    id: "dsa-am",
    time: "6:00 — 9:00 AM",
    label: "DSA",
    sub: "Data Structures & Algorithms — Python",
    emoji: "🧠",
    targetMin: 180,
    accent: "#8B5CF6",
    gradient: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
    glow: "0 10px 30px rgba(139,92,246,0.25)",
  },
  {
    id: "break",
    time: "9:00 — 10:00 AM",
    label: "Break",
    sub: "Breakfast · Walk · Reset",
    emoji: "☕",
    targetMin: 60,
    accent: "#94A3B8",
    gradient: "linear-gradient(135deg, #475569, #64748B)",
    glow: "0 10px 30px rgba(100,116,139,0.18)",
  },
  {
    id: "react",
    time: "10:00 AM — 1:00 PM",
    label: "React / Full Stack",
    sub: "Frontend + Backend Development",
    emoji: "⚛️",
    targetMin: 180,
    accent: "#3B82F6",
    gradient: "linear-gradient(135deg, #2563EB, #3B82F6)",
    glow: "0 10px 30px rgba(59,130,246,0.25)",
  },
  {
    id: "lunch",
    time: "1:00 — 2:00 PM",
    label: "Lunch",
    sub: "Eat · Rest · Recharge",
    emoji: "🍱",
    targetMin: 60,
    accent: "#94A3B8",
    gradient: "linear-gradient(135deg, #475569, #64748B)",
    glow: "0 10px 30px rgba(100,116,139,0.18)",
  },
  {
    id: "speak-record",
    time: "2:00 — 4:00 PM",
    label: "Mirror Speaking + Content Recording",
    sub: "JAM · Self video recording · Learning content",
    emoji: "🎥",
    targetMin: 120,
    accent: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899, #F472B6)",
    glow: "0 10px 30px rgba(236,72,153,0.25)",
  },
  {
    id: "edit",
    time: "4:00 — 6:00 PM",
    label: "Video Editing",
    sub: "Edit today's recording · 1–2 hours",
    emoji: "🎬",
    targetMin: 90,
    accent: "#DB2777",
    gradient: "linear-gradient(135deg, #DB2777, #EC4899)",
    glow: "0 10px 30px rgba(219,39,119,0.22)",
  },
  {
    id: "dsa-revision",
    time: "6:00 — 8:00 PM",
    label: "DSA / Revision",
    sub: "Extra DSA or React revision · 1–2 hours",
    emoji: "🔁",
    targetMin: 90,
    accent: "#6366F1",
    gradient: "linear-gradient(135deg, #4F46E5, #6366F1)",
    glow: "0 10px 30px rgba(99,102,241,0.25)",
  },
  {
    id: "fitness",
    time: "8:00 — 9:30 PM",
    label: "Fitness",
    sub: "Gym · Pushups · Pullups · Run",
    emoji: "🏋️",
    targetMin: 90,
    accent: "#22C55E",
    gradient: "linear-gradient(135deg, #16A34A, #22C55E)",
    glow: "0 10px 30px rgba(34,197,94,0.25)",
  },
];

type State = Record<string, { done: boolean; actualMin: number }>;

function loadState(date: string): State {
  try {
    const raw = localStorage.getItem(`preptrack_focus_${date}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveState(date: string, s: State) {
  localStorage.setItem(`preptrack_focus_${date}`, JSON.stringify(s));
}

export function CoreDailyFocus() {
  const date = todayISO();
  const [state, setState] = useState<State>(() => loadState(date));

  useEffect(() => {
    saveState(date, state);
  }, [date, state]);

  const totalTarget = BLOCKS.reduce((a, b) => a + b.targetMin, 0);
  const totalActual = BLOCKS.reduce(
    (a, b) => a + (state[b.id]?.actualMin || 0),
    0,
  );
  const doneCount = BLOCKS.filter((b) => state[b.id]?.done).length;
  const pct = Math.min(100, Math.round((totalActual / totalTarget) * 100));

  const update = (id: string, patch: Partial<{ done: boolean; actualMin: number }>) => {
    setState((s) => ({
      ...s,
      [id]: { done: false, actualMin: 0, ...s[id], ...patch },
    }));
  };

  return (
    <div
      className="surface-card overflow-hidden p-6 lg:p-7"
      style={{ background: "linear-gradient(135deg, hsl(226 47% 9%), hsl(222 38% 13%))" }}
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
            style={{ background: "rgba(99,102,241,0.15)", boxShadow: "0 0 24px rgba(99,102,241,0.25) inset" }}
          >
            🎯
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">CORE DAILY FOCUS</h2>
            <p className="text-xs text-muted-foreground">Skill-wise daily time allocation · 5 AM → 9:30 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">{doneCount}</span>/{BLOCKS.length} blocks
          </div>
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">{Math.floor(totalActual / 60)}h {totalActual % 60}m</span>
            {" "}/ {Math.floor(totalTarget / 60)}h {totalTarget % 60}m
          </div>
          <div
            className="rounded-full px-3 py-1 font-semibold"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "#818CF8",
            }}
          >
            {pct}%
          </div>
        </div>
      </div>

      {/* Blocks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOCKS.map((b) => {
          const s = state[b.id] || { done: false, actualMin: 0 };
          const blockPct = Math.min(100, Math.round((s.actualMin / b.targetMin) * 100));
          return (
            <div
              key={b.id}
              className="group relative overflow-hidden rounded-2xl border p-4 transition-all"
              style={{
                borderColor: s.done ? b.accent : "hsl(var(--border))",
                background: "linear-gradient(180deg, hsl(222 38% 13%), hsl(226 47% 9%))",
                boxShadow: s.done ? b.glow : undefined,
              }}
            >
              {/* Accent stripe */}
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: b.gradient }}
              />

              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ background: b.gradient, boxShadow: b.glow }}
                  >
                    {b.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-base font-bold leading-tight"
                      style={{ color: b.accent }}
                    >
                      {b.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{b.sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => update(b.id, { done: !s.done })}
                  aria-label="Mark done"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all"
                  style={{
                    borderColor: s.done ? b.accent : "hsl(var(--border))",
                    background: s.done ? b.accent : "transparent",
                  }}
                >
                  <Check
                    className="h-4 w-4"
                    style={{ color: s.done ? "#0B1020" : "hsl(var(--muted-foreground))" }}
                  />
                </button>
              </div>

              {/* Time row */}
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" style={{ color: b.accent }} />
                <span className="font-medium">{b.time}</span>
                <span className="ml-auto flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {b.targetMin >= 60
                    ? `${(b.targetMin / 60).toFixed(b.targetMin % 60 ? 1 : 0)}h`
                    : `${b.targetMin}m`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${blockPct}%`, background: b.gradient }}
                />
              </div>

              {/* Actual minutes input */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Actual</label>
                <input
                  type="number"
                  min={0}
                  max={600}
                  value={s.actualMin || ""}
                  onChange={(e) =>
                    update(b.id, { actualMin: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="w-16 rounded-md border bg-transparent px-2 py-1 text-sm font-semibold tabular-nums focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "hsl(var(--border))",
                    color: b.accent,
                  }}
                />
                <span className="text-xs text-muted-foreground">min</span>
                <span className="ml-auto text-xs font-semibold tabular-nums" style={{ color: b.accent }}>
                  {blockPct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="mt-5 flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <span style={{ color: "#FBBF24" }}>★</span>
        <span className="font-semibold text-foreground">Consistency Today, Success Tomorrow</span>
        <span className="hidden text-muted-foreground sm:inline">·</span>
        <span className="hidden text-muted-foreground sm:inline">Stay Focused. Stay Disciplined.</span>
      </div>
    </div>
  );
}
