// Refine Plan — uses Lovable AI to turn a rough plan into a structured, actionable roadmap.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM = `You are Manish's Strategic Planning Coach. He is preparing for product/full-stack roles (3.5 LPA → 9-15 LPA), grinding DSA + React + speaking + Brahmacharya.

Given a ROUGH plan, refine it into a CRYSTAL-CLEAR, time-blocked, actionable roadmap.

OUTPUT RULES (markdown, no preamble):
1. Start with: "# <Catchy Title>" then a one-line "🎯 Goal:" statement.
2. Break into days/weeks/phases as appropriate to the horizon.
3. For each day/block include: ⏰ Time block, 📚 Topics, 💻 Practice problems with counts, ✅ Deliverable/checkpoint.
4. Add a "🧠 Patterns to Master" section listing key patterns/concepts.
5. Add a "🚦 Daily Routine Fit" mapping work into his existing schedule (5AM Sadhana → 6-9 DSA → 10-1 React → 2-4 Speaking → 4-6 Editing → 6-8 Revision → 8-9:30 Fitness).
6. End with "🏆 End-of-Period Outcome" — measurable success criteria.
7. Use emojis, tables, and short bullet lines. Keep it scannable. NO fluff, NO disclaimers.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const { title, horizon, content } = await req.json();
    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "content required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Title: ${title || "(none)"}
Horizon: ${horizon || "weekly"}

ROUGH PLAN:
${content}

Refine this into the structured roadmap as per your rules.`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (upstream.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (upstream.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!upstream.ok) {
      const txt = await upstream.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: txt.slice(0, 300) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const json = await upstream.json();
    const refined = json?.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ refined }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("refine-plan error", e);
    return new Response(JSON.stringify({ error: e.message || "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
