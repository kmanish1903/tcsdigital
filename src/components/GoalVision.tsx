import vision from "@/assets/goal-vision.png";
import bullet from "@/assets/goal-bullet.png";
import { Home, Bike, Briefcase, Heart } from "lucide-react";

const GOALS = [
  { icon: Home, label: "Dream Home", note: "Built for family • Jai Shree Ram 🚩" },
  { icon: Briefcase, label: "8–15 LPA Role", note: "Beyond TCS 3.5 — product company" },
  { icon: Bike, label: "Royal Enfield Bullet 350", note: "Battalion Black • earned, not gifted" },
  { icon: Heart, label: "Top 1% Physique & Speech", note: "Daily reps. Daily mirror. No excuses." },
];

export function GoalVision() {
  return (
    <section className="surface-card overflow-hidden p-0">
      <div className="grid lg:grid-cols-5">
        {/* Image collage */}
        <div className="relative lg:col-span-3">
          <img
            src={vision}
            alt="Dream home with Hanuman ji, TCS, bike and Jai Shree Ram"
            className="h-64 w-full object-cover lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/60" />
          <div className="absolute bottom-3 left-4 rounded-lg bg-background/70 px-3 py-1.5 backdrop-blur">
            <p className="font-display text-xs font-bold tracking-wider text-foreground">
              ॥ जय श्री राम ॥
            </p>
          </div>
        </div>

        {/* Why */}
        <div className="flex flex-col justify-center gap-4 p-6 lg:col-span-2 lg:p-8">
          <div>
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

          <ul className="space-y-2.5">
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

          <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 p-2.5">
            <img src={bullet} alt="Royal Enfield Bullet 350 Battalion Black" className="h-12 w-20 rounded object-cover" />
            <p className="text-xs text-foreground">
              <span className="font-bold text-warning">Reward unlock:</span> Bullet 350 once 8 LPA offer is signed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
