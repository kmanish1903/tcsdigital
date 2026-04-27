import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DailyLogRow, dayScore } from "@/lib/dailyLog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Reflection = {
  feedback_te: string;
  feedback_hi: string;
  feedback_en: string;
  focus_question: string;
  daily_score: number | null;
};

type Lang = "te" | "hi" | "en";

interface Props {
  dateISO: string;
  log: DailyLogRow;
}

export function AiReflectionCoach({ dateISO, log }: Props) {
  const { user } = useAuth();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  // Load existing reflection for this date
  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    setReflection(null);
    supabase
      .from("ai_reflections")
      .select("feedback_te, feedback_hi, feedback_en, focus_question, daily_score")
      .eq("user_id", user.id)
      .eq("log_date", dateISO)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        if (data) setReflection(data as Reflection);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [user, dateISO]);

  const generate = async () => {
    setGenerating(true);
    try {
      const score = dayScore(log);
      const { data, error } = await supabase.functions.invoke("ai-reflection", {
        body: { log, dateISO, score },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.reflection) {
        setReflection(data.reflection);
        toast.success("Coach has spoken 🧠");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate reflection");
    } finally {
      setGenerating(false);
    }
  };

  const text = reflection
    ? lang === "te"
      ? reflection.feedback_te
      : lang === "hi"
      ? reflection.feedback_hi
      : reflection.feedback_en
    : "";

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">AI Reflection Coach</h2>
        </div>
        {reflection && (
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            Score {reflection.daily_score ?? dayScore(log)}/100
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !reflection ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Today's score: <strong className="text-foreground">{dayScore(log)}/100</strong>. Get a 2-min trilingual reflection (Telugu, Hindi, English) on what's working and what's blocking you.
          </p>
          <Button onClick={generate} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Reflecting…" : "Generate today's reflection"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lang switcher */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["te", "hi", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  lang === l ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "te" ? "తెలుగు" : l === "hi" ? "हिंदी" : "English"}
              </button>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-foreground">{text}</p>

          {reflection.focus_question && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Reflect on this
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {reflection.focus_question}
              </p>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={generate} disabled={generating} className="gap-1.5">
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}
