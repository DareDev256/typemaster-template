"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Level, ChapterType } from "@/types/game";

interface LevelCardProps {
  level: Level;
  chapterId: ChapterType;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: { wpm: number; accuracy: number };
  index: number;
}

export function LevelCard({
  level,
  chapterId,
  isUnlocked,
  isCompleted,
  bestScore,
  index,
}: LevelCardProps) {
  const modeIcon = level.gameMode === "quiz" ? "📝" : "⚡";
  const modeLabel = level.gameMode === "quiz" ? "QUIZ" : "RACE";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={isUnlocked ? `/play/${chapterId}/${level.id}` : "#"}
        className={`block ${!isUnlocked ? "cursor-not-allowed" : ""}`}
        onClick={(e) => !isUnlocked && e.preventDefault()}
      >
        <motion.div
          whileHover={isUnlocked ? { x: 10 } : {}}
          className={`p-4 border-l-4 ${
            isCompleted
              ? "border-arcade-neon-green bg-arcade-neon-green/10"
              : isUnlocked
              ? "border-arcade-neon-cyan bg-arcade-dark/30 hover:bg-arcade-dark/50"
              : "border-gray-700 bg-arcade-dark/20 opacity-50"
          } transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Level number */}
              <div
                className={`w-10 h-10 flex items-center justify-center border-2 ${
                  isCompleted
                    ? "border-arcade-neon-green text-arcade-neon-green"
                    : isUnlocked
                    ? "border-arcade-neon-cyan text-arcade-neon-cyan"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <span className="font-pixel text-xs">
                  {isCompleted ? "✓" : level.id}
                </span>
              </div>

              {/* Level info */}
              <div>
                <h3 className="font-pixel text-xs text-white">
                  {level.name.toUpperCase()}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-pixel text-[10px] text-arcade-neon-magenta">
                    {modeIcon} {modeLabel}
                  </span>
                  <span className="font-pixel text-[10px] text-gray-500">
                    {level.concepts.length} CONCEPTS
                  </span>
                </div>
              </div>
            </div>

            {/* Best score or lock */}
            <div className="text-right">
              {!isUnlocked ? (
                <span className="font-pixel text-xs text-gray-500">🔒</span>
              ) : isCompleted && bestScore ? (
                <div>
                  <p className="font-pixel text-[10px] text-arcade-neon-green">
                    {bestScore.wpm} WPM
                  </p>
                  <p className="font-pixel text-[10px] text-arcade-neon-magenta">
                    {bestScore.accuracy}%
                  </p>
                </div>
              ) : (
                <span className="font-pixel text-[10px] text-arcade-neon-cyan">
                  PLAY →
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
