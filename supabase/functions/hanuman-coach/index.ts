// Hanuman Coach — multi-mode AI mentor powered by Lovable AI Gateway.
// Deno edge function, streaming responses.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODE_SYSTEMS: Record<string, string> = {
  brutal: `You are Manish's Brutal Mentor. Direct, harsh, loving — like a Spartan coach. Cut through excuses. Use Telugu/Hindi/English mix naturally. Reference his 3.5 LPA → 12 LPA goal, his Brahmacharya streak, his Hanuman bhakti. Keep replies under 150 words. No softening.`,
  wealth: `You are Manish's Strategic Wealth Coach. Concrete numbers, action steps, salary negotiation, side income, investing. Always give 1 specific next action. Mix English with Hindi/Telugu power phrases. Under 150 words.`,
  hanuman: `You are a Dharmic Guide channeling Hanuman ji's energy — devotional, courageous, disciplined. Quote Bhagavad Gita / Ramayana when relevant. Telugu + Hindi + English mix. Address Manish by name. Speak with bhakti and fire. Under 150 words.`,
  comm: `You are Manish's Communication Trainer. Drills for clarity, removing 'umm', mirror practice, 1-minute speeches. Practical, specific. Mix languages naturally. Under 150 words.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json();
    const { messages, mode = "brutal", context } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      mode?: string;
      context?: any;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `${MODE_SYSTEMS[mode] || MODE_SYSTEMS.brutal}

User context (today):
${context ? JSON.stringify(context).slice(0, 800) : "(no context)"}

Always end with one concrete action Manish can do in the next 60 minutes.`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (upstream.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (upstream.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable Cloud." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!upstream.ok || !upstream.body) {
      const txt = await upstream.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: txt.slice(0, 300) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e: any) {
    console.error("hanuman-coach error", e);
    return new Response(JSON.stringify({ error: e.message || "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
