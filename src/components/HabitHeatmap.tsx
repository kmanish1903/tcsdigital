import { DailyLogRow, dayScore } from "@/lib/dailyLog";
import { dateToISO } from "@/lib/dailyLog";
import { useMemo, useState } from "react";

interface Props {
  logs: Record<string, DailyLogRow>;
  weeks?: number; // default 26 (~6 months)
}

// GitHub-style heatmap: columns = weeks, rows = days (Sun..Sat)
export function HabitHeatmap({ logs, weeks = 26 }: Props) {
  const [hover, setHover] = useState<{ date: string; score: number } | null>(null);

  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Anchor to most recent Saturday end-of-week
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const cols: { date: string; score: number; future: boolean; today: boolean }[][] = [];
    const cursor = new Date(start);
    for (let w = 0; w < weeks; w++) {
      const col: typeof cols[number] = [];
      for (let d = 0; d < 7; d++) {
        const iso = dateToISO(cursor);
        const log = logs[iso];
        const score = log ? dayScore(log) : 0;
        col.push({
          date: iso,
          score,
          future: cursor > today,
          today: cursor.getTime() === today.getTime(),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      cols.push(col);
    }
    return cols;
  }, [logs, weeks]);

  const colorClass = (score: number, future: boolean) => {
    if (future) return "bg-secondary/30";
    if (score === 0) return "bg-secondary";
    if (score < 40) return "bg-destructive/40";
    if (score < 75) return "bg-warning/60";
    return "bg-success";
  };

  const totalActive = Object.values(logs).filter((l) => dayScore(l) > 0).length;
  const productiveDays = Object.values(logs).filter((l) => dayScore(l) >= 75).length;

  return (
    <div className="surface-card p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Consistency Heatmap</h2>
          <p className="text-xs text-muted-foreground">
            Last {weeks} weeks · {productiveDays} productive days · {totalActive} days logged
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          <span className="h-3 w-3 rounded-sm bg-secondary" />
          <span className="h-3 w-3 rounded-sm bg-destructive/40" />
          <span className="h-3 w-3 rounded-sm bg-warning/60" />
          <span className="h-3 w-3 rounded-sm bg-success" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1">
          {grid.map((col, i) => (
            <div key={i} className="flex flex-col gap-1">
              {col.map((cell) => (
                <div
                  key={cell.date}
                  onMouseEnter={() => setHover({ date: cell.date, score: cell.score })}
                  onMouseLeave={() => setHover(null)}
                  className={`h-3 w-3 rounded-sm transition hover:ring-2 hover:ring-primary ${colorClass(
                    cell.score,
                    cell.future
                  )} ${cell.today ? "ring-1 ring-primary" : ""}`}
                  title={`${cell.date} — ${cell.score}/100`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 h-5 text-xs text-muted-foreground">
        {hover ? `${hover.date} · score ${hover.score}/100` : "Hover a square to see the day."}
      </div>
    </div>
  );
}
