import { useMemo } from "react";
import { Flame, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { todayISO } from "@/lib/dailyLog";
import { fillName, messageForDate, nameFromEmail } from "@/lib/personalMotivation";

export function PersonalMotivation() {
  const { user } = useAuth();
  const date = todayISO();

  const { name, msg } = useMemo(() => {
    const n = nameFromEmail(user?.email);
    return { name: n, msg: messageForDate(date) };
  }, [user?.email, date]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-gradient-to-br from-destructive/10 via-card to-primary/10 p-5 shadow-sm">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-destructive/20 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-md bg-destructive/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
            Reality · {msg.tag}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            For {name} · changes daily
          </span>
        </div>

        <p className="font-display text-base font-semibold leading-snug text-foreground sm:text-lg">
          {fillName(msg.truth, name)}
        </p>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {fillName(msg.push, name)}
          </p>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] italic text-muted-foreground">
          <Flame className="h-3 w-3 text-warning" />
          3.5 LPA → 9–15 LPA · 90 days · no excuses
        </p>
      </div>
    </div>
  );
}
