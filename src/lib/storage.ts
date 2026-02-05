import { UserProgress, ChapterType } from "@/types/game";
import { config } from "@/data/curriculum";
import { XP_PER_LEVEL } from "@/lib/constants";

// Derive storage keys from site config name to avoid collisions
// when multiple instances run on the same domain
const prefix = config.siteName.toLowerCase().replace(/\s+/g, "_");
const STORAGE_KEY = `${prefix}_progress`;
const LAST_PLAYED_KEY = `${prefix}_last_played`;

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  currentChapter: "ai-foundations",
  completedLevels: [],
  streak: 0,
  conceptScores: {},
};

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateProgress(updates: Partial<UserProgress>): UserProgress {
  const current = getProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

export function addXP(amount: number): UserProgress {
  const current = getProgress();
  const newXP = current.xp + amount;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

  return updateProgress({
    xp: newXP,
    level: newLevel,
  });
}

export function completeLevel(
  chapterId: ChapterType,
  levelId: number
): UserProgress {
  const current = getProgress();
  const levelKey = `${chapterId}-${levelId}`;

  if (!current.completedLevels.includes(levelKey)) {
    return updateProgress({
      completedLevels: [...current.completedLevels, levelKey],
    });
  }
  return current;
}

export function updateConceptScore(
  conceptId: string,
  isCorrect: boolean
): UserProgress {
  const current = getProgress();
  const existing = current.conceptScores[conceptId] || {
    correct: 0,
    incorrect: 0,
    lastSeen: 0,
  };

  return updateProgress({
    conceptScores: {
      ...current.conceptScores,
      [conceptId]: {
        correct: existing.correct + (isCorrect ? 1 : 0),
        incorrect: existing.incorrect + (isCorrect ? 0 : 1),
        lastSeen: Date.now(),
      },
    },
  });
}

export function getConceptsForReview(limit = 5): string[] {
  const current = getProgress();

  // Find concepts with more incorrect than correct answers
  const needsReview = Object.entries(current.conceptScores)
    .filter(([, score]) => score.incorrect > score.correct)
    .sort((a, b) => a[1].lastSeen - b[1].lastSeen) // oldest first
    .slice(0, limit)
    .map(([id]) => id);

  return needsReview;
}

export function updateStreak(): UserProgress {
  const current = getProgress();
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreak = current.streak;

  if (lastPlayed === yesterday) {
    // Played yesterday, increment streak
    newStreak = current.streak + 1;
  } else if (lastPlayed !== today) {
    // Didn't play yesterday or today, reset streak
    newStreak = 0;
  }
  // If lastPlayed === today, keep current streak

  localStorage.setItem(LAST_PLAYED_KEY, today);

  return updateProgress({ streak: newStreak });
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LAST_PLAYED_KEY);
}
