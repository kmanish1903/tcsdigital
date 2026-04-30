import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BrahmacharyaJourney, BrahmacharyaDay, currentPhase } from "@/lib/brahmacharya";
import { todayISO } from "@/lib/dailyLog";

export function useBrahmacharya() {
  const { user } = useAuth();
  const [journey, setJourney] = useState<BrahmacharyaJourney | null>(null);
  const [days, setDays] = useState<Record<string, BrahmacharyaDay>>({});
  const [loading, setLoading] = useState(true);

  // Load journey + days
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      const [{ data: jData }, { data: dData }] = await Promise.all([
        supabase.from("brahmacharya_journey").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("brahmacharya_days").select("*").eq("user_id", user.id),
      ]);
      if (!mounted) return;
      setJourney((jData as BrahmacharyaJourney) || null);
      const map: Record<string, BrahmacharyaDay> = {};
      (dData || []).forEach((r: any) => { map[r.log_date] = r; });
      setDays(map);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [user]);

  // Start journey today
  const startJourney = useCallback(async () => {
    if (!user) return;
    const payload = {
      user_id: user.id,
      started_on: todayISO(),
      current_phase: 1,
      phase1_target: 30,
      phase2_target: 45,
      current_streak: 0,
      best_streak: 0,
      total_clean_days: 0,
      total_slips: 0,
    };
    const { data, error } = await supabase
      .from("brahmacharya_journey")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .maybeSingle();
    if (error) { console.error(error); return; }
    setJourney(data as BrahmacharyaJourney);
  }, [user]);

  // Mark day status
  const markDay = useCallback(async (status: "clean" | "slip" | "urge_channeled", notes?: string) => {
    if (!user || !journey) return;
    const log_date = todayISO();
    const { data, error } = await supabase
      .from("brahmacharya_days")
      .upsert({ user_id: user.id, log_date, status, notes: notes || null }, { onConflict: "user_id,log_date" })
      .select()
      .maybeSingle();
    if (error) { console.error(error); return; }
    if (data) {
      setDays((prev) => ({ ...prev, [log_date]: data as BrahmacharyaDay }));
    }

    // Recompute streaks from days set
    const newDays = { ...days, [log_date]: data as BrahmacharyaDay };
    let streak = 0;
    const d = new Date();
    for (;;) {
      const iso = d.toISOString().slice(0, 10);
      const day = newDays[iso];
      if (!day) break;
      if (day.status === "slip") break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    const cleanCount = Object.values(newDays).filter((x) => x.status !== "slip").length;
    const slipCount = Object.values(newDays).filter((x) => x.status === "slip").length;
    const best = Math.max(journey.best_streak || 0, streak);
    const phase = currentPhase(streak);

    const { data: jData } = await supabase
      .from("brahmacharya_journey")
      .update({
        current_streak: streak,
        best_streak: best,
        total_clean_days: cleanCount,
        total_slips: slipCount,
        current_phase: phase,
      })
      .eq("user_id", user.id)
      .select()
      .maybeSingle();
    if (jData) setJourney(jData as BrahmacharyaJourney);
  }, [user, journey, days]);

  const todayStatus = days[todayISO()]?.status || null;

  return { journey, days, loading, startJourney, markDay, todayStatus };
}
