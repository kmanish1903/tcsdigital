const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTION_PROMPTS: Record<string, string> = {
  business: `You are an elite startup mentor. Generate ONE high-quality business idea (1000–1500 words).

Return a JSON object with this EXACT structure:
{
  "title": "...",
  "oneLiner": "...",
  "problemStatement": "...",
  "solution": "...",
  "targetAudience": "...",
  "marketOpportunity": "...",
  "revenueModel": "...",
  "mvpPlan": "...",
  "growthStrategy": "...",
  "competitiveAdvantage": "...",
  "risksAndChallenges": "...",
  "exampleUserJourney": "...",
  "actionSteps": ["step1", "step2", "step3"],
  "visualSuggestions": ["desc1", "desc2"]
}

Make it practical, execution-focused, for someone in India earning 3.5 LPA wanting to build wealth. No fluff. Make the idea unique and actionable TODAY. Vary ideas daily — cover SaaS, D2C, services, creator economy, local business, tech products.`,

  influence: `You are an elite influence and leadership coach. Generate ONE real-life scenario where someone must take initiative, lead, or influence others.

Return a JSON object with this EXACT structure:
{
  "title": "...",
  "situationSetup": "...",
  "challenge": "...",
  "idealMindset": "...",
  "actionPlan": ["step1", "step2", "..."],
  "exactWords": ["line1", "line2", "..."],
  "bodyLanguageAndTone": "...",
  "mistakesToAvoid": ["m1", "m2", "..."],
  "advancedMove": "...",
  "reflectionQuestion": "..."
}

Make it REAL — handling friends, ordering in restaurants, taking leadership in groups, handling disrespect, talking to strangers. Bold, practical, for a young Indian professional building confidence. No generic advice.`,

  conversation: `You are an elite communication and social skills trainer. Generate ONE conversation scenario.

Return a JSON object with this EXACT structure:
{
  "title": "...",
  "context": "...",
  "goal": "...",
  "conversationFlow": {
    "openingLine": "...",
    "followUpQuestions": ["q1", "q2", "q3", "q4", "q5"],
    "deepTransition": "...",
    "playfulLines": ["l1", "l2"],
    "handlingSilence": "...",
    "strongEnding": "..."
  },
  "sampleConversation": [
    {"speaker": "You", "line": "..."},
    {"speaker": "Them", "line": "..."}
  ],
  "psychologyBreakdown": "...",
  "mistakesToAvoid": ["m1", "m2", "m3"],
  "practiceTask": "..."
}

Make it natural, confident, respectful. Real Indian social contexts — college, office, cafe, events. No cringe pickup lines. Focus on genuine connection, attraction through confidence, and leadership in conversation.`
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const { section } = await req.json() as { section: string };
    const systemPrompt = SECTION_PROMPTS[section];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: "Invalid section" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    const userPrompt = `Today's date is ${today}. Generate fresh, unique content for today. Make it completely different from yesterday. Return ONLY valid JSON, no markdown.`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (upstream.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }),
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

    const result = await upstream.json();
    let content = result.choices?.[0]?.message?.content || "";
    
    // Strip markdown code fences if present
    content = content.replace(/^```json?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content.slice(0, 500) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("academy-content error", e);
    return new Response(JSON.stringify({ error: e.message || "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
