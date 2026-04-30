// Daily micro-tasks for the 6-Pillar Top 1% Operating System.
// Deterministic per-date selection so the day's task is stable.

export type Pillar = "wealth" | "communication" | "ethics" | "influence" | "power";

export const PILLAR_META: Record<Pillar, { label: string; emoji: string; color: string; tagline: string }> = {
  wealth:        { label: "Wealth",        emoji: "💰", color: "text-success",   tagline: "From 3.5 → 12 LPA" },
  communication: { label: "Communication", emoji: "🗣️", color: "text-primary",   tagline: "Words = Compensation" },
  ethics:        { label: "Ethics / Dharma", emoji: "⚖️", color: "text-warning", tagline: "Hanuman path" },
  influence:     { label: "Influence",     emoji: "🧠", color: "text-secondary", tagline: "Read minds, move people" },
  power:         { label: "Power & Energy", emoji: "⚡", color: "text-destructive", tagline: "Body = Battery" },
};

const WEALTH = [
  "Calculate your hourly rate at 3.5 LPA vs 12 LPA. Write the gap on paper. Feel it.",
  "Read 1 chapter of 'Psychology of Money' OR 1 finance article on Zerodha Varsity.",
  "List 3 income streams you could start in 90 days (freelance, content, tutoring).",
  "Track every rupee spent today in Notes. Seeing it = controlling it.",
  "Open Zerodha/Groww. Understand 1 mutual fund's expense ratio.",
  "Watch 1 video on negotiation tactics for tech salary hikes.",
  "Write your dream salary on a sticky note. Stick on laptop.",
  "Calculate compound: ₹5K/month invested for 30 yrs at 12% = ?",
  "List 3 skills that pay 2× your current rate. Pick 1 to learn this month.",
  "Audit your subscriptions. Cancel 1 you don't use.",
  "Read 1 LinkedIn post by someone earning 25+ LPA. Note their playbook.",
  "Calculate emergency fund target: 6 × monthly expenses.",
  "Spend 10 min on a side-project that COULD earn money one day.",
  "Watch 1 'Day in the life of a product engineer' video.",
  "List 5 companies paying 12+ LPA for 2-yr exp. Save them.",
];

const COMMUNICATION = [
  "Speak 2 min on 'Why I deserve 12 LPA' — record + watch back. Cringe = growth.",
  "Eliminate 'umm' for 1 full conversation today. Pause instead.",
  "Practice the power phrase: 'Help me understand…' — use it once today.",
  "Read 1 page of any book OUT LOUD with full diction.",
  "Record yourself explaining React useEffect for 90 sec. Re-watch.",
  "Tongue twister drill: 5 min, slow → fast.",
  "Compliment one person specifically (not 'nice shirt' — say WHY it works).",
  "Practice 'STAR' answer for one project from your TCS work.",
  "Mirror speak: 'Sell me this pen' for 2 min. No notes.",
  "Read a Telugu/Hindi paragraph aloud — preserve your roots.",
  "Practice silence: in next conversation, count to 2 before replying.",
  "Watch 1 TED talk at 1× speed. Note their opening hook.",
  "Speak in full sentences in your head before you say them — for 1 hour.",
  "Practice introducing yourself in 30 sec — confident, no apology.",
  "Send 1 voice note that's clear, structured, ends with a question.",
];

const ETHICS = [
  "Did you keep EVERY word given today? Reflect — yes or no, no maybe.",
  "Read 1 verse from Bhagavad Gita Chapter 2 (Karma Yoga). Apply it.",
  "Pick one Hanuman Chalisa chaupai. Understand its meaning.",
  "No lying today — even small social ones ('I'm fine'). Speak truth softly.",
  "Help one person without telling anyone. Anonymous good = pure.",
  "Apologise for one thing you've been postponing. Even small.",
  "Don't speak ill of anyone today. Test yourself.",
  "Spend 5 min thinking about your parents' sacrifices. Call them.",
  "Forgive one person silently in your mind. Free yourself.",
  "Eat one meal in silence, full attention. Annadata sukhibhava.",
  "Reflect: would you be proud if Hanuman ji watched today's actions?",
  "Don't gossip. If conversation goes there, redirect or leave.",
  "Practice non-violence in thought — catch one angry thought, release it.",
  "Read about one mythological figure: Karna, Bhishma, Arjuna. Why are they remembered?",
  "Today's dharma: do the harder right thing once.",
];

const INFLUENCE = [
  "Use someone's NAME 3 times in conversation today. Watch their face change.",
  "Cialdini: Reciprocity. Do one small favor with no agenda.",
  "Ask 3 'why' questions before stating any opinion today.",
  "Notice 1 micro-expression — a flicker of disappointment, joy, doubt.",
  "Match someone's pace and posture for 60 sec (subtle mirroring).",
  "Practice the 5-second eye contact rule with 1 person.",
  "Spot the REAL motivation behind a friend's complaint (status? fear? love?).",
  "Listen FULLY to next person — don't plan your reply while they speak.",
  "Use the phrase 'That's interesting — tell me more' instead of arguing.",
  "Read 1 chapter of 'How to Win Friends and Influence People'.",
  "In a group, speak last. Observe who jockeys for status.",
  "Notice your own micro-expressions in the mirror. What's leaking?",
  "Cialdini: Scarcity. Don't be too available today.",
  "Frame: present 2 options instead of 1 question. People prefer choosing.",
  "Read someone's WhatsApp message and guess their mood before replying.",
];

const POWER = [
  "Cold shower — last 60 sec freezing. No flinching.",
  "50 squats + 25 pushups — right now, no warmup.",
  "Posture check: stand against a wall for 2 min. Shoulders back.",
  "Walk 10 min holding eye contact with people you cross.",
  "5 min Anulom Vilom + 21 Bhastrika breaths.",
  "No phone for first 60 min after waking. Sun, water, push-ups instead.",
  "Sit cross-legged for 10 min, spine straight. Build the tapasya body.",
  "Go to gym/park even if for 20 min. Showing up > intensity.",
  "Eat one meal slowly — chew each bite 20 times.",
  "Walk barefoot on grass/floor for 5 min. Ground yourself.",
  "Suryanamaskar × 5 rounds. Sweat = ojas.",
  "Drink 3L water today. Track it.",
  "Sleep at 10:30pm tonight. Phone off at 10:00.",
  "Hold a plank for 90 sec. Mind > body.",
  "Stand in vajrasana for 5 min after dinner. Ancient hack.",
];

const LIBS: Record<Pillar, string[]> = {
  wealth: WEALTH,
  communication: COMMUNICATION,
  ethics: ETHICS,
  influence: INFLUENCE,
  power: POWER,
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pillarTaskForDate(pillar: Pillar, iso: string): string {
  const lib = LIBS[pillar];
  return lib[hashStr(iso + pillar) % lib.length];
}
