import { chapters, concepts } from "@/data/curriculum";
import { getApiKey } from "@/lib/openai";
import type { Chapter, Concept, UserProgress } from "@/types/game";

// ─── URL Parameter Validation ────────────────────────────────────────

/** Validates that a level ID is a positive integer */
export function isValidLevelId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/** Finds a chapter by ID, returning undefined if not found */
export function findChapter(chapterId: string): Chapter | undefined {
  return chapters.find((c) => c.id === chapterId);
}

/**
 * Validates level page params and returns the resolved chapter + level,
 * or a descriptive error message.
 */
export function validateLevelParams(
  chapterId: string,
  levelId: number
): { valid: true; chapter: Chapter; level: Chapter["levels"][number] } | { valid: false; error: string } {
  if (!isValidLevelId(levelId)) {
    return { valid: false, error: "Invalid level ID — must be a positive number" };
  }

  const chapter = findChapter(chapterId);
  if (!chapter) {
    return { valid: false, error: `Unknown chapter "${chapterId}"` };
  }

  const level = chapter.levels.find((l) => l.id === levelId);
  if (!level) {
    return { valid: false, error: "Level not found" };
  }

  return { valid: true, chapter, level };
}

// ─── API Key Validation ─────────────────────────────────────────────

/** Checks whether an OpenAI API key is configured in localStorage */
export function hasApiKey(): boolean {
  return !!getApiKey();
}

// ─── Progress-Based Validation ──────────────────────────────────────

/**
 * Extracts concepts from chapters where the user has completed
 * at least one level. Returns an empty array if no progress exists.
 */
export function getCompletedConcepts(progress: UserProgress | null): Concept[] {
  if (!progress) return [];

  const completedChapters = new Set(
    progress.completedLevels.map((level) => level.split("-")[0])
  );

  return concepts.filter((c) => completedChapters.has(c.chapter));
}
