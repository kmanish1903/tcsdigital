// Personal harsh-truth + motivation messages — addressed by name.
// Each entry: a hard truth + a motivational push.
// Mixed Telugu / Hindi / English to feel native.

export type PersonalMessage = {
  truth: string;        // harsh reality
  push: string;         // motivation / next move
  tag: string;          // category
};

// {name} placeholder gets replaced at render time.
export const PERSONAL_MESSAGES: PersonalMessage[] = [
  {
    tag: "Reality Check",
    truth: "{name}, 3.5 LPA won't buy you the life you scroll past on Instagram. Not the bike, not the trips, not the respect at home.",
    push: "9–15 LPA isn't a dream — it's the price of 90 days of focused grind. Start today's 2 videos. NOW.",
  },
  {
    tag: "Hard Truth",
    truth: "{name}, your batchmates from college are already at 12 LPA. Not because they're smarter — because they didn't waste 2024 scrolling.",
    push: "Stop comparing. Out-work them silently. By Diwali, they'll be asking YOU how you cracked it.",
  },
  {
    tag: "Wake Up",
    truth: "{name}, every reel you watch today is a rupee taken from your 2027 salary. Distractions have a price tag.",
    push: "Close Instagram. Open VS Code. The version of you with 12 LPA is built in the next 60 minutes — not next year.",
  },
  {
    tag: "Mirror Talk",
    truth: "{name}, you say you want to grow — but yesterday you skipped Naam Jap, skipped revision, watched 2 hours of YouTube. Be honest.",
    push: "Today is a clean slate. 108 Naam Jap → Hanuman Chalisa → 2 videos → mirror speaking. No excuses, just reps.",
  },
  {
    tag: "Brutal",
    truth: "{name}, TCS gave you 3.5 LPA because that's the floor. The market values consistent learners at 4× that. You're not doing the work.",
    push: "Today: solve 3 DSA problems + revise React hooks + speak 2 mirror topics on sales. That's the upgrade path.",
  },
  {
    tag: "Identity Shift",
    truth: "{name}, you're not 'a 3.5 LPA support engineer'. You're a future product engineer who is currently underpaid. Act like it.",
    push: "Top 1% don't wait for permission. Build, ship, post on LinkedIn. Visibility = offers.",
  },
  {
    tag: "Sales Mindset",
    truth: "{name}, you can't negotiate 12 LPA if you can't speak for 2 minutes without saying 'umm'. Communication = compensation.",
    push: "Today's mirror speaking: pick a sales topic, record yourself, watch it back. Cringe is the toll fee for confidence.",
  },
  {
    tag: "Compounding",
    truth: "{name}, skipping today feels harmless. But 30 skipped days = 60 missed videos = no offer in March. Math doesn't lie.",
    push: "Don't break the chain. Even 1 video + 50 Naam Jap is better than zero. Show up, then improve.",
  },
  {
    tag: "Painful Truth",
    truth: "{name}, your parents told relatives 'వాడు TCS లో ఉన్నాడు' with pride. They don't know it's the lowest band. You owe them the upgrade.",
    push: "Hanuman ji ki bhakti se shuru karo. Then: 2 videos, 3 DSA, 1 mirror session. Make them proud, not just relieved.",
  },
  {
    tag: "Ego Killer",
    truth: "{name}, 'I'll start tomorrow' is the most expensive sentence you say. It's already cost you 6 months and a salary jump.",
    push: "There is no tomorrow. Open the curriculum NOW and complete 1 video. Momentum is a muscle — flex it today.",
  },
  {
    tag: "Reality",
    truth: "{name}, the gap between you and a 15 LPA engineer isn't IQ — it's hours of deliberate practice. They put in 3, you put in 0.5.",
    push: "Block 3 deep work sessions today (25 min each). Phone in another room. That's all. The rest is just doing it.",
  },
  {
    tag: "Hanuman Energy",
    truth: "{name}, Hanuman ji didn't wait for the right mood to lift the mountain. He just started. You're waiting for motivation that never comes.",
    push: "Naam Jap 108 → Chalisa 3 paath → 1 hour of focused study. Bhakti + action = breakthrough.",
  },
  {
    tag: "No Shortcuts",
    truth: "{name}, there is no AI tool, no hack, no '5-minute trick' that gives you 12 LPA. Only revision + speaking + DSA + consistency.",
    push: "Today's recipe is boring on purpose: 2 videos, mirror speaking, 3 DSA, no Instagram before 9pm. Boring wins.",
  },
  {
    tag: "Self Respect",
    truth: "{name}, every time you skip mirror speaking, you're telling yourself 'I'm okay being average.' Are you really okay with that?",
    push: "2 minutes. One topic. Speak to the mirror. That's the whole ask. Do it now and feel the shift.",
  },
];

// Deterministic daily selection based on date string YYYY-MM-DD.
function hashDate(iso: string): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function messageForDate(iso: string): PersonalMessage {
  return PERSONAL_MESSAGES[hashDate(iso) % PERSONAL_MESSAGES.length];
}

export function nameFromEmail(email?: string | null): string {
  if (!email) return "Champion";
  const local = email.split("@")[0] || "";
  // Strip numbers/dots/underscores, take first chunk
  const cleaned = local.replace(/[._\-]+/g, " ").replace(/\d+/g, "").trim();
  const first = cleaned.split(/\s+/)[0] || "Champion";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function fillName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name);
}
