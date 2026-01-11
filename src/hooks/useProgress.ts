"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, ChapterType } from "@/types/game";
import { chapters } from "@/data/curriculum";
import {
  getProgress,
  addXP,
  completeLevel,
  updateConceptScore,
  updateStreak,
  getConceptsForReview,
} from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    setProgress(getProgress());
    setIsLoading(false);
  }, []);

  const earnXP = useCallback((amount: number) => {
    const updated = addXP(amount);
    setProgress(updated);
    return updated;
  }, []);

  const markLevelComplete = useCallback(
    (chapterId: ChapterType, levelId: number) => {
      const updated = completeLevel(chapterId, levelId);
      setProgress(updated);
      return updated;
    },
    []
  );

  const recordConceptAttempt = useCallback(
    (conceptId: string, isCorrect: boolean) => {
      const updated = updateConceptScore(conceptId, isCorrect);
      setProgress(updated);
      return updated;
    },
    []
  );

  const checkStreak = useCallback(() => {
    const updated = updateStreak();
    setProgress(updated);
    return updated;
  }, []);

  const getReviewConcepts = useCallback((limit?: number) => {
    return getConceptsForReview(limit);
  }, []);

  const isLevelUnlocked = useCallback(
    (chapterId: ChapterType, levelId: number) => {
      if (!progress) return false;
      if (levelId === 1) return true;

      // Previous level must be completed
      const prevLevelKey = `${chapterId}-${levelId - 1}`;
      return progress.completedLevels.includes(prevLevelKey);
    },
    [progress]
  );

  const isLevelCompleted = useCallback(
    (chapterId: ChapterType, levelId: number) => {
      if (!progress) return false;
      return progress.completedLevels.includes(`${chapterId}-${levelId}`);
    },
    [progress]
  );

  const isChapterUnlocked = useCallback(
    (chapterIndex: number) => {
      if (!progress) return false;
      if (chapterIndex === 0) return true;

      // Require level 10 * chapterIndex to unlock
      return progress.level >= chapterIndex * 10 + 1;
    },
    [progress]
  );

  const getCompletedLevelsForChapter = useCallback(
    (chapterId: ChapterType) => {
      if (!progress) return 0;
      return progress.completedLevels.filter((id) =>
        id.startsWith(chapterId)
      ).length;
    },
    [progress]
  );

  const isChapterComplete = useCallback(
    (chapterId: ChapterType) => {
      if (!progress) return false;
      const chapter = chapters.find((c) => c.id === chapterId);
      if (!chapter) return false;
      const totalLevels = chapter.levels.length;
      const completedLevels = getCompletedLevelsForChapter(chapterId);
      return completedLevels >= totalLevels;
    },
    [progress, getCompletedLevelsForChapter]
  );

  return {
    progress,
    isLoading,
    earnXP,
    markLevelComplete,
    recordConceptAttempt,
    checkStreak,
    getReviewConcepts,
    isLevelUnlocked,
    isLevelCompleted,
    isChapterUnlocked,
    isChapterComplete,
    getCompletedLevelsForChapter,
  };
}
