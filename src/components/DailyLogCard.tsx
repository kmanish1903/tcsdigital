import { DayLog, dayStatus } from "@/lib/tracker";
import { CheckBox } from "./CheckBox";
import { AlertTriangle, Flame, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  log: DayLog;
  onChange: (next: DayLog) => void;
}

const PRIORITY = {
  HIGH: "bg-primary/15 text-primary",
} as const;

function StatusPill({ log }: { log: DayLog }) {
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

interface RowProps {
  label: string;
  priority?: "HIGH";
  checked: boolean;
  onCheck: (v: boolean) => void;
  right?: React.ReactNode;
}
function Row({ label, priority, checked, onCheck, right }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-3">
        <CheckBox checked={checked} onChange={onCheck} label={label} />
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

function NumInput({ value, onChange, suffix }: { value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-right text-sm focus:border-primary focus:outline-none"
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function DailyLogCard({ log, onChange }: Props) {
  const update = <K extends keyof DayLog>(k: K, v: DayLog[K]) => onChange({ ...log, [k]: v });
  const dateLabel = new Date(log.date + "T00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="surface-card p-6 lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Today's Log — {dateLabel}</h2>
      </div>

      <div className="divide-y divide-border/60">
        <Row
          label="Revision"
          priority="HIGH"
          checked={log.revision}
          onCheck={(v) => update("revision", v)}
          right={<span className={log.revision ? "font-semibold text-success" : "text-muted-foreground"}>{log.revision ? "Done" : "Pending"}</span>}
        />
        <Row
          label="Mirror Speaking"
          priority="HIGH"
          checked={log.mirrorSpeaking}
          onCheck={(v) => update("mirrorSpeaking", v)}
          right={<span className={log.mirrorSpeaking ? "font-semibold text-success" : "text-muted-foreground"}>{log.mirrorSpeaking ? "Done" : "Pending"}</span>}
        />
        <Row
          label="DSA Problems"
          checked={log.dsaProblems > 0}
          onCheck={(v) => update("dsaProblems", v ? Math.max(1, log.dsaProblems) : 0)}
          right={
            <div className="flex items-center gap-2">
              <NumInput value={log.dsaProblems} onChange={(n) => update("dsaProblems", n)} suffix="solved" />
            </div>
          }
        />
        <Row
          label="JAM Speaking"
          checked={log.jamSpeaking}
          onCheck={(v) => update("jamSpeaking", v)}
          right={<span className={log.jamSpeaking ? "font-semibold text-success" : "text-warning"}>{log.jamSpeaking ? "Done" : "Pending"}</span>}
        />
        <Row
          label="React Learning"
          checked={log.reactLearning}
          onCheck={(v) => update("reactLearning", v)}
          right={<span className={log.reactLearning ? "font-semibold text-success" : "text-destructive"}>{log.reactLearning ? "Done" : "Missed"}</span>}
        />
        <Row
          label="Pushups"
          checked={log.pushups > 0}
          onCheck={(v) => update("pushups", v ? Math.max(10, log.pushups) : 0)}
          right={<NumInput value={log.pushups} onChange={(n) => update("pushups", n)} suffix="reps" />}
        />
        <Row
          label="Pullups"
          checked={log.pullups > 0}
          onCheck={(v) => update("pullups", v ? Math.max(1, log.pullups) : 0)}
          right={<NumInput value={log.pullups} onChange={(n) => update("pullups", n)} suffix="reps" />}
        />
        <Row
          label="Meditation"
          checked={log.meditation}
          onCheck={(v) => update("meditation", v)}
          right={<span className={log.meditation ? "font-semibold text-success" : "text-muted-foreground"}>{log.meditation ? "Done" : "—"}</span>}
        />
        <Row
          label="Hanuman Chalisa"
          checked={log.hanumanChalisa}
          onCheck={(v) => update("hanumanChalisa", v)}
          right={<span className={log.hanumanChalisa ? "font-semibold text-success" : "text-muted-foreground"}>{log.hanumanChalisa ? "Done" : "—"}</span>}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
        <span className="text-sm text-muted-foreground">Today's status</span>
        <StatusPill log={log} />
      </div>

      <textarea
        placeholder="What I learned today (React notes, insights)..."
        value={log.notes || ""}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        className="mt-4 w-full resize-none rounded-lg border border-input bg-background/60 p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}
