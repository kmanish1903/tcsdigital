import { useEffect, useState } from "react";
import { Sunrise, Moon, Check } from "lucide-react";
import { morningForDate, nightForDate } from "@/lib/morningNightChallenges";
import { todayISO } from "@/lib/dailyLog";
import { toast } from "sonner";

const STORAGE_KEY = "preptrack_morning_night";

type State = { date: string; morning: boolean; night: boolean };

function load(date: string): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as State;
      if (p.date === date) return p;
    }
  } catch {}
  return { date, morning: false, night: false };
}

export function MorningNightChallenge() {
  const date = todayISO();
  const morning = morningForDate(date);
  const night = nightForDate(date);
  const [state, setState] = useState<State>(() => load(date));
  const hour = new Date().getHours();
  const isMorningTime = hour < 16;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggle = (key: "morning" | "night") => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    if (next[key]) {
      toast.success(key === "morning" ? "Morning challenge ✓" : "Night challenge ✓", {
        description: key === "morning" ? "Day started right. Keep stacking." : "Day closed clean. Sleep like a king.",
      });
    }
  };

  const both = state.morning && state.night;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Today's Morning + Night Ritual
        </h3>
        {both && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            ✓ Bookended — top 1% day
          </span>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* MORNING */}
        <button
          onClick={() => toggle("morning")}
          className={`group flex flex-col gap-2 rounded-xl border p-4 text-left transition ${
            state.morning
              ? "border-success/40 bg-success/5"
              : isMorningTime
              ? "border-warning/40 bg-warning/5 hover:border-warning"
              : "border-border bg-background hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-warning" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-warning">
                Morning {isMorningTime && !state.morning && "• do now"}
              </span>
            </div>
            <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${
              state.morning ? "border-success bg-success text-white" : "border-border group-hover:border-primary"
            }`}>
              {state.morning && <Check className="h-3 w-3" />}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">{morning.emoji}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium leading-snug ${state.morning ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {morning.text}
              </p>
              <p className="mt-1 text-[11px] italic text-muted-foreground">{morning.why}</p>
            </div>
          </div>
        </button>

        {/* NIGHT */}
        <button
          onClick={() => toggle("night")}
          className={`group flex flex-col gap-2 rounded-xl border p-4 text-left transition ${
            state.night
              ? "border-success/40 bg-success/5"
              : !isMorningTime
              ? "border-primary/40 bg-primary/5 hover:border-primary"
              : "border-border bg-background hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Night {!isMorningTime && !state.night && "• do tonight"}
              </span>
            </div>
            <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${
              state.night ? "border-success bg-success text-white" : "border-border group-hover:border-primary"
            }`}>
              {state.night && <Check className="h-3 w-3" />}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">{night.emoji}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium leading-snug ${state.night ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {night.text}
              </p>
              <p className="mt-1 text-[11px] italic text-muted-foreground">{night.why}</p>
            </div>
          </div>
        </button>
      </div>

      <p className="mt-4 text-[11px] italic text-muted-foreground">
        Bookend every day. Win the morning, close the night. That's the loop top 1% lives in.
      </p>
    </div>
  );
}
