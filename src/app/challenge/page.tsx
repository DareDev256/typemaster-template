"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AIQuizMode } from "@/components/game/AIQuizMode";
import { AIExplainMode } from "@/components/game/AIExplainMode";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { getApiKey } from "@/lib/openai";
import { concepts } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

type ChallengeMode = "select" | "quiz" | "explain";

export default function ChallengePage() {
  const router = useRouter();
  const [mode, setMode] = useState<ChallengeMode>("select");
  const [hasApiKey, setHasApiKey] = useState(false);
  const { progress, isLoading } = useProgress();

  // Check for API key on mount
  useEffect(() => {
    setHasApiKey(!!getApiKey());
  }, []);

  // Get concepts from completed levels
  const availableConcepts = useMemo(() => {
    if (!progress) return [];

    // Get all concept IDs from completed levels
    const completedChapters = new Set(
      progress.completedLevels.map((level) => level.split("-")[0])
    );

    // Return concepts from chapters where user has completed at least one level
    return concepts.filter((c) => completedChapters.has(c.chapter));
  }, [progress]);

  // Show loading state
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

  // No API key - redirect to settings
  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <p className="font-pixel text-2xl mb-4">🔑</p>
          <h1 className="font-pixel text-lg text-arcade-neon-cyan mb-4">
            API KEY REQUIRED
          </h1>
          <p className="font-pixel text-[10px] text-gray-400 mb-6">
            You need to add your OpenAI API key to use AI Challenge mode. Your
            key is stored locally and only used to generate questions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/settings">
              <Button>GO TO SETTINGS</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">BACK HOME</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // No completed levels - need to play first
  if (availableConcepts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <p className="font-pixel text-2xl mb-4">📚</p>
          <h1 className="font-pixel text-lg text-arcade-neon-yellow mb-4">
            COMPLETE SOME LEVELS FIRST
          </h1>
          <p className="font-pixel text-[10px] text-gray-400 mb-6">
            AI Challenge mode uses concepts from levels you&apos;ve already
            completed. Play some story mode levels first, then come back!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/play">
              <Button>PLAY STORY MODE</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">BACK HOME</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show selected mode
  if (mode === "quiz") {
    return (
      <AIQuizMode
        concepts={availableConcepts}
        onComplete={() => setMode("select")}
        onExit={() => setMode("select")}
      />
    );
  }

  if (mode === "explain") {
    return (
      <AIExplainMode
        concepts={availableConcepts}
        onExit={() => setMode("select")}
      />
    );
  }

  // Mode selection screen
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="secondary" size="sm">
            ← BACK
          </Button>
        </Link>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-pixel text-lg md:text-2xl text-arcade-neon-magenta"
        >
          🤖 AI CHALLENGE
        </motion.h1>
        <SoundToggle />
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-pixel text-[10px] text-gray-500">
          {availableConcepts.length} concepts available from your completed
          levels
        </p>
      </motion.div>

      {/* Mode selection */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Quiz Mode */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode("quiz")}
          className="border-2 border-arcade-neon-cyan bg-arcade-dark p-6 text-left hover:bg-arcade-neon-cyan/10 transition-colors"
        >
          <p className="font-pixel text-3xl mb-4">🎯</p>
          <h2 className="font-pixel text-base text-arcade-neon-cyan mb-2">
            AI QUIZ
          </h2>
          <p className="font-pixel text-[10px] text-gray-400 mb-4">
            AI generates unique multiple-choice questions that test your
            understanding, not just memorization.
          </p>
          <p className="font-pixel text-[8px] text-arcade-neon-green">
            5 questions per round • +20 XP per correct answer
          </p>
        </motion.button>

        {/* AI Explain Mode */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode("explain")}
          className="border-2 border-arcade-neon-green bg-arcade-dark p-6 text-left hover:bg-arcade-neon-green/10 transition-colors"
        >
          <p className="font-pixel text-3xl mb-4">💡</p>
          <h2 className="font-pixel text-base text-arcade-neon-green mb-2">
            AI EXPLAIN
          </h2>
          <p className="font-pixel text-[10px] text-gray-400 mb-4">
            Type concepts correctly, then get AI-powered explanations with
            analogies and real-world examples.
          </p>
          <p className="font-pixel text-[8px] text-arcade-neon-magenta">
            Learn at your own pace • Deep understanding
          </p>
        </motion.button>
      </div>

      {/* Tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center font-pixel text-[8px] text-gray-600 mt-8"
      >
        Tip: Complete more story mode levels to unlock more concepts for AI
        Challenge!
      </motion.p>
    </div>
  );
}
