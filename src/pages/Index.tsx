import { useEffect, useMemo, useState } from "react";
import { Flame, Download, Target, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { DailyLogCard } from "@/components/DailyLogCard";
import { SpeakingCard } from "@/components/SpeakingCard";
import { DsaProgressCard } from "@/components/DsaProgressCard";
import { CurriculumTracker } from "@/components/CurriculumTracker";
import { MotivationBanner } from "@/components/MotivationBanner";
import { WeeklyChart } from "@/components/WeeklyChart";
import {
  AppState, DayLog, daysTracked, emptyLog, exportCsv, loadState, saveState,
  speakingConsistency, streak, todayISO, totalDsa,
} from "@/lib/tracker";
import {
  CurriculumProgress, DailyVideoCount, completedVideos, loadDailyVideos,
  loadProgress, overallPct, saveDailyVideos, saveProgress, totalVideos,
} from "@/lib/curriculum";
import { toast } from "sonner";

const Index = () => {
  const [state, setState] = useState<AppState>(() => loadState());
  const [progress, setProgress] = useState<CurriculumProgress>(() => loadProgress());
  const [daily, setDaily] = useState<DailyVideoCount>(() => loadDailyVideos());
  const today = todayISO();

  useEffect(() => {
    if (!state.logs[today]) {
      const next = { ...state, logs: { ...state.logs, [today]: emptyLog(today) } };
      setState(next);
      saveState(next);
    }
  }, [today]); // eslint-disable-line

  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => { saveDailyVideos(daily); }, [daily]);

  useEffect(() => {
    const flag = sessionStorage.getItem("preptrack_reminded");
    if (!flag) {
      setTimeout(() => {
        toast("👋 Daily reminder", {
          description: "2 videos + Mirror Speaking today. Lock in.",
        });
        sessionStorage.setItem("preptrack_reminded", "1");
      }, 1200);
    }
  }, []);

  const log = state.logs[today] || emptyLog(today);
  const updateLog = (next: DayLog) => {
    setState((s) => ({ ...s, logs: { ...s.logs, [today]: next } }));
  };

  const handleVideoComplete = (videoId: string) => {
    setDaily((d) => {
      const list = d[today] || [];
      if (list.includes(videoId)) return d;
      return { ...d, [today]: [...list, videoId] };
    });
    toast.success("Video completed 🎬", { description: "Keep stacking. 8+ LPA loading." });
  };

  const videosToday = (daily[today] || []).length;
  const curriculumDone = completedVideos(progress);
  const curriculumTotal = totalVideos();
  const curriculumPct = overallPct(progress);

  const stats = useMemo(() => ({
    days: daysTracked(state.logs),
    dsa: totalDsa(state.logs),
    streak: streak(state.logs),
    speak: speakingConsistency(state.logs),
  }), [state.logs]);

  const startLabel = useMemo(() => {
    const d = new Date(state.startDate + "T00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, [state.startDate]);

  const handleExport = () => {
    const csv = exportCsv(state.logs);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `preptrack-${today}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Prep<span className="text-primary">Track</span>
            </h1>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <a className="text-primary" href="#dashboard">Dashboard</a>
              <a className="text-muted-foreground transition hover:text-foreground" href="#curriculum">Curriculum</a>
              <a className="text-muted-foreground transition hover:text-foreground" href="#log">Daily Log</a>
              <a className="text-muted-foreground transition hover:text-foreground" href="#speaking">Speaking</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground sm:flex"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Motivation banner */}
        <div className="mb-6">
          <MotivationBanner videosToday={videosToday} target={2} />
        </div>

        {/* Focus note */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Highest weight goes to <strong className="text-foreground">Revision</strong>,{" "}
            <strong className="text-foreground">Mirror Speaking</strong>, and finishing your{" "}
            <strong className="text-foreground">2 daily videos</strong>.
          </p>
        </div>

        {/* Stats */}
        <section id="dashboard" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Days Tracked" value={stats.days} hint={`Since ${startLabel}`} accent />
          <StatCard
            label="Curriculum"
            value={
              <span className="flex items-baseline gap-2">
                {curriculumPct}%
                <span className="text-sm font-medium text-muted-foreground">{curriculumDone}/{curriculumTotal}</span>
              </span>
            }
            hint="Videos completed"
            icon={<Trophy className="h-7 w-7 text-primary" />}
          />
          <StatCard label="DSA Solved" value={stats.dsa} hint="Problems total" />
          <StatCard
            label="Habit Streak"
            icon={<Flame className="h-7 w-7 text-warning" />}
            value={
              <span className="flex items-baseline gap-2">
                {stats.streak}
                <span className="text-sm font-medium text-muted-foreground">days</span>
              </span>
            }
            hint={`Speaking: ${stats.speak}%`}
          />
        </section>

        {/* Weekly chart */}
        <section className="mb-8">
          <WeeklyChart logs={state.logs} daily={daily} />
        </section>

        {/* Main grid */}
        <section className="mb-8 grid gap-6 lg:grid-cols-5">
          <div id="log" className="lg:col-span-3">
            <DailyLogCard log={log} onChange={updateLog} />
          </div>
          <div id="speaking" className="lg:col-span-2">
            <SpeakingCard
              topicsToday={log.randomSpeaking}
              onTopicComplete={() =>
                updateLog({ ...log, randomSpeaking: log.randomSpeaking + 1 })
              }
            />
          </div>
        </section>

        {/* Curriculum */}
        <section id="curriculum" className="mb-8">
          <CurriculumTracker
            progress={progress}
            onChange={setProgress}
            onVideoComplete={handleVideoComplete}
          />
        </section>

        {/* Topic-level DSA confidence */}
        <section id="dsa" className="mb-10">
          <DsaProgressCard
            data={state.dsa}
            onChange={(next) => setState((s) => ({ ...s, dsa: next }))}
          />
        </section>

        <footer className="pb-10 text-center">
          <p className="font-display text-sm italic text-muted-foreground sm:text-base">
            "3.5 LPA was the start. Consistency is the upgrade."
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
