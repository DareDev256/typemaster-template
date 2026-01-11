"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chapter } from "@/types/game";
import { PixelIcon } from "@/components/ui/PixelIcon";

interface ChapterCardProps {
  chapter: Chapter;
  isUnlocked: boolean;
  completedLevels: number;
  index: number;
}

export function ChapterCard({
  chapter,
  isUnlocked,
  completedLevels,
  index,
}: ChapterCardProps) {
  const totalLevels = chapter.levels.length;
  const progress = (completedLevels / totalLevels) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={isUnlocked ? `/play/${chapter.id}` : "#"}
        className={`block ${!isUnlocked ? "cursor-not-allowed" : ""}`}
        onClick={(e) => !isUnlocked && e.preventDefault()}
      >
        <motion.div
          whileHover={isUnlocked ? { scale: 1.02 } : {}}
          whileTap={isUnlocked ? { scale: 0.98 } : {}}
          className={`p-6 border-2 ${
            isUnlocked
              ? "border-arcade-neon-green hover:border-arcade-neon-cyan"
              : "border-gray-700 opacity-50"
          } bg-arcade-dark/50 transition-colors`}
        >
          <div className="flex items-start justify-between mb-4">
            <PixelIcon name={chapter.icon} size={48} />
            {!isUnlocked && (
              <span className="font-pixel text-[10px] text-gray-500">
                🔒 LOCKED
              </span>
            )}
            {isUnlocked && completedLevels === totalLevels && (
              <span className="font-pixel text-[10px] text-arcade-neon-green">
                ✓ COMPLETE
              </span>
            )}
          </div>

          <h3 className="font-pixel text-sm md:text-base text-arcade-neon-green mb-2">
            {chapter.title.toUpperCase()}
          </h3>
          <p className="font-pixel text-[10px] text-gray-400 mb-4 leading-relaxed">
            {chapter.description}
          </p>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] font-pixel mb-1">
              <span className="text-arcade-neon-cyan">PROGRESS</span>
              <span className="text-arcade-neon-magenta">
                {completedLevels}/{totalLevels}
              </span>
            </div>
            <div className="h-2 bg-arcade-black rounded-sm overflow-hidden border border-gray-700">
              <motion.div
                className="h-full bg-arcade-neon-green"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
