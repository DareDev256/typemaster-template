"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

interface QuizModeProps {
  concepts: Concept[];
  onComplete: (results: { xp: number; accuracy: number; wpm: number }) => void;
  timePerQuestion?: number;
}

export function QuizMode({
  concepts,
  onComplete,
  timePerQuestion = 30,
}: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const currentConcept = concepts[currentIndex];
  const isLastQuestion = currentIndex === concepts.length - 1;
  const prevInputRef = useRef("");
  const timeWarningPlayedRef = useRef(false);

  const {
    stats,
    startTracking,
    stopTracking,
    recordKeypress,
    reset: resetStats,
  } = useGameStats();

  const { playSound } = useSoundEffects();

  const finishGame = useCallback(() => {
    stopTracking();
    setShowVictory(true);
  }, [stopTracking]);

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setShowAnswer(false);
    prevInputRef.current = "";
  }, []);

  const handleTimeUp = useCallback(() => {
    playSound("incorrect");
    setShowAnswer(true);
    setTimeout(() => {
      if (!isLastQuestion) {
        nextQuestion();
      } else {
        finishGame();
      }
    }, 2000);
  }, [isLastQuestion, nextQuestion, finishGame, playSound]);

  const { timeLeft, progress, start, reset: resetTimer } = useTimer({
    initialTime: timePerQuestion,
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

  // Reset timer when moving to next question
  useEffect(() => {
    if (isStarted && currentIndex > 0) {
      resetTimer();
      start();
      timeWarningPlayedRef.current = false;
    }
  }, [currentIndex, isStarted, resetTimer, start]);

  // Play time warning sound
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && isStarted && !timeWarningPlayedRef.current) {
      playSound("timeWarning");
      timeWarningPlayedRef.current = true;
    }
  }, [timeLeft, isStarted, playSound]);

  const handleComplete = useCallback(() => {
    playSound("correct");
    setCorrectAnswers((prev) => prev + 1);

    if (isLastQuestion) {
      finishGame();
    } else {
      setTimeout(nextQuestion, 500);
    }
  }, [isLastQuestion, nextQuestion, finishGame, playSound]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (showAnswer) return;

      // Start game on first keystroke
      handleStart();

      const prevLength = prevInputRef.current.length;
      const newLength = value.length;

      // Only record when adding characters (not backspace)
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
    [showAnswer, handleStart, currentConcept, recordKeypress, playSound]
  );

  const calculateXP = useCallback(() => {
    const baseXP = correctAnswers * XP_PER_CORRECT_ANSWER;
    const accuracyBonus =
      stats.accuracy >= ACCURACY_BONUS_THRESHOLD
        ? Math.round(baseXP * ACCURACY_BONUS_MULTIPLIER)
        : 0;
    return baseXP + accuracyBonus;
  }, [correctAnswers, stats.accuracy]);

  if (showVictory) {
    return (
      <VictoryScreen
        title={stats.accuracy === 100 ? "PERFECT!" : "LEVEL UP!"}
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
      {/* Progress indicator */}
      <div className="w-full max-w-2xl mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-[10px] text-arcade-neon-cyan">
            QUESTION {currentIndex + 1}/{concepts.length}
          </span>
        </div>
        <Timer timeLeft={timeLeft} progress={progress} />
      </div>

      {/* Definition display */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12 max-w-2xl"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-4">
          DEFINITION
        </p>
        <p className="font-pixel text-sm md:text-base text-white leading-relaxed">
          {currentConcept?.definition}
        </p>
      </motion.div>

      {/* Typing area */}
      <div className="relative w-full max-w-2xl text-center mb-6 md:mb-8">
        <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-4">
          TYPE THE TERM
        </p>

        {showAnswer ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-pixel text-xl md:text-2xl text-arcade-error"
          >
            {currentConcept?.term}
          </motion.div>
        ) : (
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
              disabled={showAnswer}
            />
          </div>
        )}

        {!isStarted && (
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="font-pixel text-[10px] text-gray-500 mt-4"
          >
            START TYPING TO BEGIN
          </motion.p>
        )}
      </div>

      {/* Stats */}
      <Stats
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        correctCount={correctAnswers}
        totalCount={currentIndex + (showAnswer ? 1 : 0)}
      />
    </div>
  );
}
