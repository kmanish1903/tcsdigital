import { useEffect, useMemo, useState } from "react";
import { Flame, Download, Target, Trophy, LogOut, BarChart3, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { DailyLogCard } from "@/components/DailyLogCard";
import { SpeakingCard } from "@/components/SpeakingCard";
import { DsaProgressCard } from "@/components/DsaProgressCard";
import { CurriculumTracker } from "@/components/CurriculumTracker";
import { MotivationHero } from "@/components/MotivationHero";
import { GoalVision } from "@/components/GoalVision";
import { GoalHero } from "@/components/GoalHero";
import { GoalOnboarding } from "@/components/GoalOnboarding";
import { WeeklyChart } from "@/components/WeeklyChart";
import { HabitHeatmap } from "@/components/HabitHeatmap";
import { AiReflectionCoach } from "@/components/AiReflectionCoach";
import { CalendarNav } from "@/components/CalendarNav";
import { DailyChallengeCard } from "@/components/DailyChallengeCard";
import { TodayScoreBar } from "@/components/TodayScoreBar";
import { MorningNightChallenge } from "@/components/MorningNightChallenge";
import { PersonalMotivation } from "@/components/PersonalMotivation";
import { BrahmacharyaTile } from "@/components/BrahmacharyaTile";
import { SixPillarsGrid } from "@/components/SixPillarsGrid";
import { HanumanCoachChat } from "@/components/HanumanCoachChat";
import { InstallPrompt } from "@/components/InstallPrompt";
import { CoreDailyFocus } from "@/components/CoreDailyFocus";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAllDailyLogs, useCurriculumProgress, useDailyLog } from "@/hooks/useDailyLog";
import { dateToISO, dayStatus, todayISO } from "@/lib/dailyLog";
import {
  CURRICULUM, completedVideos, overallPct, totalVideos,
} from "@/lib/curriculum";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, isOwner } = useProfile();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [goalOpen, setGoalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dateISO = dateToISO(selectedDate);
  const today = todayISO();

  const { logs, loading: logsLoading, upsertLocal } = useAllDailyLogs();
  const { log, setLog, saving } = useDailyLog(dateISO, upsertLocal);
  const { progress, setVideo } = useCurriculumProgress();

  // Auto-open goal onboarding for non-owner users without a goal
  useEffect(() => {
    if (profileLoading || isOwner) return;
    if (profile && !profile.goal_title) setGoalOpen(true);
  }, [profile, profileLoading, isOwner]);

  // Daily reminder
  useEffect(() => {
    const flag = sessionStorage.getItem("preptrack_reminded");
    if (!flag) {
      setTimeout(() => {
        toast("👋 Daily reminder", {
          description: isOwner ? "108 Naam Jap, 3 Chalisa, 2 videos. Lock in." : "Log your day. Stay consistent.",
        });
        sessionStorage.setItem("preptrack_reminded", "1");
      }, 1200);
    }
  }, [isOwner]);

  const stats = useMemo(() => {
    const all = Object.values(logs);
    const days = all.length;
    const dsa = all.reduce((a, l) => a + (l.dsa_problems || 0), 0);
    const speakDays = all.filter((l) => l.mirror_speaking || l.jam_speaking || l.random_speaking > 0).length;
    const speak = days ? Math.round((speakDays / days) * 100) : 0;
    let streak = 0;
    const d = new Date();
    for (;;) {
      const iso = dateToISO(d);
      const l = logs[iso];
      if (!l || dayStatus(l) === "missed") break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return { days, dsa, speak, streak };
  }, [logs]);

  const curriculumDone = completedVideos(progress);
  const curriculumTotal = totalVideos();
  const curriculumPct = overallPct(progress);

  const handleExport = () => {
    const headers = [
      "date","naam_jap","chalisa","meditation","dsa","revision","react","videos","mirror","jam","random_topics","pushups","pullups","status","notes",
    ];
    const rows = Object.values(logs)
      .sort((a, b) => a.log_date.localeCompare(b.log_date))
      .map((l) => [
        l.log_date, l.naam_jap_count, l.hanuman_chalisa_count, l.meditation,
        l.dsa_problems, l.revision, l.react_learning, l.videos_today,
        l.mirror_speaking, l.jam_speaking, l.random_speaking, l.pushups, l.pullups,
        dayStatus(l), JSON.stringify(l.notes || ""),
      ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `preptrack-${today}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  const navItems = (
    <>
      <a className="text-primary" href="#dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</a>
      <a className="text-muted-foreground transition hover:text-foreground" href="#log" onClick={() => setMobileNavOpen(false)}>Daily Log</a>
      {isOwner && (
        <a className="text-muted-foreground transition hover:text-foreground" href="#curriculum" onClick={() => setMobileNavOpen(false)}>Curriculum</a>
      )}
      <button onClick={() => { navigate("/weekly"); setMobileNavOpen(false); }} className="text-left text-muted-foreground transition hover:text-foreground">Weekly</button>
      <button onClick={() => { navigate("/history"); setMobileNavOpen(false); }} className="text-left text-muted-foreground transition hover:text-foreground">History</button>
      <button onClick={() => { navigate("/academy"); setMobileNavOpen(false); }} className="text-left text-muted-foreground transition hover:text-foreground">Academy</button>
      <button onClick={() => { navigate("/plans"); setMobileNavOpen(false); }} className="text-left text-muted-foreground transition hover:text-foreground">Plans</button>
      <button onClick={() => { setGoalOpen(true); setMobileNavOpen(false); }} className="text-left text-muted-foreground transition hover:text-foreground">My Goal</button>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 lg:gap-8 min-w-0">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Prep<span className="text-primary">Track</span>
            </h1>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              {navItems}
            </nav>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden text-xs text-muted-foreground lg:inline truncate max-w-[160px]">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden gap-1.5 sm:flex">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            {/* Mobile menu */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="mt-8 flex flex-col gap-4 text-base font-medium">
                  {navItems}
                  <Button variant="outline" size="sm" onClick={handleExport} className="mt-3 gap-1.5">
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Hero — owner gets TCS hero, others get their personal goal */}
        <div className="mb-6">
          {isOwner ? (
            <MotivationHero videosToday={log.videos_today} target={2} dateISO={today} />
          ) : (
            <GoalHero onEdit={() => setGoalOpen(true)} />
          )}
        </div>

        {/* Owner-only personal modules */}
        {isOwner && (
          <>
            <div className="mb-6"><BrahmacharyaTile /></div>
            <div className="mb-6"><TodayScoreBar log={log} streak={stats.streak} /></div>
            <div className="mb-6"><MorningNightChallenge /></div>
            <div className="mb-6"><CoreDailyFocus /></div>
            <div className="mb-6"><PersonalMotivation /></div>
            <div className="mb-6"><SixPillarsGrid log={log} onChange={setLog} /></div>
          </>
        )}

        {/* Power trio: AI Coach + Daily Challenges + 1-Min Speaking (everyone) */}
        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <AiReflectionCoach dateISO={dateISO} log={log} />
          <DailyChallengeCard />
          <SpeakingCard
            topicsToday={log.random_speaking}
            onTopicComplete={() =>
              setLog({ ...log, random_speaking: log.random_speaking + 1 })
            }
          />
        </section>

        {/* Owner-only "why I grind" */}
        {isOwner && (
          <>
            <div className="mb-6"><GoalVision /></div>
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Sadhana first</strong> (Naam Jap 108, Chalisa 3, Meditation), then{" "}
                <strong className="text-foreground">Revision + Mirror Speaking + 2 videos</strong>. That's the recipe.
              </p>
            </div>
          </>
        )}

        {/* Stats */}
        <section id="dashboard" className="mb-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Days Tracked" value={stats.days} hint="In Lovable Cloud" accent />
          {isOwner && (
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
          )}
          {isOwner && <StatCard label="DSA Solved" value={stats.dsa} hint="Problems total" />}
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

        {/* Calendar nav */}
        <div className="mb-4">
          <CalendarNav selected={selectedDate} onChange={setSelectedDate} logs={logs} />
        </div>

        {/* Weekly chart preview */}
        <section className="mb-8">
          <WeeklyChart logs={logs} />
          <div className="mt-3 text-right">
            <Button variant="ghost" size="sm" onClick={() => navigate("/weekly")} className="gap-1.5 text-xs">
              <BarChart3 className="h-3.5 w-3.5" /> Open weekly progress
            </Button>
          </div>
        </section>

        {/* Consistency heatmap */}
        <section className="mb-8">
          <HabitHeatmap logs={logs} />
        </section>

        {/* Daily log — everyone */}
        <section id="log" className="mb-8">
          <DailyLogCard log={log} onChange={setLog} />
          {saving && <p className="mt-2 text-xs text-muted-foreground">Saving…</p>}
        </section>

        {/* Curriculum + DSA — owner only */}
        {isOwner && (
          <>
            <section id="curriculum" className="mb-8">
              <CurriculumTracker
                progress={progress}
                onSetVideo={setVideo}
                onVideoComplete={() => {
                  setLog({ ...log, videos_today: log.videos_today + 1 });
                  toast.success("Video completed 🎬", { description: "Keep stacking. 8+ LPA loading." });
                }}
              />
            </section>

            <section id="dsa" className="mb-10">
              <DsaProgressCard
                data={{
                  Arrays: 90, Strings: 70, "Sliding Window": 50, "Stack & Queue": 30, "Linked List": 15,
                }}
                onChange={() => {}}
              />
            </section>
          </>
        )}

        <footer className="pb-10 text-center">
          <p className="font-display text-sm italic text-muted-foreground sm:text-base">
            {isOwner
              ? "\"3.5 LPA was the start. Consistency is the upgrade.\""
              : "\"Small steps, every day. That's the whole game.\""}
          </p>
        </footer>
      </div>

      {/* Floating Hanuman / AI Coach — everyone */}
      <HanumanCoachChat context={{ log, streak: stats.streak, date: dateISO }} />

      {/* Install-as-app prompt */}
      <InstallPrompt />

      {/* Goal onboarding modal */}
      <GoalOnboarding open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  );
};

export default Index;
