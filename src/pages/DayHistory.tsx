import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyLogCard } from "@/components/DailyLogCard";
import { useDailyLog } from "@/hooks/useDailyLog";
import { dateToISO, todayISO } from "@/lib/dailyLog";

export default function DayHistory() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const dateISO = date || todayISO();
  const isToday = dateISO === todayISO();
  const { log, setLog, loading, saving } = useDailyLog(dateISO);

  useEffect(() => {
    document.title = `Day Log ${dateISO} — PrepTrack`;
  }, [dateISO]);

  const dateObj = new Date(dateISO + "T00:00");
  const fullLabel = dateObj.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const shift = (delta: number) => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + delta);
    const newIso = dateToISO(d);
    if (newIso > todayISO()) return;
    navigate(`/day/${newIso}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => shift(-1)}>← Prev</Button>
            <Button variant="outline" size="sm" onClick={() => shift(1)} disabled={dateISO >= todayISO()}>Next →</Button>
          </div>
        </header>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Day History</p>
          <h1 className="font-display text-3xl font-bold text-foreground">{fullLabel}</h1>
          {isToday && <p className="mt-1 text-xs text-muted-foreground">This is today — edits sync to your dashboard.</p>}
        </div>

        {loading ? (
          <div className="grid h-64 place-items-center surface-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <DailyLogCard log={log} onChange={setLog} dateLabel={dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
            {saving && <p className="mt-2 text-xs text-muted-foreground">Saving…</p>}
          </>
        )}
      </div>
    </div>
  );
}
