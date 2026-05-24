import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type CustomLogField = {
  id?: string;
  user_id?: string;
  field_key: string;
  label: string;
  field_type: "checkbox" | "number" | "text";
  unit?: string | null;
  target?: number | null;
  priority?: "HIGH" | "SADHANA" | null;
  sort_order: number;
  section: string;
};

export type CustomValues = Record<string, boolean | number | string>;

export function useCustomLogFields() {
  const { user } = useAuth();
  const [fields, setFields] = useState<CustomLogField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setFields([]); setLoading(false); return; }
    let alive = true;
    setLoading(true);
    supabase
      .from("custom_log_fields")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) console.error("custom fields fetch", error);
        setFields((data as CustomLogField[]) || []);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [user]);

  const addField = useCallback(async (field: Omit<CustomLogField, "id" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("custom_log_fields")
      .insert({ ...field, user_id: user.id })
      .select()
      .maybeSingle();
    if (error) { console.error("add field", error); return; }
    if (data) setFields((prev) => [...prev, data as CustomLogField].sort((a, b) => a.sort_order - b.sort_order));
  }, [user]);

  const updateField = useCallback(async (id: string, patch: Partial<CustomLogField>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("custom_log_fields")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) { console.error("update field", error); return; }
    if (data) setFields((prev) => prev.map((f) => f.id === id ? (data as CustomLogField) : f));
  }, [user]);

  const deleteField = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("custom_log_fields").delete().eq("id", id);
    if (error) { console.error("delete field", error); return; }
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, [user]);

  const reorderFields = useCallback(async (ordered: CustomLogField[]) => {
    if (!user) return;
    setFields(ordered);
    const updates = ordered.map((f, i) =>
      supabase.from("custom_log_fields").update({ sort_order: i }).eq("id", f.id!)
    );
    await Promise.all(updates);
  }, [user]);

  // Group fields by section
  const grouped = fields.reduce<Record<string, CustomLogField[]>>((acc, f) => {
    const sec = f.section || "Custom";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(f);
    return acc;
  }, {});

  return { fields, grouped, loading, addField, updateField, deleteField, reorderFields };
}
