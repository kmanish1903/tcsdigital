import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function CheckBox({ checked, onChange, label }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-label={label}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition",
        checked
          ? "border-success bg-success text-success-foreground shadow-[0_0_0_4px_hsl(var(--success)/0.15)]"
          : "border-border bg-transparent hover:border-primary/60"
      )}
    >
      {checked && <Check className="h-4 w-4" strokeWidth={3} />}
    </button>
  );
}
