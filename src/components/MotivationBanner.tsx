import { TrendingUp, Sparkles } from "lucide-react";

interface Props {
  videosToday: number;
  target?: number;
}

export function MotivationBanner({ videosToday, target = 2 }: Props) {
  const remaining = Math.max(0, target - videosToday);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-hero p-5 text-primary-foreground shadow-glow sm:p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 opacity-90" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
              3.5 LPA → next chapter
            </p>
            <h2 className="mt-1 font-display text-lg font-bold leading-snug sm:text-xl">
              You already cracked TCS. Now level up — aim for 9–15 LPA product roles.
            </h2>
            <p className="mt-1 text-xs opacity-90 sm:text-sm">
              Two videos every single day. No skips. Compound effort beats raw talent.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3 backdrop-blur sm:flex-col sm:items-end">
          <TrendingUp className="h-5 w-5 sm:hidden" />
          <div className="text-right">
            <div className="font-display text-3xl font-bold tabular-nums leading-none">
              {videosToday}<span className="opacity-60">/{target}</span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wider opacity-80">
              videos today
            </p>
          </div>
          <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-white/20 sm:block">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, (videosToday / target) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      {remaining > 0 ? (
        <p className="relative mt-3 text-xs font-medium opacity-95">
          🎯 {remaining} more video{remaining > 1 ? "s" : ""} to hit today's target.
        </p>
      ) : (
        <p className="relative mt-3 text-xs font-semibold">
          🔥 Daily target smashed. Bonus videos = bonus offers.
        </p>
      )}
    </div>
  );
}
