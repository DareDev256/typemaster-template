"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { getSiteConfig, chapters } from "@/data/curriculum";

export default function Home() {
  const config = getSiteConfig();
  const showAIChallenge = config.features?.aiChallenge !== false;

  // Generate topics from chapter titles
  const topics = chapters.slice(0, 4).map((c) => c.title.toUpperCase());
  const topicsText = topics.join(" • ");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <Logo />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex flex-col gap-4"
      >
        <Link href="/play">
          <Button size="lg">START GAME</Button>
        </Link>
        {showAIChallenge && (
          <Link href="/challenge">
            <Button variant="secondary" size="lg">
              AI CHALLENGE
            </Button>
          </Link>
        )}
        <div className="flex gap-3">
          <Link href="/leaderboard" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              LEADERBOARD
            </Button>
          </Link>
          <Link href="/settings" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              SETTINGS
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-cyan mb-2">
          {topicsText}
        </p>
        <motion.p
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-pixel text-[10px] text-gray-500"
        >
          PRESS START TO BEGIN
        </motion.p>
      </motion.div>

      {/* Decorative corners */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-arcade-neon-green opacity-50" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-arcade-neon-green opacity-50" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-arcade-neon-green opacity-50" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-arcade-neon-green opacity-50" />
    </main>
  );
}
