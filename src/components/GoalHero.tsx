import { Target, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

interface Props {
  onEdit: () => void;
}

export function GoalHero({ onEdit }: Props) {
  const { profile } = useProfile();
  const goal = profile?.goal_title;
  const desc = profile?.goal_description;
  const img = profile?.goal_image_url;
  const name = profile?.display_name || "Champion";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
      <div className="absolute inset-0">
        {img ? (
          <img src={img} alt="Your goal" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-card to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
      </div>

      <div className="relative p-5 sm:p-8 lg:p-10">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          <Target className="h-3.5 w-3.5" /> Your North Star
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold leading-[1.15] text-foreground sm:text-4xl lg:text-5xl">
          Hey {name},
          <br />
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {goal || "Set your big goal to begin."}
          </span>
        </h1>
        {desc && (
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">{desc}</p>
        )}
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> {goal ? "Edit goal" : "Set goal"}
          </Button>
        </div>
      </div>
    </section>
  );
}
