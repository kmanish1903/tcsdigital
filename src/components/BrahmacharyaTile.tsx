import { useState } from "react";
import { Flame, Shield, AlertTriangle, Zap, Trophy, Loader2 } from "lucide-react";
import { useBrahmacharya } from "@/hooks/useBrahmacharya";
import {
  phaseLabel, phaseTarget, nextMilestone, todayPhaseProgressPct, currentPhase, MILESTONES,
} from "@/lib/brahmacharya";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BrahmacharyaTile() {
  const { journey, loading, startJourney, markDay, todayStatus } = useBrahmacharya();
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-warning/40 bg-gradient-to-br from-warning/15 via-card to-primary/15 p-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-warning/20 blur-3xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-warning">
              Brahmacharya · 75-Day Arc
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Start the unbeatable journey today.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Phase 1: <strong className="text-foreground">30 days strict</strong> · Phase 2: <strong className="text-foreground">45 more days</strong>. 
            No porn. No bad stuff. Pure focus, ojas, and Hanuman energy. ॥ जय श्री राम ॥
          </p>
          <Button
            className="mt-4 gap-2"
            onClick={async () => { setBusy(true); await startJourney(); setBusy(false); toast.success("Journey started 🚩", { description: "Day 1 begins now. Stay strong, Manish." }); }}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
            Start Day 1 — Lock In
          </Button>
        </div>
      </div>
    );
  }

  const streak = journey.current_streak;
  const phase = currentPhase(streak);
  const target = phaseTarget(phase);
  const pct = todayPhaseProgressPct(streak);
  const next = nextMilestone(streak);
  const reached = MILESTONES.filter((m) => m.day <= streak);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-warning/40 bg-gradient-to-br from-warning/10 via-card to-primary/10 p-6 shadow-sm">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-warning/15 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-warning">
                Brahmacharya
              </span>
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Day <span className="text-warning">{streak}</span>
              <span className="text-xl text-muted-foreground"> / {target}</span>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{phaseLabel(phase)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Best Streak</p>
            <p className="font-display text-2xl font-bold text-success">{journey.best_streak}</p>
            <p className="text-[10px] text-muted-foreground">{journey.total_slips} slip(s) total</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Phase {phase} progress</span>
            <span className="font-bold text-foreground">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-warning to-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Next milestone */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-foreground">
              Next: Day {next.day} — {next.title}
            </p>
            <p className="text-xs text-muted-foreground">{next.benefit}</p>
          </div>
        </div>

        {/* Today's actions */}
        {todayStatus ? (
          <div className="mt-4 rounded-xl border border-success/40 bg-success/10 p-3 text-sm">
            {todayStatus === "clean" && <span className="text-success">✅ Today locked in clean. Hanuman ji proud.</span>}
            {todayStatus === "urge_channeled" && <span className="text-primary">⚡ Urge channeled. +1 willpower point.</span>}
            {todayStatus === "slip" && <span className="text-destructive">❌ Slipped. Streak reset. Start again — no shame.</span>}
          </div>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button
              size="sm"
              className="gap-1.5 bg-success text-success-foreground hover:bg-success/90"
              onClick={async () => { setBusy(true); await markDay("clean"); setBusy(false); toast.success("Day +1 🔥", { description: "Streak grows. Tomorrow we go again." }); }}
              disabled={busy}
            >
              <Shield className="h-3.5 w-3.5" /> Clean Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={async () => { setBusy(true); await markDay("urge_channeled"); setBusy(false); toast("⚡ Urge channeled", { description: "You felt it and won. Streak intact." }); }}
              disabled={busy}
            >
              <Zap className="h-3.5 w-3.5" /> Urge Channeled
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={async () => {
                if (!confirm("Honestly log a slip and reset streak? No shame — truth = growth.")) return;
                setBusy(true); await markDay("slip"); setBusy(false);
                toast("Reset. Day 1 tomorrow.", { description: "Manish, the slip is data. Tomorrow begins again." });
              }}
              disabled={busy}
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Slipped
            </Button>
          </div>
        )}

        {/* Milestones row */}
        {reached.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {reached.map((m) => (
              <span key={m.day} className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                ✓ Day {m.day}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
