import { Check } from "lucide-react";
import { Pillar, PILLAR_META, pillarTaskForDate } from "@/lib/topPillars";
import { DailyLogRow, todayISO } from "@/lib/dailyLog";
import { cn } from "@/lib/utils";

const PILLAR_ORDER: Pillar[] = ["wealth", "communication", "ethics", "influence", "power"];

const FIELD_MAP: Record<Pillar, keyof DailyLogRow> = {
  wealth: "pillar_wealth",
  communication: "pillar_communication",
  ethics: "pillar_ethics",
  influence: "pillar_influence",
  power: "pillar_power",
};

interface Props {
  log: DailyLogRow;
  onChange: (next: DailyLogRow) => void;
}

export function SixPillarsGrid({ log, onChange }: Props) {
  const date = todayISO();
  const completed = PILLAR_ORDER.filter((p) => Boolean(log[FIELD_MAP[p]])).length;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Top 1% Operating System
          </span>
          <h3 className="mt-0.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            Today's 5 Pillars
          </h3>
          <p className="text-xs text-muted-foreground">One micro-task per pillar. Changes daily. Tap to complete.</p>
        </div>
        <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {completed} / 5 done
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {PILLAR_ORDER.map((p) => {
          const meta = PILLAR_META[p];
          const field = FIELD_MAP[p];
          const done = Boolean(log[field]);
          const task = pillarTaskForDate(p, date);
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...log, [field]: !done } as DailyLogRow)}
              className={cn(
                "group relative flex h-full flex-col rounded-xl border p-3 text-left transition",
                done
                  ? "border-success/50 bg-success/10"
                  : "border-border bg-background/50 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{meta.emoji}</span>
                  <span className={cn("text-[11px] font-bold uppercase tracking-wider", meta.color)}>
                    {meta.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border",
                    done ? "border-success bg-success text-success-foreground" : "border-border"
                  )}
                >
                  {done && <Check className="h-3 w-3" />}
                </span>
              </div>
              <p className={cn("text-[11px] font-medium leading-snug", done ? "text-muted-foreground line-through" : "text-foreground")}>
                {task}
              </p>
              <p className="mt-auto pt-2 text-[10px] italic text-muted-foreground">{meta.tagline}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
