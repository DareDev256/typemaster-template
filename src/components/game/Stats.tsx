"use client";

import { motion } from "framer-motion";

interface StatsProps {
  wpm: number;
  accuracy: number;
  correctCount?: number;
  totalCount?: number;
}

export function Stats({ wpm, accuracy, correctCount, totalCount }: StatsProps) {
  return (
    <div className="flex gap-6 md:gap-8 justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-1">WPM</p>
        <p className="font-pixel text-lg md:text-2xl text-arcade-neon-green">
          {wpm}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-1">
          ACCURACY
        </p>
        <p
          className={`font-pixel text-lg md:text-2xl ${
            accuracy >= 90
              ? "text-arcade-neon-green"
              : accuracy >= 70
              ? "text-arcade-neon-yellow"
              : "text-arcade-error"
          }`}
        >
          {accuracy}%
        </p>
      </motion.div>

      {correctCount !== undefined && totalCount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-1">
            SCORE
          </p>
          <p className="font-pixel text-lg md:text-2xl text-arcade-neon-magenta">
            {correctCount}/{totalCount}
          </p>
        </motion.div>
      )}
    </div>
  );
}
