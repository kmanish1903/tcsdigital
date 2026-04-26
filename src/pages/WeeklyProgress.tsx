import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeeklyChart } from "@/components/WeeklyChart";
import { StatCard } from "@/components/StatCard";
import { useAllDailyLogs } from "@/hooks/useDailyLog";
import { dateToISO, dayStatus } from "@/lib/dailyLog";

function lastNDates(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    out.push(dateToISO(x));
  }
  return out;
}

export default function WeeklyProgress() {
  const navigate = useNavigate();
  const { logs } = useAllDailyLogs();

  useEffect(() => { document.title = "Weekly Progress — PrepTrack"; }, []);

  const week = useMemo(() => lastNDates(7).map((iso) => logs[iso]).filter(Boolean), [logs]);

  const totals = useMemo(() => {
    const dsa = week.reduce((a, l) => a + (l.dsa_problems || 0), 0);
    const videos = week.reduce((a, l) => a + (l.videos_today || 0), 0);
    const naam = week.reduce((a, l) => a + (l.naam_jap_count || 0), 0);
    const chalisa = week.reduce((a, l) => a + (l.hanuman_chalisa_count || 0), 0);
    const mirror = week.filter((l) => l.mirror_speaking).length;
    const productive = week.filter((l) => dayStatus(l) === "productive").length;
    const pushups = week.reduce((a, l) => a + (l.pushups || 0), 0);
    return { dsa, videos, naam, chalisa, mirror, productive, pushups };
  }, [week]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Button>
        </header>

        <h1 className="font-display text-3xl font-bold text-foreground">Weekly Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Last 7 days — totals, trends, and consistency.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Productive Days" value={`${totals.productive}/7`} hint="🔥 Days hit" accent />
          <StatCard label="Videos Watched" value={totals.videos} hint="Target: 14" />
          <StatCard label="DSA Problems" value={totals.dsa} hint="Total this week" />
          <StatCard label="Mirror Speaking" value={`${totals.mirror}/7`} hint="Days completed" />
          <StatCard label="Naam Jap" value={totals.naam} hint={`Target: ${108 * 7}`} />
          <StatCard label="Hanuman Chalisa" value={totals.chalisa} hint={`Target: ${3 * 7}`} />
          <StatCard label="Pushups" value={totals.pushups} hint="Total reps" />
          <StatCard label="Days Logged" value={week.length} hint="Out of 7" />
        </section>

        <section className="mt-8">
          <WeeklyChart logs={logs} days={7} title="Last 7 Days" subtitle="Videos · DSA · Speaking" />
        </section>

        <section className="mt-8">
          <WeeklyChart logs={logs} days={30} title="Last 30 Days" subtitle="Long-range trend" />
        </section>
      </div>
    </div>
  );
}
