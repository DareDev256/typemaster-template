"use client";

import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
  progress: number;
}

export function Timer({ timeLeft, progress }: TimerProps) {
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-pixel text-[10px] text-arcade-neon-cyan">TIME</span>
        <motion.span
          animate={isLow ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLow ? Infinity : 0 }}
          className={`font-pixel text-sm md:text-base ${
            isCritical
              ? "text-arcade-error"
              : isLow
              ? "text-arcade-neon-yellow"
              : "text-arcade-neon-green"
          }`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="h-3 bg-arcade-dark rounded-sm overflow-hidden border border-gray-700">
        <motion.div
          className={`h-full ${
            isCritical
              ? "bg-arcade-error"
              : isLow
              ? "bg-arcade-neon-yellow"
              : "bg-arcade-neon-green"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
