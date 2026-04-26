import { CHALISA_TARGET, DailyLogRow, NAAM_TARGET, dayStatus } from "@/lib/dailyLog";
import { CheckBox } from "./CheckBox";
import { AlertTriangle, Flame, Minus, Plus, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  log: DailyLogRow;
  onChange: (next: DailyLogRow) => void;
  readOnly?: boolean;
  dateLabel?: string;
}

const PRIORITY = {
  HIGH: "bg-primary/15 text-primary",
  SADHANA: "bg-warning/15 text-warning",
} as const;

function StatusPill({ log }: { log: DailyLogRow }) {
  const status = dayStatus(log);
  if (status === "productive")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
        <Flame className="h-3.5 w-3.5" /> Productive Day
      </span>
    );
  if (status === "average")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
        <AlertTriangle className="h-3.5 w-3.5" /> Average Day
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
      <XCircle className="h-3.5 w-3.5" /> Missed Discipline
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground first:mt-0">
      {children}
    </h3>
  );
}

interface RowProps {
  label: string;
  priority?: keyof typeof PRIORITY;
  checked: boolean;
  onCheck: (v: boolean) => void;
  right?: React.ReactNode;
  disabled?: boolean;
}
function Row({ label, priority, checked, onCheck, right, disabled }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-3">
        <CheckBox checked={checked} onChange={disabled ? () => {} : onCheck} label={label} />
        <span className="font-medium text-foreground">{label}</span>
        {priority && (
          <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider", PRIORITY[priority])}>
            {priority}
          </span>
        )}
      </div>
      <div className="text-sm">{right}</div>
    </div>
  );
}

function NumInput({
  value, onChange, suffix, disabled,
}: { value: number; onChange: (n: number) => void; suffix?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={0}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-right text-sm focus:border-primary focus:outline-none disabled:opacity-60"
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

function Counter({
  value, onChange, target, disabled,
}: { value: number; onChange: (n: number) => void; target: number; disabled?: boolean }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button" size="icon" variant="outline" disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-7 w-7"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <div className="flex w-24 flex-col items-center">
        <span className="font-display text-sm font-bold tabular-nums text-foreground">
          {value}
          <span className="text-muted-foreground">/{target}</span>
        </span>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              value >= target ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <Button
        type="button" size="icon" variant="outline" disabled={disabled}
        onClick={() => onChange(value + 1)}
        className="h-7 w-7"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function DailyLogCard({ log, onChange, readOnly, dateLabel }: Props) {
  const update = <K extends keyof DailyLogRow>(k: K, v: DailyLogRow[K]) => onChange({ ...log, [k]: v });

  const label =
    dateLabel ??
    new Date(log.log_date + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          {readOnly ? "Day Log" : "Today's Log"} — {label}
        </h2>
        <StatusPill log={log} />
      </div>

      {/* SADHANA — naam jap, chalisa, meditation */}
      <SectionTitle>🕉 Sadhana</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Naam Jap (Ram Ram)"
          priority="SADHANA"
          checked={log.naam_jap_done || log.naam_jap_count >= NAAM_TARGET}
          onCheck={(v) => update("naam_jap_done", v)}
          disabled={readOnly}
          right={
            <Counter
              value={log.naam_jap_count}
              onChange={(n) => onChange({ ...log, naam_jap_count: n, naam_jap_done: n >= NAAM_TARGET ? true : log.naam_jap_done })}
              target={NAAM_TARGET}
              disabled={readOnly}
            />
          }
        />
        <Row
          label="Hanuman Chalisa"
          priority="SADHANA"
          checked={log.hanuman_chalisa_done || log.hanuman_chalisa_count >= CHALISA_TARGET}
          onCheck={(v) => update("hanuman_chalisa_done", v)}
          disabled={readOnly}
          right={
            <Counter
              value={log.hanuman_chalisa_count}
              onChange={(n) =>
                onChange({
                  ...log,
                  hanuman_chalisa_count: n,
                  hanuman_chalisa_done: n >= CHALISA_TARGET ? true : log.hanuman_chalisa_done,
                })
              }
              target={CHALISA_TARGET}
              disabled={readOnly}
            />
          }
        />
        <Row
          label="Meditation"
          checked={log.meditation}
          onCheck={(v) => update("meditation", v)}
          disabled={readOnly}
          right={<span className={log.meditation ? "font-semibold text-success" : "text-muted-foreground"}>{log.meditation ? "Done" : "—"}</span>}
        />
      </div>

      {/* LEARNING */}
      <SectionTitle>📚 Learning</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Revision"
          priority="HIGH"
          checked={log.revision}
          onCheck={(v) => update("revision", v)}
          disabled={readOnly}
          right={<span className={log.revision ? "font-semibold text-success" : "text-muted-foreground"}>{log.revision ? "Done" : "Pending"}</span>}
        />
        <Row
          label="DSA Problems"
          checked={log.dsa_problems > 0}
          onCheck={(v) => update("dsa_problems", v ? Math.max(1, log.dsa_problems) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.dsa_problems} onChange={(n) => update("dsa_problems", n)} suffix="solved" />}
        />
        <Row
          label="Videos Watched"
          checked={log.videos_today > 0}
          onCheck={(v) => update("videos_today", v ? Math.max(1, log.videos_today) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.videos_today} onChange={(n) => update("videos_today", n)} suffix="/ 2" />}
        />
        <Row
          label="React Learning"
          checked={log.react_learning}
          onCheck={(v) => update("react_learning", v)}
          disabled={readOnly}
          right={<span className={log.react_learning ? "font-semibold text-success" : "text-destructive"}>{log.react_learning ? "Done" : "Missed"}</span>}
        />
      </div>

      {/* SPEAKING */}
      <SectionTitle>🎤 Speaking</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Mirror Speaking"
          priority="HIGH"
          checked={log.mirror_speaking}
          onCheck={(v) => update("mirror_speaking", v)}
          disabled={readOnly}
          right={<span className={log.mirror_speaking ? "font-semibold text-success" : "text-muted-foreground"}>{log.mirror_speaking ? "Done" : "Pending"}</span>}
        />
        <Row
          label="JAM Speaking"
          checked={log.jam_speaking}
          onCheck={(v) => update("jam_speaking", v)}
          disabled={readOnly}
          right={<span className={log.jam_speaking ? "font-semibold text-success" : "text-warning"}>{log.jam_speaking ? "Done" : "Pending"}</span>}
        />
        <Row
          label="1-Minute Random Topics"
          checked={log.random_speaking > 0}
          onCheck={(v) => update("random_speaking", v ? Math.max(1, log.random_speaking) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.random_speaking} onChange={(n) => update("random_speaking", n)} suffix="topics" />}
        />
      </div>

      {/* FITNESS */}
      <SectionTitle>💪 Fitness</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Pushups"
          checked={log.pushups > 0}
          onCheck={(v) => update("pushups", v ? Math.max(10, log.pushups) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.pushups} onChange={(n) => update("pushups", n)} suffix="reps" />}
        />
        <Row
          label="Pullups"
          checked={log.pullups > 0}
          onCheck={(v) => update("pullups", v ? Math.max(1, log.pullups) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.pullups} onChange={(n) => update("pullups", n)} suffix="reps" />}
        />
      </div>

      <textarea
        placeholder="What I learned today (React notes, insights)..."
        value={log.notes || ""}
        disabled={readOnly}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        className="mt-5 w-full resize-none rounded-lg border border-input bg-background/60 p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-70"
      />
    </div>
  );
}
