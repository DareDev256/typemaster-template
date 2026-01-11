"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Concept } from "@/types/game";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "./TypingInput";
import { Button } from "@/components/ui/Button";
import { explainConcept, ConceptExplanation } from "@/lib/openai";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useGameStats } from "@/hooks/useGameStats";

interface AIExplainModeProps {
  concepts: Concept[];
  onExit: () => void;
}

export function AIExplainMode({ concepts, onExit }: AIExplainModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [conceptsExplored, setConceptsExplored] = useState(0);

  const prevInputRef = useRef("");
  const { playSound } = useSoundEffects();
  const { stats, startTracking, recordKeypress, reset: resetStats } = useGameStats();

  // Shuffle concepts on mount
  const [shuffledConcepts] = useState(() =>
    [...concepts].sort(() => Math.random() - 0.5)
  );

  const currentConcept = shuffledConcepts[currentIndex % shuffledConcepts.length];

  const handleInputChange = useCallback(
    (value: string) => {
      // Start tracking on first keystroke
      if (prevInputRef.current === "" && value !== "") {
        startTracking();
      }

      const prevLength = prevInputRef.current.length;
      const newLength = value.length;

      // Record keypress for stats
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
    [currentConcept, startTracking, recordKeypress, playSound]
  );

  const handleTypingComplete = useCallback(async () => {
    playSound("correct");
    setIsTypingComplete(true);
    setIsLoadingExplanation(true);
    setError(null);

    try {
      const result = await explainConcept(currentConcept);
      setExplanation(result);
      setConceptsExplored((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get explanation");
    } finally {
      setIsLoadingExplanation(false);
    }
  }, [currentConcept, playSound]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setIsTypingComplete(false);
    setExplanation(null);
    setError(null);
    prevInputRef.current = "";
    resetStats();
  }, [resetStats]);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6 flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={onExit}>
          ← EXIT
        </Button>
        <span className="font-pixel text-[10px] text-arcade-neon-magenta">
          🧠 AI EXPLAIN MODE
        </span>
        <span className="font-pixel text-sm text-arcade-neon-green">
          {conceptsExplored} learned
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isTypingComplete ? (
          /* Typing Phase */
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl text-center"
          >
            {/* Definition */}
            <div className="mb-8">
              <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-4">
                DEFINITION
              </p>
              <p className="font-pixel text-sm md:text-base text-white leading-relaxed">
                {currentConcept.definition}
              </p>
            </div>

            {/* Typing area */}
            <div className="mb-6">
              <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-4">
                TYPE THE TERM TO LEARN MORE
              </p>
              <div className="relative">
                <TypingDisplay
                  targetText={currentConcept.term}
                  userInput={userInput}
                />
                <TypingInput
                  value={userInput}
                  onChange={handleInputChange}
                  onComplete={handleTypingComplete}
                  targetText={currentConcept.term}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="font-pixel text-[8px] text-gray-500">WPM</p>
                <p className="font-pixel text-sm text-arcade-neon-green">
                  {stats.wpm}
                </p>
              </div>
              <div>
                <p className="font-pixel text-[8px] text-gray-500">ACCURACY</p>
                <p className="font-pixel text-sm text-arcade-neon-cyan">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Explanation Phase */
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            {/* Term header */}
            <div className="text-center mb-6">
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="font-pixel text-xl md:text-2xl text-arcade-neon-green neon-glow"
              >
                {currentConcept.term.toUpperCase()}
              </motion.h2>
              <p className="font-pixel text-[10px] text-gray-500 mt-2">
                {currentConcept.definition}
              </p>
            </div>

            {isLoadingExplanation ? (
              <div className="text-center py-8">
                <motion.p
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="font-pixel text-arcade-neon-magenta mb-4"
                >
                  🤖 AI IS EXPLAINING...
                </motion.p>
                <p className="font-pixel text-[10px] text-gray-500">
                  Creating a personalized explanation
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="font-pixel text-arcade-error mb-4">{error}</p>
                <Button onClick={handleTypingComplete}>TRY AGAIN</Button>
              </div>
            ) : explanation ? (
              <div className="space-y-4">
                {/* Analogy */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-arcade-dark border border-arcade-neon-cyan p-4"
                >
                  <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-2">
                    💡 THINK OF IT LIKE...
                  </p>
                  <p className="font-pixel text-sm text-white leading-relaxed">
                    {explanation.analogy}
                  </p>
                </motion.div>

                {/* Example */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-arcade-dark border border-arcade-neon-green p-4"
                >
                  <p className="font-pixel text-[10px] text-arcade-neon-green mb-2">
                    🌍 REAL-WORLD EXAMPLE
                  </p>
                  <p className="font-pixel text-sm text-white leading-relaxed">
                    {explanation.example}
                  </p>
                </motion.div>

                {/* Why it matters */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-arcade-dark border border-arcade-neon-magenta p-4"
                >
                  <p className="font-pixel text-[10px] text-arcade-neon-magenta mb-2">
                    ⭐ WHY IT MATTERS
                  </p>
                  <p className="font-pixel text-sm text-white leading-relaxed">
                    {explanation.whyItMatters}
                  </p>
                </motion.div>

                {/* Next button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center pt-4"
                >
                  <Button onClick={handleNext} size="lg">
                    NEXT CONCEPT →
                  </Button>
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
