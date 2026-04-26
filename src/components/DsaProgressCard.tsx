import { DsaProgress } from "@/lib/tracker";

interface Props {
  data: DsaProgress;
  onChange: (next: DsaProgress) => void;
}

function colorForPct(p: number) {
  if (p >= 80) return "hsl(var(--success))";
  if (p >= 50) return "hsl(var(--primary))";
  if (p >= 25) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function DsaProgressCard({ data, onChange }: Props) {
  const topics = Object.keys(data);
  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">DSA Progress — Python</h2>
        <span className="text-xs text-muted-foreground">Drag to adjust</span>
      </div>
      <div className="space-y-4">
        {topics.map((t) => {
          const pct = data[t];
          return (
            <div key={t} className="grid grid-cols-[120px_1fr_44px] items-center gap-4 sm:grid-cols-[160px_1fr_44px]">
              <span className="text-sm font-medium text-foreground">{t}</span>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: colorForPct(pct) }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pct}
                  onChange={(e) => onChange({ ...data, [t]: parseInt(e.target.value) })}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label={`${t} progress`}
                />
              </div>
              <span className="text-right text-xs font-semibold text-muted-foreground tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
