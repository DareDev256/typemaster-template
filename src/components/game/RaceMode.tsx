"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Concept } from "@/types/game";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "./TypingInput";
import { Timer } from "./Timer";
import { Stats } from "./Stats";
import { VictoryScreen } from "./VictoryScreen";
import { useTimer } from "@/hooks/useTimer";
import { useGameStats } from "@/hooks/useGameStats";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import {
  XP_PER_CORRECT_ANSWER,
  ACCURACY_BONUS_THRESHOLD,
  ACCURACY_BONUS_MULTIPLIER,
} from "@/lib/constants";

interface RaceModeProps {
  concepts: Concept[];
  onComplete: (results: { xp: number; accuracy: number; wpm: number }) => void;
  duration?: number;
}

export function RaceMode({
  concepts,
  onComplete,
  duration = 60,
}: RaceModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const prevInputRef = useRef("");
  const timeWarningPlayedRef = useRef(false);

  const { playSound } = useSoundEffects();

  // Shuffle concepts once; use modulo indexing to cycle through them
  const shuffledConcepts = useMemo(() => {
    return [...concepts].sort(() => Math.random() - 0.5);
  }, [concepts]);

  const currentConcept = shuffledConcepts[currentIndex % shuffledConcepts.length];

  const { stats, startTracking, stopTracking, recordKeypress } = useGameStats();

  const handleTimeUp = useCallback(() => {
    stopTracking();
    setShowVictory(true);
  }, [stopTracking]);

  const { timeLeft, progress, start } = useTimer({
    initialTime: duration,
    onTimeUp: handleTimeUp,
  });

  // Start game on first interaction
  const handleStart = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      start();
      startTracking();
    }
  }, [isStarted, start, startTracking]);

  const nextConcept = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    prevInputRef.current = "";
  }, []);

  const handleComplete = useCallback(() => {
    playSound("correct");
    setCorrectAnswers((prev) => prev + 1);
    nextConcept();
  }, [nextConcept, playSound]);

  const handleSkip = useCallback(() => {
    if (!isStarted) return;
    setSkipped((prev) => prev + 1);
    nextConcept();
  }, [isStarted, nextConcept]);

  const handleInputChange = useCallback(
    (value: string) => {
      // Start game on first keystroke
      handleStart();

      const prevLength = prevInputRef.current.length;
      const newLength = value.length;

      // Only record when adding characters
      if (newLength > prevLength && currentConcept) {
        const newChar = value[newLength - 1];
        const expectedChar = currentConcept.term[newLength - 1];
        const isCorrect = newChar?.toLowerCase() === expectedChar?.toLowerCase();
        recordKeypress(isCorrect);
        playSound("keypress");
      }

      prevInputRef.current = value;
      setUserInput(value);
    },
    [handleStart, currentConcept, recordKeypress, playSound]
  );

  // Handle Tab key for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Play time warning sound
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && isStarted && !timeWarningPlayedRef.current) {
      playSound("timeWarning");
      timeWarningPlayedRef.current = true;
    }
  }, [timeLeft, isStarted, playSound]);

  const calculateXP = useCallback(() => {
    const baseXP = correctAnswers * XP_PER_CORRECT_ANSWER;
    const accuracyBonus =
      stats.accuracy >= ACCURACY_BONUS_THRESHOLD
        ? Math.round(baseXP * ACCURACY_BONUS_MULTIPLIER)
        : 0;
    const speedBonus = correctAnswers >= 10 ? 50 : 0;
    return baseXP + accuracyBonus + speedBonus;
  }, [correctAnswers, stats.accuracy]);

  if (showVictory) {
    return (
      <VictoryScreen
        title={
          correctAnswers >= 15
            ? "SPEED DEMON!"
            : correctAnswers >= 10
            ? "GREAT RUN!"
            : "LEVEL UP!"
        }
        xpEarned={calculateXP()}
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        onContinue={() =>
          onComplete({
            xp: calculateXP(),
            accuracy: stats.accuracy,
            wpm: stats.wpm,
          })
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Timer */}
      <div className="w-full max-w-2xl mb-6 md:mb-8">
        <Timer timeLeft={timeLeft} progress={progress} />
      </div>

      {/* Current score */}
      <div className="mb-6 md:mb-8">
        <motion.p
          key={correctAnswers}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="font-pixel text-4xl md:text-5xl text-arcade-neon-green neon-glow"
        >
          {correctAnswers}
        </motion.p>
        <p className="font-pixel text-[10px] text-arcade-neon-cyan text-center mt-2">
          CORRECT
        </p>
      </div>

      {/* Term to type */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center mb-6 md:mb-8 w-full max-w-2xl"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-4">
          TYPE THIS TERM
        </p>
        <div className="relative">
          <TypingDisplay
            targetText={currentConcept?.term || ""}
            userInput={userInput}
          />
          <TypingInput
            value={userInput}
            onChange={handleInputChange}
            onComplete={handleComplete}
            targetText={currentConcept?.term || ""}
          />
        </div>
      </motion.div>

      {/* Definition hint */}
      <div className="max-w-xl text-center mb-6 md:mb-8">
        <p className="font-pixel text-[10px] text-gray-500 leading-relaxed">
          {currentConcept?.definition}
        </p>
      </div>

      {/* Instructions */}
      {!isStarted ? (
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-pixel text-[10px] text-gray-500"
        >
          START TYPING TO BEGIN
        </motion.p>
      ) : (
        <p className="font-pixel text-[10px] text-gray-600">
          PRESS TAB TO SKIP
        </p>
      )}

      {/* Stats */}
      <div className="mt-6 md:mt-8">
        <Stats wpm={stats.wpm} accuracy={stats.accuracy} />
      </div>
    </div>
  );
}
