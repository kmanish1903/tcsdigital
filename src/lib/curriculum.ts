// DSA video curriculum (TCS NQT prep) — initial completion seeded from user's progress.
// Stored in localStorage so progress persists.

export type Video = {
  id: string;
  title: string;
  duration: string;
  initial: number; // 0..100
};

export type Topic = {
  id: string;
  title: string;
  videos: Video[];
};

export const CURRICULUM: Topic[] = [
  {
    id: "7.1.1",
    title: "Array",
    videos: [
      { id: "7.1.1.1",  title: "Largest Element",                       duration: "12:58", initial: 64 },
      { id: "7.1.1.2",  title: "Second Largest",                        duration: "11:27", initial: 0 },
      { id: "7.1.1.3",  title: "Check if Array is Rotated",             duration: "15:08", initial: 68 },
      { id: "7.1.1.4",  title: "Remove Duplicates from Sorted Array",   duration: "10:08", initial: 42 },
      { id: "7.1.1.5",  title: "Rotate Array",                          duration: "16:43", initial: 100 },
      { id: "7.1.1.6",  title: "Move Zeroes",                           duration: "6:54",  initial: 100 },
      { id: "7.1.1.7",  title: "Sorted Array Search",                   duration: "9:16",  initial: 100 },
      { id: "7.1.1.8",  title: "Union of 2 Sorted Arrays",              duration: "22:00", initial: 76 },
      { id: "7.1.1.9",  title: "Missing Number",                        duration: "18:58", initial: 0 },
      { id: "7.1.1.10", title: "Largest Subarray with Sum k",           duration: "23:00", initial: 94 },
      { id: "7.1.1.11", title: "Two Sum",                               duration: "10:40", initial: 59 },
      { id: "7.1.1.12", title: "Sort Colors",                           duration: "7:54",  initial: 36 },
      { id: "7.1.1.13", title: "Majority Element",                      duration: "7:06",  initial: 100 },
      { id: "7.1.1.14", title: "Maximum Subarray",                      duration: "8:29",  initial: 100 },
      { id: "7.1.1.15", title: "Maximum Score from Subarray Min",       duration: "8:23",  initial: 100 },
      { id: "7.1.1.16", title: "Best Time to Buy Stock",                duration: "8:53",  initial: 100 },
      { id: "7.1.1.17", title: "Rearrange Array Elements by Sign",      duration: "5:06",  initial: 100 },
      { id: "7.1.1.18", title: "Next Permutation",                      duration: "17:18", initial: 0 },
      { id: "7.1.1.19", title: "Array Leaders",                         duration: "10:44", initial: 59 },
      { id: "7.1.1.20", title: "Longest Consecutive Sequence",          duration: "12:50", initial: 0 },
      { id: "7.1.1.21", title: "Set Matrix Zero",                       duration: "14:56", initial: 100 },
      { id: "7.1.1.22", title: "Rotate Image",                          duration: "5:32",  initial: 76 },
      { id: "7.1.1.23", title: "Spiral Matrix",                         duration: "20:00", initial: 0 },
      { id: "7.1.1.24", title: "Subarray Sum Equals K",                 duration: "12:24", initial: 28 },
    ],
  },
  {
    id: "7.1.2",
    title: "Linked List",
    videos: [
      { id: "7.1.2.1",  title: "Linked List in One Shot",   duration: "55:00", initial: 5 },
      { id: "7.1.2.2",  title: "Insertion in LL",           duration: "22:00", initial: 2 },
      { id: "7.1.2.3",  title: "Deletion in LL",            duration: "18:42", initial: 0 },
      { id: "7.1.2.4",  title: "Count Nodes in LL",         duration: "4:14",  initial: 0 },
      { id: "7.1.2.5",  title: "Doubly LL Implementation",  duration: "17:27", initial: 0 },
      { id: "7.1.2.6",  title: "Delete Node in DLL",        duration: "15:12", initial: 0 },
      { id: "7.1.2.7",  title: "Reverse DLL",               duration: "7:57",  initial: 0 },
      { id: "7.1.2.8",  title: "Tortoise & Hare Method",    duration: "9:17",  initial: 0 },
      { id: "7.1.2.9",  title: "Reverse LL",                duration: "15:12", initial: 0 },
      { id: "7.1.2.10", title: "Linked List in One Shot II", duration: "25:00", initial: 0 },
    ],
  },
  {
    id: "7.1.3",
    title: "Searching & Sorting",
    videos: [
      { id: "7.1.3.1", title: "Searching & Sorting in One Shot", duration: "1:02:00", initial: 25 },
    ],
  },
  {
    id: "7.1.4",
    title: "Sliding Window",
    videos: [
      { id: "7.1.4.1", title: "Longest Substring Without Repeating Chars", duration: "21:00", initial: 100 },
      { id: "7.1.4.2", title: "Max Consecutive Ones III",                  duration: "13:39", initial: 0 },
      { id: "7.1.4.3", title: "Fruits Into Basket",                        duration: "15:06", initial: 0 },
      { id: "7.1.4.4", title: "Longest Repeating Character Replacement",   duration: "13:45", initial: 0 },
      { id: "7.1.4.5", title: "Count Number of Nice Substrings",           duration: "12:14", initial: 0 },
      { id: "7.1.4.6", title: "Substrings Containing All Three Chars",     duration: "9:56",  initial: 0 },
      { id: "7.1.4.7", title: "Maximum Points You Can Obtain From Cards",  duration: "16:52", initial: 0 },
    ],
  },
  {
    id: "7.1.5",
    title: "Stack & Queue",
    videos: [
      { id: "7.1.5.1", title: "Stack & Queue in One Shot",  duration: "56:00",   initial: 0 },
      { id: "7.1.5.2", title: "Valid Parenthesis",          duration: "9:34",    initial: 0 },
      { id: "7.1.5.3", title: "Min Stack",                  duration: "12:27",   initial: 0 },
      { id: "7.1.5.4", title: "Pre/Post/Infix in One Shot", duration: "54:00",   initial: 0 },
      { id: "7.1.5.5", title: "Recursion in One Shot",      duration: "1:15:00", initial: 0 },
    ],
  },
  {
    id: "7.1.6",
    title: "Strings",
    videos: [
      { id: "7.1.6.1", title: "Strings in One Shot",           duration: "59:00", initial: 27 },
      { id: "7.1.6.2", title: "Sum of Beauty of All Substrings", duration: "12:30", initial: 11 },
      { id: "7.1.6.3", title: "Longest Palindromic Substring", duration: "26:00", initial: 0 },
      { id: "7.1.6.4", title: "Count Number of Substrings",    duration: "29:00", initial: 0 },
      { id: "7.1.6.5", title: "String to Integer (ATOI)",      duration: "13:36", initial: 0 },
      { id: "7.1.6.6", title: "Max Nesting Depth",             duration: "5:40",  initial: 0 },
      { id: "7.1.6.7", title: "Roman to Integer",              duration: "23:00", initial: 0 },
      { id: "7.1.6.8", title: "Sort Characters by Frequency",  duration: "17:10", initial: 0 },
    ],
  },
];

export type CurriculumProgress = Record<string, number>; // videoId -> 0..100
export type DailyVideoCount = Record<string, string[]>;  // dateISO -> videoIds completed (>=100) on that day

const CKEY = "preptrack_curriculum_v1";
const DKEY = "preptrack_daily_videos_v1";

export function defaultProgress(): CurriculumProgress {
  const out: CurriculumProgress = {};
  CURRICULUM.forEach((t) => t.videos.forEach((v) => (out[v.id] = v.initial)));
  return out;
}

export function loadProgress(): CurriculumProgress {
  try {
    const raw = localStorage.getItem(CKEY);
    if (raw) {
      const stored = JSON.parse(raw) as CurriculumProgress;
      // Merge any newly-added videos with their defaults
      const merged = { ...defaultProgress(), ...stored };
      return merged;
    }
  } catch {}
  return defaultProgress();
}

export function saveProgress(p: CurriculumProgress) {
  localStorage.setItem(CKEY, JSON.stringify(p));
}

export function loadDailyVideos(): DailyVideoCount {
  try {
    const raw = localStorage.getItem(DKEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveDailyVideos(d: DailyVideoCount) {
  localStorage.setItem(DKEY, JSON.stringify(d));
}

export function topicPct(topic: Topic, p: CurriculumProgress) {
  const sum = topic.videos.reduce((acc, v) => acc + (p[v.id] ?? 0), 0);
  return Math.round(sum / topic.videos.length);
}

export function topicCompleted(topic: Topic, p: CurriculumProgress) {
  return topic.videos.filter((v) => (p[v.id] ?? 0) >= 100).length;
}

export function overallPct(p: CurriculumProgress) {
  const all = CURRICULUM.flatMap((t) => t.videos);
  const sum = all.reduce((acc, v) => acc + (p[v.id] ?? 0), 0);
  return Math.round(sum / all.length);
}

export function totalVideos() {
  return CURRICULUM.reduce((a, t) => a + t.videos.length, 0);
}

export function completedVideos(p: CurriculumProgress) {
  return CURRICULUM.flatMap((t) => t.videos).filter((v) => (p[v.id] ?? 0) >= 100).length;
}
