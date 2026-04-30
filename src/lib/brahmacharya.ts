// Brahmacharya tracker logic — phases, milestones, math.
export type BrahmacharyaJourney = {
  id?: string;
  user_id?: string;
  started_on: string;
  current_phase: number;
  phase1_target: number;
  phase2_target: number;
  current_streak: number;
  best_streak: number;
  total_clean_days: number;
  total_slips: number;
};

export type BrahmacharyaDay = {
  id?: string;
  user_id?: string;
  log_date: string;
  status: "clean" | "slip" | "urge_channeled";
  notes?: string | null;
};

export const PHASE1_DAYS = 30;
export const PHASE2_DAYS = 45;

export const MILESTONES: { day: number; title: string; benefit: string }[] = [
  { day: 3, title: "First Spark", benefit: "Mind starts settling. Cravings still loud — observe, don't act." },
  { day: 7, title: "1 Week Clean", benefit: "Sleep deepens. Focus sharper. You proved you can." },
  { day: 14, title: "Fortnight Forged", benefit: "Energy redirected. Voice steadier. Eyes brighter." },
  { day: 21, title: "Habit Locked", benefit: "Neural rewire complete. Old triggers losing power." },
  { day: 30, title: "Phase 1 Complete 🚩", benefit: "Foundation built. Ojas accumulating. Phase 2 unlocked." },
  { day: 45, title: "45 Days — Warrior", benefit: "Magnetism rising. People notice your presence." },
  { day: 60, title: "60 Days — Tapasya", benefit: "Discipline is identity. Distractions feel beneath you." },
  { day: 75, title: "75 Days — Champion 👑", benefit: "Top 1% mind. You can choose any path now." },
];

export function currentPhase(streak: number): 1 | 2 {
  return streak >= PHASE1_DAYS ? 2 : 1;
}

export function phaseLabel(phase: number): string {
  return phase === 1 ? "Phase 1 · Foundation (30 days)" : "Phase 2 · Mastery (45 days)";
}

export function phaseTarget(phase: number): number {
  return phase === 1 ? PHASE1_DAYS : PHASE1_DAYS + PHASE2_DAYS;
}

export function nextMilestone(streak: number) {
  return MILESTONES.find((m) => m.day > streak) ?? MILESTONES[MILESTONES.length - 1];
}

export function reachedMilestones(streak: number) {
  return MILESTONES.filter((m) => m.day <= streak);
}

export function todayPhaseProgressPct(streak: number): number {
  const phase = currentPhase(streak);
  if (phase === 1) return Math.min(100, Math.round((streak / PHASE1_DAYS) * 100));
  const inPhase2 = streak - PHASE1_DAYS;
  return Math.min(100, Math.round((inPhase2 / PHASE2_DAYS) * 100));
}
