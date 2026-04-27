// AI Reflection Coach — analyzes a daily log and returns trilingual feedback.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { log, dateISO, score } = await req.json();
    if (!log || !dateISO) {
      return new Response(JSON.stringify({ error: "Missing log/dateISO" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const summary = `
Date: ${dateISO}
Daily score: ${score ?? "n/a"}/100

Sadhana: Naam Jap ${log.naam_jap_count}/108, Chalisa ${log.hanuman_chalisa_count}/3, Meditation ${log.meditation ? "✓" : "✗"}, Anulom Vilom ${log.anulom_vilom ? "✓" : "✗"}
Discipline: Temple ${log.temple_visit ? "✓" : "✗"}, Fasting ${log.fasting ? "✓" : "✗"}
Learning: DSA ${log.dsa_problems} solved, Videos ${log.videos_today}/2, Revision ${log.revision ? "✓" : "✗"}, React ${log.react_learning ? "✓" : "✗"}
Speaking: Mirror ${log.mirror_speaking ? "✓" : "✗"}, JAM ${log.jam_speaking ? "✓" : "✗"}, Random topics ${log.random_speaking}
Fitness: Pushups ${log.pushups}, Pullups ${log.pullups}
Distractions: Instagram ${log.instagram_minutes ?? 0}m, YouTube non-learning ${log.youtube_minutes ?? 0}m, Phone pickups before 10am ${log.phone_pickups ?? 0}, Deep work blocks ${log.deep_work_blocks ?? 0}
Notes: ${log.notes || "—"}
`.trim();

    const systemPrompt = `You are PrepTrack — a brutally honest but caring reflection coach for a TCS engineer (3.5 LPA) grinding toward 8–15 LPA product roles. You speak in Telugu, Hindi, AND English.

Always reply with STRICT JSON exactly in this shape:
{
  "feedback_te": "2-3 short sentences in Telugu script",
  "feedback_hi": "2-3 short sentences in Hindi script (Devanagari)",
  "feedback_en": "2-3 short sentences in English",
  "focus_question": "ONE sharp reflection question in English (max 18 words)"
}

Rules:
- Be specific. Reference the actual numbers in the log.
- Celebrate wins, name the gap.
- The focus question should make him think — not generic.
- No markdown, no extra keys, ONLY the JSON object.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyse this day and respond with the JSON:\n\n${summary}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit hit. Try again in a minute." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Workspace > Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content: string = aiJson.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch (_) { parsed = {}; }

    const payload = {
      user_id: user.id,
      log_date: dateISO,
      feedback_te: parsed.feedback_te ?? "",
      feedback_hi: parsed.feedback_hi ?? "",
      feedback_en: parsed.feedback_en ?? "",
      focus_question: parsed.focus_question ?? "",
      daily_score: typeof score === "number" ? score : null,
    };

    const { data: saved, error: saveErr } = await supabase
      .from("ai_reflections")
      .upsert(payload, { onConflict: "user_id,log_date" })
      .select()
      .maybeSingle();
    if (saveErr) console.error("save error", saveErr);

    return new Response(JSON.stringify({ reflection: saved ?? payload }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-reflection error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
