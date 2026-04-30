// Shared types & helpers for the Supabase-backed daily log.
export type DailyLogRow = {
  id?: string;
  user_id?: string;
  log_date: string; // YYYY-MM-DD
  naam_jap_count: number;
  naam_jap_done: boolean;
  hanuman_chalisa_count: number;
  hanuman_chalisa_done: boolean;
  meditation: boolean;
  dsa_problems: number;
  revision: boolean;
  react_learning: boolean;
  videos_today: number;
  mirror_speaking: boolean;
  jam_speaking: boolean;
  random_speaking: number;
  pushups: number;
  pullups: number;
  squats: number;
  anulom_vilom: boolean;
  temple_visit: boolean;
  fasting: boolean;
  instagram_minutes: number;
  youtube_minutes: number;
  phone_pickups: number;
  deep_work_blocks: number;
  energy: number;
  focus: number;
  urges: number;
  pillar_wealth: boolean;
  pillar_communication: boolean;
  pillar_ethics: boolean;
  pillar_influence: boolean;
  pillar_power: boolean;
  evening_reflection: { thanked?: string; regret?: string; tomorrow?: string } | null;
  notes: string | null;
};

export const NAAM_TARGET = 108;
export const CHALISA_TARGET = 3;

export function emptyDailyLog(date: string): DailyLogRow {
  return {
    log_date: date,
    naam_jap_count: 0,
    naam_jap_done: false,
    hanuman_chalisa_count: 0,
    hanuman_chalisa_done: false,
    meditation: false,
    dsa_problems: 0,
    revision: false,
    react_learning: false,
    videos_today: 0,
    mirror_speaking: false,
    jam_speaking: false,
    random_speaking: 0,
    pushups: 0,
    pullups: 0,
    squats: 0,
    anulom_vilom: false,
    temple_visit: false,
    fasting: false,
    instagram_minutes: 0,
    youtube_minutes: 0,
    phone_pickups: 0,
    deep_work_blocks: 0,
    energy: 0,
    focus: 0,
    urges: 0,
    pillar_wealth: false,
    pillar_communication: false,
    pillar_ethics: false,
    pillar_influence: false,
    pillar_power: false,
    evening_reflection: null,
    notes: "",
  };
}

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function dateToISO(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function dayScore(l: DailyLogRow): number {
  let score = 0;
  let max = 0;
  // Spiritual
  max += 2; if (l.naam_jap_done || l.naam_jap_count >= NAAM_TARGET) score += 2;
  max += 2; if (l.hanuman_chalisa_done || l.hanuman_chalisa_count >= CHALISA_TARGET) score += 2;
  max += 1; if (l.meditation) score += 1;
  max += 1; if (l.anulom_vilom) score += 1;
  // Learning (HIGH priority)
  max += 2; if (l.revision) score += 2;
  max += 2; if (l.mirror_speaking) score += 2;
  max += 2; if (l.dsa_problems >= 3) score += 2;
  max += 2; if (l.videos_today >= 2) score += 2;
  max += 1; if (l.react_learning) score += 1;
  max += 1; if (l.jam_speaking) score += 1;
  max += 1; if (l.random_speaking >= 3) score += 1;
  // Top 1% pillars
  max += 1; if (l.pillar_wealth) score += 1;
  max += 1; if (l.pillar_communication) score += 1;
  max += 1; if (l.pillar_ethics) score += 1;
  max += 1; if (l.pillar_influence) score += 1;
  max += 1; if (l.pillar_power) score += 1;
  return Math.round((score / max) * 100);
}

export function dayStatus(l: DailyLogRow): "productive" | "average" | "missed" {
  const pct = dayScore(l) / 100;
  if (pct >= 0.75) return "productive";
  if (pct >= 0.4) return "average";
  return "missed";
}
