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
  anulom_vilom: boolean;
  temple_visit: boolean;
  fasting: boolean;
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
    anulom_vilom: false,
    temple_visit: false,
    fasting: false,
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

export function dayStatus(l: DailyLogRow): "productive" | "average" | "missed" {
  let score = 0;
  let max = 0;
  // Spiritual
  max += 2; if (l.naam_jap_done || l.naam_jap_count >= NAAM_TARGET) score += 2;
  max += 2; if (l.hanuman_chalisa_done || l.hanuman_chalisa_count >= CHALISA_TARGET) score += 2;
  max += 1; if (l.meditation) score += 1;
  // Learning (HIGH priority)
  max += 2; if (l.revision) score += 2;
  max += 2; if (l.mirror_speaking) score += 2;
  max += 2; if (l.dsa_problems >= 3) score += 2;
  max += 2; if (l.videos_today >= 2) score += 2;
  max += 1; if (l.react_learning) score += 1;
  max += 1; if (l.jam_speaking) score += 1;
  max += 1; if (l.random_speaking >= 3) score += 1;
  const pct = score / max;
  if (pct >= 0.75) return "productive";
  if (pct >= 0.4) return "average";
  return "missed";
}
