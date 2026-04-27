import vision from "@/assets/goal-vision.png";
import bullet from "@/assets/goal-bullet.png";
import { Home, Bike, Briefcase, Heart } from "lucide-react";

const GOALS = [
  { icon: Home, label: "Dream Home", note: "Built for family • Jai Shree Ram 🚩" },
  { icon: Briefcase, label: "9–15 LPA Role", note: "Beyond TCS 3.5 — product company" },
  { icon: Bike, label: "Royal Enfield Bullet 350", note: "Battalion Black • earned, not gifted" },
  { icon: Heart, label: "Top 1% Physique & Speech", note: "Daily reps. Daily mirror. No excuses." },
];

export function GoalVision() {
  return (
    <section className="surface-card overflow-hidden p-0">
      {/* Goals first */}
      <div className="p-6 lg:p-8">
        <div className="mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            My Why
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground lg:text-3xl">
            The life I'm building.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every Naam Jap, every video, every pushup — moves me one step closer.
          </p>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map(({ icon: Icon, label, note }) => (
            <li key={label} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Images under goals — full image, no cropping */}
      <div className="border-t border-border bg-background/40 p-3 sm:p-4 lg:p-5">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <img
            src={vision}
            alt="Dream home with Hanuman ji, TCS, bike and Jai Shree Ram"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_2fr]">
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <img
              src={bullet}
              alt="Royal Enfield Bullet 350 Battalion Black"
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="flex items-center rounded-lg border border-warning/30 bg-warning/10 p-4">
            <p className="text-sm text-foreground">
              <span className="font-bold text-warning">Reward unlock:</span> Bullet 350 once 8 LPA offer is signed. ॥ जय श्री राम ॥
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
