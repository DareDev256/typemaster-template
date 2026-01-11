"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { chapters } from "@/data/curriculum";
import { ChapterCard } from "@/components/game/ChapterCard";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/hooks/useProgress";
import { ChapterType } from "@/types/game";

export default function PlayPage() {
  const {
    progress,
    isLoading,
    checkStreak,
    isChapterUnlocked,
    getCompletedLevelsForChapter,
  } = useProgress();

  // Update streak on page load
  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-pixel text-arcade-neon-cyan"
        >
          LOADING...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <Link href="/">
          <Button variant="secondary" size="sm">
            ← BACK
          </Button>
        </Link>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-pixel text-lg md:text-2xl text-arcade-neon-green"
        >
          SELECT CHAPTER
        </motion.h1>
        <button
          onClick={() => {
            if (
              confirm(
                "Reset all progress? This cannot be undone!"
              )
            ) {
              localStorage.removeItem("typemaster_progress");
              localStorage.removeItem("typemaster_last_played");
              window.location.reload();
            }
          }}
          className="font-pixel text-[8px] text-gray-500 hover:text-arcade-error transition-colors"
        >
          RESET
        </button>
      </div>

      {/* User stats bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-6 md:gap-8 mb-8 md:mb-12 p-4 border border-arcade-dark"
      >
        <div className="text-center">
          <p className="font-pixel text-[10px] text-arcade-neon-cyan">LEVEL</p>
          <p className="font-pixel text-lg md:text-xl text-arcade-neon-green">
            {progress?.level || 1}
          </p>
        </div>
        <div className="text-center">
          <p className="font-pixel text-[10px] text-arcade-neon-cyan">XP</p>
          <p className="font-pixel text-lg md:text-xl text-arcade-neon-yellow">
            {progress?.xp || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="font-pixel text-[10px] text-arcade-neon-cyan">STREAK</p>
          <p className="font-pixel text-lg md:text-xl text-arcade-neon-magenta">
            {progress?.streak || 0} 🔥
          </p>
        </div>
      </motion.div>

      {/* Chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {chapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            isUnlocked={isChapterUnlocked(index)}
            completedLevels={getCompletedLevelsForChapter(
              chapter.id as ChapterType
            )}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
