// Daily self-improvement micro-challenges to push toward Top 1%
// Categories: social, sales/business, communication, mindset, courage, network

export type Challenge = {
  text: string;
  category: "social" | "sales" | "communication" | "mindset" | "courage" | "network" | "learning";
  emoji: string;
};

export const CHALLENGES: Challenge[] = [
  // Social / connection
  { text: "Genuinely compliment one friend today — be specific about what you admire", category: "social", emoji: "💛" },
  { text: "Call (don't text) one family member just to say hi", category: "social", emoji: "📞" },
  { text: "Greet 3 strangers today with a smile and 'how's your day?'", category: "social", emoji: "😊" },
  { text: "Send a thank-you message to someone who helped you in the past", category: "social", emoji: "🙏" },
  { text: "Ask one friend: 'what's one thing I could do better?' — and just listen", category: "social", emoji: "👂" },

  // Sales / business
  { text: "Write a 60-sec elevator pitch about yourself and record it on your phone", category: "sales", emoji: "🎤" },
  { text: "Pick a product you own — sell it to yourself in the mirror in 2 minutes", category: "sales", emoji: "💼" },
  { text: "Watch one sales/negotiation video (Alex Hormozi / Patrick Bet-David) — note 3 takeaways", category: "sales", emoji: "📺" },
  { text: "Practice the 'feel-felt-found' objection handling on any objection today", category: "sales", emoji: "🤝" },
  { text: "Ask one person about their work — listen for a problem you could solve", category: "sales", emoji: "🔍" },
  { text: "Cold-message 1 person on LinkedIn with a genuine, no-ask intro", category: "network", emoji: "🔗" },
  { text: "Write down 3 things any business should never compromise on", category: "sales", emoji: "📝" },
  { text: "Negotiate something today — even ₹10 off at a shop. Just practice asking", category: "sales", emoji: "💰" },

  // Communication
  { text: "Speak only in full sentences for 1 hour — no 'umm', no 'like', no fillers", category: "communication", emoji: "🗣️" },
  { text: "Explain one technical concept to a non-tech person in under 60 seconds", category: "communication", emoji: "💡" },
  { text: "Record a 2-min voice note explaining your day in English. Play it back", category: "communication", emoji: "🎙️" },
  { text: "Maintain eye contact in every conversation today", category: "communication", emoji: "👀" },

  // Mindset / discipline
  { text: "Phone in another room for 2 hours of deep work today", category: "mindset", emoji: "📵" },
  { text: "Write down 3 wins from yesterday before you start work", category: "mindset", emoji: "🏆" },
  { text: "Cold shower or 50 pushups before opening Instagram today", category: "mindset", emoji: "🧊" },
  { text: "Say 'no' to one distraction you usually say yes to", category: "mindset", emoji: "🛑" },
  { text: "Wake up and don't touch your phone for the first 60 minutes", category: "mindset", emoji: "🌅" },

  // Courage
  { text: "Ask one 'stupid' question in a conversation today — kill the ego", category: "courage", emoji: "🦁" },
  { text: "Speak up first in any group/meeting today — share one opinion", category: "courage", emoji: "🎯" },
  { text: "Reach out to one senior or mentor and ask one specific question", category: "courage", emoji: "✉️" },

  // Learning
  { text: "Teach someone (or your mirror) what you learned yesterday", category: "learning", emoji: "🎓" },
  { text: "Read 10 pages of a book on sales, business, or psychology", category: "learning", emoji: "📚" },
  { text: "Pick 1 word you don't know — use it in 3 sentences today", category: "learning", emoji: "🔤" },
];

// Sales / business / persuasion speaking topics — for mirror practice
export const SALES_BUSINESS_TOPICS = [
  "How would you sell water to a fish?",
  "Pitch yourself in 60 seconds — why should anyone hire you?",
  "Convince me to buy a ₹50,000 product I don't need",
  "What makes a great salesperson — born or made?",
  "Explain your dream business idea in 2 minutes",
  "How do you handle rejection in sales?",
  "Why is communication 80% of business success?",
  "What's the difference between selling and helping?",
  "How would you negotiate your first salary?",
  "Pitch India as an investment destination to a foreigner",
  "Why most startups fail in the first 2 years",
  "How to build trust with a stranger in 5 minutes",
  "Sell me this pen (the classic)",
  "What's a personal brand and why should you build one?",
  "How would you turn a hobby into a side income?",
  "Convince your friend to wake up at 5 AM with you",
  "What's the biggest sales lesson school never taught you?",
  "How does Apple make customers love a ₹1L phone?",
];

// Hash a date string to a stable index (so picks stay same all day, change daily)
function hashDate(iso: string): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function challengeForDate(iso: string): Challenge {
  return CHALLENGES[hashDate(iso) % CHALLENGES.length];
}

export function topicsForDate(iso: string, allTopics: string[]): [string, string] {
  const h = hashDate(iso);
  const a = allTopics[h % allTopics.length];
  const b = allTopics[(h * 7 + 13) % allTopics.length];
  return [a, a === b ? allTopics[(h + 1) % allTopics.length] : b];
}
