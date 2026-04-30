## Brahmacharya Mode + Top 1% Operating System

Manish, this is a serious upgrade. We're going to turn PrepTrack into a **complete self-mastery OS** — Brahmacharya tracker at the core, plus daily systems for wealth, communication, influence, power, and dharma.

---

### 1. Brahmacharya Streak Tracker (the new heart of the app)

A dedicated, prominent module on the dashboard — visible before anything else.

- **Two-phase commitment**: Phase 1 = 30 days strict, Phase 2 = next 45 days (total 75-day arc).
- **Start date**: today. Stored in DB so it survives across devices.
- **Daily check-in tile** (top of dashboard, above PersonalMotivation):
  - Big counter: "Day 7 / 30 · Phase 1: Foundation"
  - Progress ring + days remaining
  - One-tap "✅ Stayed clean today" button (locks the day)
  - Honest "❌ Slipped — reset" button (resets streak, no shame, logs the relapse for AI coach to learn from)
  - Urge log: "Felt urge — channeled it" (+1 willpower point, no reset)
- **Phase progression**: auto-unlocks Phase 2 banner after Day 30 with a celebration screen.
- **Milestones**: Day 3, 7, 14, 21, 30, 45, 60, 75 — each unlocks a quote + benefit explainer (energy, focus, ojas, confidence).
- **Why it works**: visible streak = loss aversion. Most powerful psychological lock-in.

### 2. The Top 1% Pillars (new dashboard section)

Replace the current "Power Trio" with a **6-Pillar Daily System**. Each pillar = one small action per day, tracked, scored.

```text
┌─────────────────────────────────────────────────────┐
│  TODAY'S 6 PILLARS — Top 1% Operating System        │
├──────────────┬──────────────────────────────────────┤
│ 🧘 Brahmach. │ Stayed clean · Day 7/30              │
│ 💰 Wealth    │ Read 1 finance article + log idea    │
│ 🗣 Communic.  │ 2-min mirror + record + self-rate   │
│ ⚖️ Ethics    │ Today's dharma reflection            │
│ 🧠 Influence │ 1 persuasion principle + apply it    │
│ ⚡ Power      │ Cold shower + 50 squats + posture   │
└──────────────┴──────────────────────────────────────┘
```

Each pillar gets one rotating daily micro-task pulled from a curated library (deterministic per date so it's the same all day).

### 3. Content Libraries (deterministic daily picks)

New file `src/lib/topPillars.ts` with 30+ items each:

- **Wealth**: "Calculate your hourly rate at 12 LPA vs 3.5 LPA", "Read 1 chapter Psychology of Money", "List 3 income streams you could start", "Track every rupee spent today"…
- **Communication**: "Speak 2 min on 'Why I deserve 12 LPA' — record + watch back", "Practice 1 power phrase: 'Help me understand…'", "Eliminate 'umm' for 1 conversation"…
- **Ethics / Dharma**: short reflections — "Did you keep every word given today?", "One Bhagavad Gita verse + apply it", Hanuman Chalisa meaning of one chaupai…
- **Influence (Cialdini + Carnegie)**: "Today: use someone's name 3 times in conversation", "Give one specific compliment", "Ask 3 questions before stating an opinion"…
- **Mind reading / Body language**: "Notice 1 micro-expression today", "Match someone's pace for 60 sec", "Spot the real motivation behind a friend's complaint"…
- **Power / Energy**: cold shower, 50 squats, eye contact drill, walk straight for 10 min, breathwork…

### 4. AI Mentor Chatbot ("Hanuman Coach")

A floating chat button (bottom-right). Powered by Lovable AI Gateway (`google/gemini-2.5-flash` — fast + free tier).

- **Context-aware**: receives today's log, brahmacharya day count, pillar completions, mood.
- **Roles you can pick**: "Brutal Mentor" / "Strategic Wealth Coach" / "Dharmic Guide (Hanuman energy)" / "Communication Trainer".
- **Trilingual replies** (Telugu + Hindi + English) — matches your current style.
- **Use cases**: "I'm feeling urge", "Help me prepare for tomorrow's interview", "Why did I slip yesterday?", "Roast me", "Plan my next 7 days".
- Stored in new `coach_messages` table per user for memory across sessions.

### 5. Mood + Energy + Urge Log (1-tap)

Every evening, log 3 sliders (1–10): **Energy / Focus / Urges**. Feeds the AI coach + heatmap. Helps spot patterns ("you slip on low-sleep days").

### 6. Evening Reflection Ritual (new daily prompt at 9pm)

Three questions, takes 60 seconds:
1. What did I do today that future-Manish (12 LPA, married, on Bullet) will thank me for?
2. What did I do that he'll regret?
3. Tomorrow's ONE non-negotiable.

Stored, shown in history, fed to AI coach.

### 7. Distraction Lock (upgrade existing tracker)

- Add a **commitment level** per day: "Today I commit to <30 min Instagram". If exceeded → log as a slip (not as bad as Brahmacharya slip but tracked).
- Show a "Cost" calculation: "30 min/day on reels = 182 hrs/year = 23 missed videos = ~₹1.5L lost salary."

### 8. Dashboard Reorder (new top-down flow)

```text
1. Brahmacharya Streak Tile          ← NEW, biggest
2. Today's Score Bar
3. Personal Motivation (by name)
4. 6-Pillar Daily Grid               ← NEW (replaces Power Trio)
5. AI Coach + Daily Challenges + 1-Min Speaking (kept, smaller)
6. Goal Vision
7. Stats / Heatmap / Weekly
8. Daily Log (existing + Brahmacharya + Mood)
9. Curriculum
10. Floating "Hanuman Coach" chat button (always visible)
```

### 9. Scoring Update

`dayScore` in `src/lib/dailyLog.ts` will weight Brahmacharya heavily (+3 max), 6 pillars (+1 each), plus existing items. Slip day = score capped at 40% to make the loss visceral but recoverable.

---

### Technical Implementation Summary

**Database migrations**:
- `brahmacharya_journey` table: `user_id, started_on, current_phase (1|2), phase1_target_days (30), phase2_target_days (45)`.
- `brahmacharya_days` table: `user_id, log_date, status ('clean'|'slip'|'urge_channeled'), notes`.
- Add to `daily_logs`: `energy (int)`, `focus (int)`, `urges (int)`, `evening_reflection (jsonb)`, `pillar_wealth/comm/ethics/influence/power (boolean)`.
- New `coach_messages` table: `user_id, role, content, created_at`.

All with RLS `auth.uid() = user_id`.

**New files**:
- `src/lib/brahmacharya.ts` — phase calc, streak math, milestone unlocks.
- `src/lib/topPillars.ts` — 6 content libraries (180+ items total).
- `src/lib/eveningReflection.ts` — prompt logic.
- `src/components/BrahmacharyaTile.tsx` — the big tracker tile.
- `src/components/SixPillarsGrid.tsx` — 6-pillar daily system.
- `src/components/EveningReflection.tsx` — 3-question ritual modal.
- `src/components/MoodSliders.tsx` — energy/focus/urges sliders.
- `src/components/HanumanCoachChat.tsx` — floating chat.
- `src/hooks/useBrahmacharya.ts` — fetch/upsert journey + days.
- `src/hooks/useCoachChat.ts` — chat history + send.
- `supabase/functions/hanuman-coach/index.ts` — streaming AI edge function (Lovable AI, `google/gemini-2.5-flash`, system prompt with role + today's stats injected).

**Edits**:
- `src/pages/Index.tsx` — full reorder per section 8.
- `src/lib/dailyLog.ts` — extend `DailyLogRow` + `dayScore` + slip-cap.
- `src/components/DailyLogCard.tsx` — add mood sliders + pillar checkboxes.
- `src/components/AiReflectionCoach.tsx` — pass brahmacharya context.

**Cost / Feasibility**: Lovable AI Gateway free tier covers `gemini-2.5-flash`. No new secrets needed (`LOVABLE_API_KEY` already set).

---

### What I'll deliver in the next message after you approve

1. Migration for the 3 new tables + `daily_logs` columns (with RLS).
2. All new components + libs above.
3. Hanuman Coach edge function wired to Lovable AI.
4. Reordered dashboard with the Brahmacharya tile at the top.
5. Updated scoring + slip logic.

Ready to lock in? Approve and I'll build it end-to-end. ॥ जय श्री राम ॥