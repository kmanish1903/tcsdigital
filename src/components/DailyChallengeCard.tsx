import { useEffect, useState } from "react";
import { Sparkles, Mic, RefreshCw, Check } from "lucide-react";
import { challengeForDate, topicsForDate, SALES_BUSINESS_TOPICS } from "@/lib/dailyChallenges";
import { SPEAKING_TOPICS } from "@/lib/topics";
import { todayISO } from "@/lib/dailyLog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STORAGE_KEY = "preptrack_daily_challenge";

type DoneState = {
  date: string;
  challenge: boolean;
  topic1: boolean;
  topic2: boolean;
};

function loadState(date: string): DoneState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DoneState;
      if (parsed.date === date) return parsed;
    }
  } catch {}
  return { date, challenge: false, topic1: false, topic2: false };
}

function saveState(s: DoneState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function DailyChallengeCard() {
  const date = todayISO();
  const challenge = challengeForDate(date);
  // Mix general + sales/business topics — bias toward sales/business
  const allTopics = [...SALES_BUSINESS_TOPICS, ...SALES_BUSINESS_TOPICS, ...SPEAKING_TOPICS];
  const [topics, setTopics] = useState<[string, string]>(() => topicsForDate(date, allTopics));
  const [state, setState] = useState<DoneState>(() => loadState(date));

  useEffect(() => { saveState(state); }, [state]);

  const toggle = (key: keyof Omit<DoneState, "date">) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    if (next[key]) toast.success("Logged ✓", { description: "One small win. Stack them." });
  };

  const reshuffleTopics = () => {
    // Manual reshuffle — pick two random different topics
    const i = Math.floor(Math.random() * allTopics.length);
    let j = Math.floor(Math.random() * allTopics.length);
    while (allTopics[j] === allTopics[i]) j = Math.floor(Math.random() * allTopics.length);
    setTopics([allTopics[i], allTopics[j]]);
    setState({ ...state, topic1: false, topic2: false });
  };

  const allDone = state.challenge && state.topic1 && state.topic2;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Today's Top 1% Challenge
          </h3>
        </div>
        {allDone && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            ✓ All done — top 1% energy
          </span>
        )}
      </div>

      {/* Challenge */}
      <button
        onClick={() => toggle("challenge")}
        className={`group mb-4 flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
          state.challenge
            ? "border-success/40 bg-success/5"
            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
          state.challenge ? "border-success bg-success text-white" : "border-border group-hover:border-primary"
        }`}>
          {state.challenge && <Check className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">{challenge.emoji}</span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {challenge.category}
            </span>
          </div>
          <p className={`text-sm font-medium ${state.challenge ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {challenge.text}
          </p>
        </div>
      </button>

      {/* Speaking topics */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            2 Topics for Mirror Speaking
          </h4>
        </div>
        <Button variant="ghost" size="sm" onClick={reshuffleTopics} className="h-7 gap-1 text-xs">
          <RefreshCw className="h-3 w-3" /> Shuffle
        </Button>
      </div>

      <div className="space-y-2">
        {[
          { idx: 0, key: "topic1" as const, topic: topics[0] },
          { idx: 1, key: "topic2" as const, topic: topics[1] },
        ].map(({ idx, key, topic }) => (
          <button
            key={idx}
            onClick={() => toggle(key)}
            className={`group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
              state[key]
                ? "border-success/40 bg-success/5"
                : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
              state[key] ? "border-success bg-success text-white" : "border-border group-hover:border-primary"
            }`}>
              {state[key] && <Check className="h-3 w-3" />}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${state[key] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                <span className="mr-2 font-mono text-xs text-muted-foreground">#{idx + 1}</span>
                {topic}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Speak 2 minutes • record yourself • watch it back
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] italic text-muted-foreground">
        Top 1% isn't built in big leaps — it's one uncomfortable rep, every day.
      </p>
    </div>
  );
}
