import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DailyLogRow, emptyDailyLog } from "@/lib/dailyLog";
import { useAuth } from "@/hooks/useAuth";
import { CURRICULUM, defaultProgress, CurriculumProgress } from "@/lib/curriculum";

// Hook: load all daily logs for the current user
export function useAllDailyLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Record<string, DailyLogRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("log_date", { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.error("logs fetch error", error);
        } else if (data) {
          const map: Record<string, DailyLogRow> = {};
          data.forEach((row: any) => { map[row.log_date] = row as DailyLogRow; });
          setLogs(map);
        }
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [user]);

  // Optimistically merge a single row
  const upsertLocal = (row: DailyLogRow) => {
    setLogs((prev) => ({ ...prev, [row.log_date]: row }));
  };

  return { logs, loading, upsertLocal };
}

// Hook: load/save a single day's log (auto-loads on date change, debounced save)
export function useDailyLog(dateISO: string, onUpsert?: (row: DailyLogRow) => void) {
  const { user } = useAuth();
  const [log, setLog] = useState<DailyLogRow>(() => emptyDailyLog(dateISO));
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  // Reload when date changes
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    setDirty(false);
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", dateISO)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error && error.code !== "PGRST116") {
          console.error("daily log fetch error", error);
        }
        setLog(data ? (data as DailyLogRow) : emptyDailyLog(dateISO));
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [user, dateISO]);

  // Debounced save when log changes
  useEffect(() => {
    if (!user || !dirty || loading) return;
    const t = setTimeout(async () => {
      const payload = {
        user_id: user.id,
        log_date: dateISO,
        naam_jap_count: log.naam_jap_count,
        naam_jap_done: log.naam_jap_done,
        hanuman_chalisa_count: log.hanuman_chalisa_count,
        hanuman_chalisa_done: log.hanuman_chalisa_done,
        meditation: log.meditation,
        dsa_problems: log.dsa_problems,
        revision: log.revision,
        react_learning: log.react_learning,
        videos_today: log.videos_today,
        mirror_speaking: log.mirror_speaking,
        jam_speaking: log.jam_speaking,
        random_speaking: log.random_speaking,
        pushups: log.pushups,
        pullups: log.pullups,
        anulom_vilom: log.anulom_vilom,
        temple_visit: log.temple_visit,
        fasting: log.fasting,
        instagram_minutes: log.instagram_minutes,
        youtube_minutes: log.youtube_minutes,
        phone_pickups: log.phone_pickups,
        deep_work_blocks: log.deep_work_blocks,
        notes: log.notes,
      };
      const { data, error } = await supabase
        .from("daily_logs")
        .upsert(payload, { onConflict: "user_id,log_date" })
        .select()
        .maybeSingle();
      if (error) console.error("daily log save error", error);
      if (data) {
        setLog(data as DailyLogRow);
        onUpsert?.(data as DailyLogRow);
      }
      setDirty(false);
    }, 500);
    return () => clearTimeout(t);
  }, [log, user, dateISO, dirty, loading, onUpsert]);

  const update = (next: DailyLogRow) => {
    setLog(next);
    setDirty(true);
  };

  return { log, setLog: update, loading, saving: dirty };
}

// Hook: curriculum progress
export function useCurriculumProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<CurriculumProgress>(defaultProgress());
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    supabase
      .from("curriculum_progress")
      .select("video_id, percent")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.error("curriculum fetch error", error);
        const merged = { ...defaultProgress() };
        if (data) {
          // If user has saved data, use it (overriding seed defaults from curriculum.ts)
          data.forEach((r: any) => { merged[r.video_id] = r.percent; });
          // For videos with no DB entry, keep them at 0 (not the seed)
          if (data.length > 0) {
            const dbIds = new Set(data.map((r: any) => r.video_id));
            CURRICULUM.flatMap((t) => t.videos).forEach((v) => {
              if (!dbIds.has(v.id)) merged[v.id] = 0;
            });
          }
        }
        setProgress(merged);
        setLoading(false);
        setHydrated(true);
      });
    return () => { mounted = false; };
  }, [user]);

  // Save individual video progress
  const setVideo = async (videoId: string, percent: number) => {
    if (!user) return;
    setProgress((p) => ({ ...p, [videoId]: percent }));
    const { error } = await supabase
      .from("curriculum_progress")
      .upsert({ user_id: user.id, video_id: videoId, percent }, { onConflict: "user_id,video_id" });
    if (error) console.error("curriculum save error", error);
  };

  return { progress, setProgress, setVideo, loading, hydrated };
}
