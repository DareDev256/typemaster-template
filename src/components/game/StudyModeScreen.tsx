"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Concept } from "@/types/game";
import { Button } from "@/components/ui/Button";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface StudyModeScreenProps {
  concepts: Concept[];
  title: string;
  onComplete: () => void;
}

export function StudyModeScreen({
  concepts,
  title,
  onComplete,
}: StudyModeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  const { playSound } = useSoundEffects();
  const currentConcept = concepts[currentIndex];
  const isLastConcept = currentIndex === concepts.length - 1;

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-advance when time runs out
          if (isLastConcept) {
            onComplete();
          } else {
            setCurrentIndex((i) => i + 1);
            return 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isLastConcept, onComplete]);

  // Reset timer when index changes
  useEffect(() => {
    setTimeLeft(60);
  }, [currentIndex]);

  // Play sound on concept change
  useEffect(() => {
    if (currentIndex > 0) {
      playSound("keypress");
    }
  }, [currentIndex, playSound]);

  const handleNext = useCallback(() => {
    if (isLastConcept) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastConcept, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleSkipAll = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-arcade-black flex flex-col items-center justify-center z-50 p-4 md:p-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 md:mb-8"
      >
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-pixel text-[10px] text-arcade-neon-cyan mb-2"
        >
          📚 STUDY TIME
        </motion.p>
        <h1 className="font-pixel text-lg md:text-xl text-arcade-neon-green">
          {title}
        </h1>
      </motion.div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {concepts.map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-sm ${
              i === currentIndex
                ? "bg-arcade-neon-green"
                : i < currentIndex
                  ? "bg-arcade-neon-cyan"
                  : "bg-arcade-dark"
            }`}
            animate={i === currentIndex ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="mb-6">
        <span
          className={`font-pixel text-2xl ${
            timeLeft <= 10 ? "text-arcade-error" : "text-arcade-neon-yellow"
          }`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Concept card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full max-w-2xl bg-arcade-dark border border-arcade-neon-cyan p-6 md:p-8 rounded-sm mb-8"
        >
          {/* Term */}
          <div className="text-center mb-6">
            <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-2">
              TERM
            </p>
            <h2 className="font-pixel text-xl md:text-2xl text-arcade-neon-green neon-glow">
              {currentConcept?.term}
            </h2>
          </div>

          {/* Definition */}
          <div className="text-center">
            <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-4">
              DEFINITION
            </p>
            <p className="font-pixel text-sm md:text-base text-white leading-relaxed">
              {currentConcept?.definition}
            </p>
          </div>

          {/* Difficulty badge */}
          <div className="mt-6 flex justify-center">
            <span
              className={`font-pixel text-[8px] px-3 py-1 rounded-sm ${
                currentConcept?.difficulty === "easy"
                  ? "bg-arcade-neon-green/20 text-arcade-neon-green"
                  : currentConcept?.difficulty === "medium"
                    ? "bg-arcade-neon-yellow/20 text-arcade-neon-yellow"
                    : "bg-arcade-error/20 text-arcade-error"
              }`}
            >
              {currentConcept?.difficulty?.toUpperCase()}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← PREV
        </Button>

        <Button onClick={handleNext}>
          {isLastConcept ? "FINISH" : "NEXT →"}
        </Button>
      </div>

      {/* Skip all button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleSkipAll}
        className="mt-6 font-pixel text-[10px] text-gray-500 hover:text-arcade-neon-cyan transition-colors"
      >
        SKIP ALL
      </motion.button>

      {/* Concept counter */}
      <p className="mt-4 font-pixel text-[10px] text-gray-600">
        {currentIndex + 1} / {concepts.length}
      </p>
    </motion.div>
  );
}
