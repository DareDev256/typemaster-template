"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PixelConfetti } from "@/components/effects/PixelConfetti";
import { Button } from "@/components/ui/Button";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface VictoryScreenProps {
  title?: string;
  xpEarned: number;
  wpm: number;
  accuracy: number;
  onContinue: () => void;
  onRetry: () => void;
}

export function VictoryScreen({
  title = "LEVEL UP!",
  xpEarned,
  wpm,
  accuracy,
  onContinue,
  onRetry,
}: VictoryScreenProps) {
  const { playSound } = useSoundEffects();

  // Play victory fanfare on mount
  useEffect(() => {
    playSound("levelComplete");
  }, [playSound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-arcade-black/95 flex items-center justify-center z-40"
    >
      <PixelConfetti />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center px-8"
      >
        {/* Flashing title */}
        <motion.h1
          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="font-pixel text-3xl md:text-5xl lg:text-6xl text-arcade-neon-green neon-glow mb-8"
        >
          {title}
        </motion.h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 md:gap-12 justify-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-pixel text-[10px] md:text-xs text-arcade-neon-cyan mb-2">
              XP EARNED
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-pixel text-2xl md:text-3xl text-arcade-neon-yellow"
            >
              +{xpEarned}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="font-pixel text-[10px] md:text-xs text-arcade-neon-cyan mb-2">
              WPM
            </p>
            <p className="font-pixel text-2xl md:text-3xl text-arcade-neon-green">
              {wpm}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-pixel text-[10px] md:text-xs text-arcade-neon-cyan mb-2">
              ACCURACY
            </p>
            <p className="font-pixel text-2xl md:text-3xl text-arcade-neon-magenta">
              {accuracy}%
            </p>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={onContinue} size="lg">
            CONTINUE
          </Button>
          <Button onClick={onRetry} variant="secondary" size="lg">
            RETRY
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
