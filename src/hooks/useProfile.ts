import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Profile = {
  id: string;
  display_name: string | null;
  goal_title: string | null;
  goal_description: string | null;
  goal_image_url: string | null;
};

export const OWNER_EMAIL = "manishmudhiraj1903@gmail.com";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, goal_title, goal_description, goal_image_url")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data ?? { id: user.id, display_name: null, goal_title: null, goal_description: null, goal_image_url: null });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...patch }, { onConflict: "id" });
      if (!error) setProfile((p) => ({ ...(p ?? { id: user.id, display_name: null, goal_title: null, goal_description: null, goal_image_url: null }), ...patch }));
      return error;
    },
    [user]
  );

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL;

  return { profile, loading, updateProfile, reload: load, isOwner };
}
