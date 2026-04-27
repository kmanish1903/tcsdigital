import { TrendingUp, Flame, Zap } from "lucide-react";
import { DailyLogRow, dayScore, dayStatus } from "@/lib/dailyLog";

interface Props {
  log: DailyLogRow;
  streak: number;
}

export function TodayScoreBar({ log, streak }: Props) {
  const score = dayScore(log);
  const status = dayStatus(log);

  const statusMap = {
    productive: { label: "Top 1% mode", color: "text-success", bg: "bg-success", glow: "shadow-[0_0_20px_hsl(var(--success)/0.4)]" },
    average: { label: "Decent — push harder", color: "text-warning", bg: "bg-warning", glow: "" },
    missed: { label: "Lock in — day's not over", color: "text-destructive", bg: "bg-destructive", glow: "" },
  } as const;

  const s = statusMap[status];

  // Encouragement message
  let msg = "Stack the wins. Sadhana → Learning → Speaking → Fitness.";
  if (score >= 75) msg = "This is what 8–15 LPA energy looks like. Keep going.";
  else if (score >= 50) msg = "You're close. Knock out 2 more habits to hit Top 1% zone.";
  else if (score >= 25) msg = "Slow start — finish revision, mirror speaking, and 2 videos.";
  else msg = "Day's not over. Start with 108 Naam Jap → momentum follows.";

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg}/10 ${s.glow}`}>
            <Zap className={`h-7 w-7 ${s.color}`} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
              <span className={`ml-2 text-sm font-semibold ${s.color}`}>{s.label}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Today's Score</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
          <Flame className="h-4 w-4 text-warning" />
          <span className="text-sm font-semibold text-foreground">{streak}</span>
          <span className="text-xs text-muted-foreground">day streak</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${s.bg} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-3 flex items-start gap-2">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">{msg}</p>
      </div>
    </div>
  );
}
