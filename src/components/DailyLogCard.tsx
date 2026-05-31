import { CHALISA_TARGET, DailyLogRow, NAAM_TARGET, dayStatus } from "@/lib/dailyLog";
import { CheckBox } from "./CheckBox";
import { AlertTriangle, Flame, XCircle, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomLogField, useCustomLogFields } from "@/hooks/useCustomLogFields";
import { CustomizeLogModal } from "./CustomizeLogModal";
import { useState } from "react";

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
  value, onChange, suffix, disabled, wide,
}: { value: number; onChange: (n: number) => void; suffix?: string; disabled?: boolean; wide?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={0}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={cn(
          "h-8 rounded-md border border-input bg-background px-2 text-right text-sm focus:border-primary focus:outline-none disabled:opacity-60",
          wide ? "w-20" : "w-16"
        )}
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

function ProgressInput({
  value, onChange, target, disabled, suffix,
}: { value: number; onChange: (n: number) => void; target: number; disabled?: boolean; suffix?: string }) {
  const pct = Math.min(100, (value / target) * 100);
  const reached = value >= target;
  return (
    <div className="flex flex-col items-end gap-1">
      <NumInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        wide
        suffix={suffix ?? `/ ${target}`}
      />
      <div className="h-1 w-28 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", reached ? "bg-success" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DailyLogCard({ log, onChange, readOnly, dateLabel }: Props) {
  const update = <K extends keyof DailyLogRow>(k: K, v: DailyLogRow[K]) => onChange({ ...log, [k]: v });
  const { grouped: customGrouped, fields: customFields } = useCustomLogFields();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const customVals = log.custom_values ?? {};
  const updateCustomVal = (key: string, val: boolean | number | string) => {
    onChange({ ...log, custom_values: { ...customVals, [key]: val } });
  };

  const label =
    dateLabel ??
    new Date(log.log_date + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const sectionEmojis: Record<string, string> = {
    Learning: "📚",
    Sadhana: "🕉",
    Discipline: "🛕",
    Speaking: "🎤",
    Fitness: "💪",
    Focus: "🚫",
    Custom: "⭐",
  };

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          {readOnly ? "Day Log" : "Today's Log"} — {label}
        </h2>
        <div className="flex items-center gap-2">
          <StatusPill log={log} />
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setCustomizeOpen(true)} className="gap-1.5 text-xs">
              <Settings2 className="h-3.5 w-3.5" /> Customize
            </Button>
          )}
        </div>
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
            <ProgressInput
              value={log.naam_jap_count}
              onChange={(n) => onChange({ ...log, naam_jap_count: n, naam_jap_done: n >= NAAM_TARGET ? true : log.naam_jap_done })}
              target={NAAM_TARGET}
              disabled={readOnly}
              suffix={`/ ${NAAM_TARGET} Ram Ram`}
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
            <ProgressInput
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
              suffix={`/ ${CHALISA_TARGET} paath`}
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
        <Row
          label="Anulom Vilom Pranayama"
          priority="SADHANA"
          checked={log.anulom_vilom}
          onCheck={(v) => update("anulom_vilom", v)}
          disabled={readOnly}
          right={<span className={log.anulom_vilom ? "font-semibold text-success" : "text-muted-foreground"}>{log.anulom_vilom ? "10 min ✓" : "10 min · morning"}</span>}
        />
      </div>

      {/* DISCIPLINE — temple, fasting */}
      <SectionTitle>🛕 Discipline & Devotion</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Hanuman Temple Visit"
          checked={log.temple_visit}
          onCheck={(v) => update("temple_visit", v)}
          disabled={readOnly}
          right={
            <span className={log.temple_visit ? "font-semibold text-success" : "text-muted-foreground"}>
              {log.temple_visit ? "Visited" : "Tue & Sat"}
            </span>
          }
        />
        <Row
          label="Fasting (Vrat)"
          checked={log.fasting}
          onCheck={(v) => update("fasting", v)}
          disabled={readOnly}
          right={
            <span className={log.fasting ? "font-semibold text-success" : "text-muted-foreground"}>
              {log.fasting ? "Observed" : "Saturday"}
            </span>
          }
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
        <Row
          label="Squats"
          checked={log.squats > 0}
          onCheck={(v) => update("squats", v ? Math.max(10, log.squats) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.squats} onChange={(n) => update("squats", n)} suffix="reps" />}
        />
      </div>

      {/* FOCUS & DISTRACTIONS */}
      <SectionTitle>🚫 Focus & Distractions</SectionTitle>
      <div className="divide-y divide-border/60">
        <Row
          label="Deep Work Blocks (25 min)"
          priority="HIGH"
          checked={log.deep_work_blocks > 0}
          onCheck={(v) => update("deep_work_blocks", v ? Math.max(1, log.deep_work_blocks) : 0)}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.deep_work_blocks} onChange={(n) => update("deep_work_blocks", n)} suffix="blocks" />}
        />
        <Row
          label="Instagram Time"
          checked={log.instagram_minutes === 0}
          onCheck={(v) => update("instagram_minutes", v ? 0 : Math.max(1, log.instagram_minutes))}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.instagram_minutes} onChange={(n) => update("instagram_minutes", n)} suffix="min" />}
        />
        <Row
          label="YouTube (non-learning)"
          checked={log.youtube_minutes === 0}
          onCheck={(v) => update("youtube_minutes", v ? 0 : Math.max(1, log.youtube_minutes))}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.youtube_minutes} onChange={(n) => update("youtube_minutes", n)} suffix="min" />}
        />
        <Row
          label="Phone pickups before 10am"
          checked={log.phone_pickups === 0}
          onCheck={(v) => update("phone_pickups", v ? 0 : Math.max(1, log.phone_pickups))}
          disabled={readOnly}
          right={<NumInput disabled={readOnly} value={log.phone_pickups} onChange={(n) => update("phone_pickups", n)} suffix="times" />}
        />
      </div>

      {/* Custom fields — grouped by section */}
      {customFields.length > 0 && Object.entries(customGrouped).map(([section, fields]) => (
        <div key={section}>
          <SectionTitle>{sectionEmojis[section] || "⭐"} {section}</SectionTitle>
          <div className="divide-y divide-border/60">
            {fields.map((f) => {
              const val = customVals[f.field_key];
              if (f.field_type === "checkbox") {
                const checked = Boolean(val);
                return (
                  <Row
                    key={f.field_key}
                    label={f.label}
                    priority={f.priority as keyof typeof PRIORITY ?? undefined}
                    checked={checked}
                    onCheck={(v) => updateCustomVal(f.field_key, v)}
                    disabled={readOnly}
                    right={<span className={checked ? "font-semibold text-success" : "text-muted-foreground"}>{checked ? "Done" : "—"}</span>}
                  />
                );
              }
              if (f.field_type === "number") {
                const numVal = typeof val === "number" ? val : 0;
                const hasTarget = f.target && f.target > 0;
                return (
                  <Row
                    key={f.field_key}
                    label={f.label}
                    priority={f.priority as keyof typeof PRIORITY ?? undefined}
                    checked={hasTarget ? numVal >= (f.target ?? 0) : numVal > 0}
                    onCheck={(v) => updateCustomVal(f.field_key, v ? Math.max(1, numVal) : 0)}
                    disabled={readOnly}
                    right={
                      hasTarget ? (
                        <ProgressInput
                          value={numVal}
                          onChange={(n) => updateCustomVal(f.field_key, n)}
                          target={f.target!}
                          disabled={readOnly}
                          suffix={f.unit ? `/ ${f.target} ${f.unit}` : `/ ${f.target}`}
                        />
                      ) : (
                        <NumInput disabled={readOnly} value={numVal} onChange={(n) => updateCustomVal(f.field_key, n)} suffix={f.unit || undefined} />
                      )
                    }
                  />
                );
              }
              // text type
              const textVal = typeof val === "string" ? val : "";
              return (
                <div key={f.field_key} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="font-medium text-foreground">{f.label}</span>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={textVal}
                    onChange={(e) => updateCustomVal(f.field_key, e.target.value)}
                    placeholder={`Enter ${f.label.toLowerCase()}…`}
                    className="h-8 w-48 rounded-md border border-input bg-background px-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <textarea
        placeholder="What I learned today (React notes, insights)..."
        value={log.notes || ""}
        disabled={readOnly}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        className="mt-5 w-full resize-none rounded-lg border border-input bg-background/60 p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-70"
      />

      <CustomizeLogModal open={customizeOpen} onClose={() => setCustomizeOpen(false)} />
    </div>
  );
}
