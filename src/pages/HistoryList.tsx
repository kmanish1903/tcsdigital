import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllDailyLogs } from "@/hooks/useDailyLog";
import { dayStatus } from "@/lib/dailyLog";
import { cn } from "@/lib/utils";

export default function HistoryList() {
  const navigate = useNavigate();
  const { logs, loading } = useAllDailyLogs();

  useEffect(() => { document.title = "Full History — PrepTrack"; }, []);

  const sorted = useMemo(
    () => Object.values(logs).sort((a, b) => b.log_date.localeCompare(a.log_date)),
    [logs],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Button>
        </header>

        <h1 className="font-display text-3xl font-bold text-foreground">Full History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every day you've tracked. Click any row to view or edit.
        </p>

        <div className="mt-6 surface-card overflow-hidden">
          {loading ? (
            <div className="grid h-40 place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="grid h-40 place-items-center text-sm text-muted-foreground">
              No history yet. Start logging today!
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Naam</th>
                  <th className="px-4 py-3 text-center">Chalisa</th>
                  <th className="px-4 py-3 text-center">DSA</th>
                  <th className="px-4 py-3 text-center">Videos</th>
                  <th className="px-4 py-3 text-center">Mirror</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((l) => {
                  const status = dayStatus(l);
                  const dateObj = new Date(l.log_date + "T00:00");
                  return (
                    <tr
                      key={l.log_date}
                      onClick={() => navigate(`/day/${l.log_date}`)}
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {dateObj.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums">{l.naam_jap_count}/108</td>
                      <td className="px-4 py-3 text-center tabular-nums">{l.hanuman_chalisa_count}/3</td>
                      <td className="px-4 py-3 text-center tabular-nums">{l.dsa_problems}</td>
                      <td className="px-4 py-3 text-center tabular-nums">{l.videos_today}/2</td>
                      <td className="px-4 py-3 text-center">{l.mirror_speaking ? "✅" : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          status === "productive" && "bg-success/15 text-success",
                          status === "average" && "bg-warning/15 text-warning",
                          status === "missed" && "bg-destructive/15 text-destructive",
                        )}>
                          {status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
