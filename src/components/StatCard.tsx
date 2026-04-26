import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: boolean;
  icon?: ReactNode;
}

export function StatCard({ label, value, hint, accent, icon }: StatCardProps) {
  return (
    <div
      className={cn(
        "surface-card relative overflow-hidden p-6 transition hover:border-primary/40",
        accent && "border-l-4 border-l-primary"
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 flex items-end gap-2">
        {icon && <div className="mb-2 text-primary">{icon}</div>}
        <div className="stat-number text-foreground">{value}</div>
      </div>
      {hint && <div className="mt-2 text-sm text-muted-foreground">{hint}</div>}
    </div>
  );
}
