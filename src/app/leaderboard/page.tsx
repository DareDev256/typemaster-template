"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Placeholder leaderboard data
const mockLeaderboard = [
  { rank: 1, name: "PLAYER_ONE", xp: 15420, level: 154, streak: 42 },
  { rank: 2, name: "CODE_MASTER", xp: 12350, level: 123, streak: 31 },
  { rank: 3, name: "AI_NINJA", xp: 10890, level: 108, streak: 28 },
  { rank: 4, name: "TYPE_WIZARD", xp: 9540, level: 95, streak: 22 },
  { rank: 5, name: "BYTE_RUNNER", xp: 8210, level: 82, streak: 19 },
  { rank: 6, name: "DEV_STREAK", xp: 7650, level: 76, streak: 17 },
  { rank: 7, name: "ALGO_ACE", xp: 6890, level: 68, streak: 14 },
  { rank: 8, name: "ML_MASTER", xp: 5420, level: 54, streak: 11 },
  { rank: 9, name: "STACK_PRO", xp: 4350, level: 43, streak: 8 },
  { rank: 10, name: "NEW_CODER", xp: 3210, level: 32, streak: 5 },
];

export default function LeaderboardPage() {
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
          🏆 LEADERBOARD
        </motion.h1>
        <div className="w-16" />
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8 p-4 border border-arcade-neon-cyan bg-arcade-dark/50"
      >
        <p className="font-pixel text-[10px] text-arcade-neon-cyan">
          🚧 ONLINE LEADERBOARDS COMING SOON 🚧
        </p>
        <p className="font-pixel text-[8px] text-gray-400 mt-2">
          For now, here&apos;s what the top players might look like...
        </p>
      </motion.div>

      {/* Leaderboard Table */}
      <div className="max-w-2xl mx-auto">
        <div className="border border-arcade-dark overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-2 p-3 bg-arcade-dark font-pixel text-[8px] text-arcade-neon-cyan">
            <span>RANK</span>
            <span className="col-span-2">PLAYER</span>
            <span>LEVEL</span>
            <span>STREAK</span>
          </div>

          {/* Leaderboard Rows */}
          {mockLeaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-5 gap-2 p-3 font-pixel text-[10px] border-t border-arcade-dark ${
                player.rank <= 3 ? "bg-arcade-dark/30" : ""
              }`}
            >
              <span
                className={
                  player.rank === 1
                    ? "text-arcade-neon-yellow"
                    : player.rank === 2
                      ? "text-gray-300"
                      : player.rank === 3
                        ? "text-orange-400"
                        : "text-gray-500"
                }
              >
                {player.rank === 1 && "👑 "}
                {player.rank === 2 && "🥈 "}
                {player.rank === 3 && "🥉 "}#{player.rank}
              </span>
              <span className="col-span-2 text-arcade-neon-green truncate">
                {player.name}
              </span>
              <span className="text-arcade-neon-cyan">LV.{player.level}</span>
              <span className="text-arcade-neon-magenta">
                {player.streak}🔥
              </span>
            </motion.div>
          ))}
        </div>

        {/* Your Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 border border-arcade-neon-green bg-arcade-dark/50"
        >
          <p className="font-pixel text-[10px] text-arcade-neon-green mb-2">
            YOUR PROGRESS
          </p>
          <p className="font-pixel text-[8px] text-gray-400">
            Keep playing to climb the ranks! Complete levels, build your streak,
            and earn XP to compete with the best.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
