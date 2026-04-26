import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dateToISO, todayISO, DailyLogRow, dayStatus } from "@/lib/dailyLog";

interface Props {
  selected: Date;
  onChange: (d: Date) => void;
  logs: Record<string, DailyLogRow>;
}

export function CalendarNav({ selected, onChange, logs }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const today = todayISO();
  const isToday = dateToISO(selected) === today;

  const shift = (delta: number) => {
    const d = new Date(selected);
    d.setDate(d.getDate() + delta);
    onChange(d);
  };

  // Build modifier sets for the calendar
  const productive: Date[] = [];
  const average: Date[] = [];
  const missed: Date[] = [];
  Object.values(logs).forEach((l) => {
    const d = new Date(l.log_date + "T00:00");
    const s = dayStatus(l);
    if (s === "productive") productive.push(d);
    else if (s === "average") average.push(d);
    else missed.push(d);
  });

  const handlePick = (d: Date | undefined) => {
    if (!d) return;
    setOpen(false);
    const iso = dateToISO(d);
    if (iso === today) {
      onChange(d);
    } else {
      // Navigate to history page for that date
      navigate(`/day/${iso}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous day">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("min-w-[180px] justify-start font-medium")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selected, "EEE, MMM d")}
            {isToday && <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">TODAY</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handlePick}
            modifiers={{ productive, average, missed }}
            modifiersClassNames={{
              productive: "bg-success/20 text-success font-bold",
              average: "bg-warning/20 text-warning font-bold",
              missed: "bg-destructive/15 text-destructive font-bold",
            }}
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="border-t border-border p-3 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Productive</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" /> Average</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive" /> Missed</div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next day"
        disabled={dateToISO(selected) >= today}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isToday && (
        <Button variant="ghost" size="sm" onClick={() => onChange(new Date())} className="text-xs">
          Jump to today
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="ml-auto gap-1.5 text-xs">
        <History className="h-3.5 w-3.5" /> Full history
      </Button>
    </div>
  );
}
