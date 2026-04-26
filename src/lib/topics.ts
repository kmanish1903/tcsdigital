export const SPEAKING_TOPICS = [
  "Is social media a boon or bane?",
  "Importance of consistency in life",
  "Will AI replace human jobs?",
  "Your dream company and why",
  "Hard work vs smart work — which matters more?",
  "Should college teach financial literacy?",
  "The role of failure in success",
  "Importance of communication for engineers",
  "Remote work vs office work",
  "Is a degree still relevant in 2026?",
  "How to stay disciplined as a student",
  "Books vs YouTube for learning",
  "The biggest challenge facing your generation",
  "If you had one year to prepare for anything, what would it be?",
  "Why people procrastinate and how to fix it",
  "The most underrated skill in tech",
  "One habit that changed your life",
  "Should everyone learn to code?",
  "The future of education in India",
  "Speaking English fluently — tips that work",
  "Sports as a metaphor for career",
  "What does success mean to you?",
  "The power of small daily wins",
  "How to handle interview pressure",
  "Why first impressions matter",
  "Money vs passion — what to choose first",
  "The importance of sleep for performance",
  "Social media detox — worth it?",
  "Group study vs solo study",
  "The one thing schools should teach",
];

export function pickRandomTopic(exclude?: string): string {
  const pool = exclude ? SPEAKING_TOPICS.filter((t) => t !== exclude) : SPEAKING_TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}
