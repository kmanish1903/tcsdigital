// Morning + Night daily challenges — designed to bookend the day
// Morning = energy, intention, courage. Night = reflection, discipline, recovery.

export type DayChallenge = {
  text: string;
  emoji: string;
  why: string; // 1-line "why this matters"
};

export const MORNING_CHALLENGES: DayChallenge[] = [
  { emoji: "🌅", text: "Don't touch phone for first 30 min — drink 1L water + 20 pushups", why: "Win the first hour, win the day." },
  { emoji: "📝", text: "Write your top 3 outcomes for today on paper before opening laptop", why: "Clarity beats motivation." },
  { emoji: "🧊", text: "Cold shower (or 60 sec cold water on face) + 5 deep breaths", why: "Discomfort first thing = nothing else feels hard." },
  { emoji: "🪞", text: "Mirror talk: say 'I am Manish. Top 1%. Today I attack.' 3 times, loud", why: "Identity is built by repetition." },
  { emoji: "🏃", text: "Step outside for 5 min sunlight before any screen", why: "Resets cortisol + dopamine for the whole day." },
  { emoji: "🙏", text: "108 Naam Jap before breakfast — no exceptions", why: "Sadhana first. Everything else flows." },
  { emoji: "🎯", text: "Pick ONE hard task and commit to finishing it before lunch", why: "Eat the frog. Rest is downhill." },
  { emoji: "💪", text: "50 squats + 30 pushups before you sit down to work", why: "Body activated → mind activated." },
  { emoji: "📵", text: "Block Instagram + YouTube till 12 PM (use Forest/AppBlock)", why: "Your morning attention is your most valuable asset." },
  { emoji: "✍️", text: "Journal 5 lines: 'What would the 12 LPA me do today?'", why: "Future self writes today's plan." },
  { emoji: "🗣️", text: "Call/message one person you haven't spoken to in a month", why: "Network compounds in silence." },
  { emoji: "📚", text: "Read 5 pages of a book (sales/psychology) before checking WhatsApp", why: "Input quality = output quality." },
  { emoji: "🧘", text: "5 min meditation + 10 Anulom Vilom — no phone in room", why: "Stillness is a competitive advantage." },
  { emoji: "🔥", text: "Repeat: 'TCS 3.5 LPA is my floor, not my ceiling' — then start grinding", why: "Hunger > talent." },
];

export const NIGHT_CHALLENGES: DayChallenge[] = [
  { emoji: "📖", text: "Write 3 wins from today (no matter how small) in a notebook", why: "What gets noticed gets repeated." },
  { emoji: "🤔", text: "Ask yourself: 'What did I avoid today out of fear?' — write the answer", why: "Fear-mapping is the path to courage." },
  { emoji: "📵", text: "Phone in another room 60 min before sleep. Read a real book instead", why: "Sleep quality = tomorrow's energy." },
  { emoji: "🪞", text: "Mirror review: rate yourself out of 10 honestly. Why not 10?", why: "Brutal honesty is brotherhood with yourself." },
  { emoji: "🧹", text: "Tidy desk + lay out tomorrow's clothes + write tomorrow's #1 task", why: "Tomorrow-you will thank tonight-you." },
  { emoji: "🚫", text: "No food/snacks 2 hrs before bed — empty stomach, deeper sleep", why: "Discipline at night = power in the morning." },
  { emoji: "🙏", text: "3 Hanuman Chalisa before sleeping — slow and clear", why: "End the day with devotion, not doomscrolling." },
  { emoji: "💭", text: "Replay one conversation today — what would the confident you have said?", why: "Mental reps build real-life muscle." },
  { emoji: "✍️", text: "Write 3 things you're grateful for today — be specific, not generic", why: "Gratitude rewires the brain in 21 days." },
  { emoji: "🛑", text: "Brahmacharya check: any urges today? Write the trigger + the win", why: "Awareness kills the habit, not willpower." },
  { emoji: "📊", text: "Score today honestly: Sadhana / Learning / Speaking / Fitness — which one slipped?", why: "What you measure, you master." },
  { emoji: "🎙️", text: "1 min mirror talk: explain what you learned today out loud", why: "Teaching = the deepest form of learning." },
  { emoji: "💤", text: "Lights out by 11 PM — 7+ hours sleep is non-negotiable for top 1%", why: "You can't out-grind bad sleep." },
  { emoji: "🌙", text: "Visualize tomorrow morning: see yourself winning the first hour", why: "Mental rehearsal = real-world performance." },
];

function hashDate(iso: string): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function morningForDate(iso: string): DayChallenge {
  return MORNING_CHALLENGES[hashDate(iso) % MORNING_CHALLENGES.length];
}

export function nightForDate(iso: string): DayChallenge {
  // Different hash so morning + night don't correlate
  return NIGHT_CHALLENGES[hashDate(iso + "_night") % NIGHT_CHALLENGES.length];
}
