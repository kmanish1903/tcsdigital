import { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { DayLog } from "@/lib/tracker";
import { DailyVideoCount } from "@/lib/curriculum";

interface Props {
  logs: Record<string, DayLog>;
  daily: DailyVideoCount;
}

function lastNDates(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    const tz = x.getTimezoneOffset() * 60000;
    out.push(new Date(x.getTime() - tz).toISOString().slice(0, 10));
  }
  return out;
}

export function WeeklyChart({ logs, daily }: Props) {
  const data = useMemo(() => {
    return lastNDates(7).map((iso) => {
      const log = logs[iso];
      const day = new Date(iso + "T00:00").toLocaleDateString(undefined, { weekday: "short" });
      return {
        day,
        date: iso,
        DSA: log?.dsaProblems ?? 0,
        Videos: (daily[iso] || []).length,
        Speaking: log?.randomSpeaking ?? 0,
      };
    });
  }, [logs, daily]);

  const totalVideos = data.reduce((a, d) => a + d.Videos, 0);
  const totalDsa = data.reduce((a, d) => a + d.DSA, 0);

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Weekly Performance</h2>
          <p className="mt-1 text-xs text-muted-foreground">Last 7 days activity</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <div className="font-display text-2xl font-bold text-primary tabular-nums">{totalVideos}</div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">videos</p>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-success tabular-nums">{totalDsa}</div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">problems</p>
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-vid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-dsa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-spk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area type="monotone" dataKey="Videos"   stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#grad-vid)" />
            <Area type="monotone" dataKey="DSA"      stroke="hsl(var(--success))" strokeWidth={2} fill="url(#grad-dsa)" />
            <Area type="monotone" dataKey="Speaking" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#grad-spk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Videos</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> DSA Problems</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" /> Speaking Topics</span>
      </div>
    </div>
  );
}
