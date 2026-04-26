export type DayLog = {
  date: string; // YYYY-MM-DD
  dsaProblems: number;
  revision: boolean;
  mirrorSpeaking: boolean;
  jamSpeaking: boolean;
  reactLearning: boolean;
  randomSpeaking: number; // topics done
  pushups: number;
  pullups: number;
  meditation: boolean;
  hanumanChalisa: boolean;
  notes?: string;
};

export type DsaProgress = Record<string, number>; // topic -> 0..100

export type AppState = {
  startDate: string; // first tracked date
  logs: Record<string, DayLog>; // date -> log
  dsa: DsaProgress;
};

const KEY = "preptrack_state_v1";

const DEFAULT_DSA: DsaProgress = {
  Arrays: 90,
  Strings: 70,
  "Sliding Window": 50,
  "Stack & Queue": 30,
  "Linked List": 15,
};

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function emptyLog(date: string): DayLog {
  return {
    date,
    dsaProblems: 0,
    revision: false,
    mirrorSpeaking: false,
    jamSpeaking: false,
    reactLearning: false,
    randomSpeaking: 0,
    pushups: 0,
    pullups: 0,
    meditation: false,
    hanumanChalisa: false,
    notes: "",
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const today = todayISO();
  return { startDate: today, logs: { [today]: emptyLog(today) }, dsa: DEFAULT_DSA };
}

export function saveState(s: AppState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function dayStatus(log: DayLog): "productive" | "average" | "missed" {
  // Weighted: revision + mirror = HIGH (2 each), DSA (>=3) = 2, others 1
  let score = 0;
  let max = 0;
  max += 2; if (log.revision) score += 2;
  max += 2; if (log.mirrorSpeaking) score += 2;
  max += 2; if (log.dsaProblems >= 3) score += 2;
  max += 1; if (log.jamSpeaking) score += 1;
  max += 1; if (log.reactLearning) score += 1;
  max += 1; if (log.randomSpeaking >= 3) score += 1;
  max += 1; if (log.meditation) score += 1;
  const pct = score / max;
  if (pct >= 0.75) return "productive";
  if (pct >= 0.4) return "average";
  return "missed";
}

export function streak(logs: Record<string, DayLog>): number {
  let count = 0;
  const d = new Date();
  for (;;) {
    const tz = d.getTimezoneOffset() * 60000;
    const key = new Date(d.getTime() - tz).toISOString().slice(0, 10);
    const log = logs[key];
    if (!log) break;
    if (dayStatus(log) === "missed") break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function speakingConsistency(logs: Record<string, DayLog>): number {
  const arr = Object.values(logs);
  if (!arr.length) return 0;
  const speakingDays = arr.filter((l) => l.mirrorSpeaking || l.jamSpeaking || l.randomSpeaking > 0).length;
  return Math.round((speakingDays / arr.length) * 100);
}

export function totalDsa(logs: Record<string, DayLog>): number {
  return Object.values(logs).reduce((sum, l) => sum + (l.dsaProblems || 0), 0);
}

export function daysTracked(logs: Record<string, DayLog>): number {
  return Object.keys(logs).length;
}

export function exportCsv(logs: Record<string, DayLog>): string {
  const headers = [
    "date","dsaProblems","revision","mirrorSpeaking","jamSpeaking","reactLearning","randomSpeaking","pushups","pullups","meditation","hanumanChalisa","status","notes",
  ];
  const rows = Object.values(logs)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => [
      l.date, l.dsaProblems, l.revision, l.mirrorSpeaking, l.jamSpeaking, l.reactLearning,
      l.randomSpeaking, l.pushups, l.pullups, l.meditation, l.hanumanChalisa, dayStatus(l),
      JSON.stringify(l.notes || ""),
    ].join(","));
  return [headers.join(","), ...rows].join("\n");
}
