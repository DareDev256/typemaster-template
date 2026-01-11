"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { chapters, concepts } from "@/data/curriculum";
import { LevelCard } from "@/components/game/LevelCard";
import { StudyModeScreen } from "@/components/game/StudyModeScreen";
import { Button } from "@/components/ui/Button";
import { ChapterType } from "@/types/game";
import { useProgress } from "@/hooks/useProgress";

export default function ChapterPage() {
  const params = useParams();
  const chapterId = params.chapter as ChapterType;
  const [showStudyMode, setShowStudyMode] = useState(false);

  const {
    isLoading,
    isLevelUnlocked,
    isLevelCompleted,
    isChapterComplete,
  } = useProgress();

  const chapter = chapters.find((c) => c.id === chapterId);

  // Get all concepts for this chapter
  const chapterConcepts = useMemo(() => {
    return concepts.filter((c) => c.chapter === chapterId);
  }, [chapterId]);

  const chapterComplete = isChapterComplete(chapterId);

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-pixel text-arcade-error">Chapter not found</p>
        <Link href="/play">
          <Button variant="secondary">BACK TO CHAPTERS</Button>
        </Link>
      </div>
    );
  }

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

  // Show study mode for chapter summary
  if (showStudyMode) {
    return (
      <StudyModeScreen
        concepts={chapterConcepts}
        title={`${chapter.title.toUpperCase()} SUMMARY`}
        onComplete={() => setShowStudyMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/play">
          <Button variant="secondary" size="sm">
            ← CHAPTERS
          </Button>
        </Link>
      </div>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <span className="text-5xl md:text-6xl mb-4 block">{chapter.icon}</span>
        <h1 className="font-pixel text-xl md:text-2xl text-arcade-neon-green mb-2">
          {chapter.title.toUpperCase()}
        </h1>
        <p className="font-pixel text-[10px] text-gray-400">
          {chapter.description}
        </p>
      </motion.div>

      {/* Chapter Complete Banner */}
      {chapterComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-8 p-4 border-2 border-arcade-neon-green bg-arcade-neon-green/10 text-center"
        >
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="font-pixel text-sm md:text-base text-arcade-neon-green mb-3"
          >
            🏆 CHAPTER COMPLETE! 🏆
          </motion.p>
          <p className="font-pixel text-[10px] text-gray-400 mb-4">
            You&apos;ve mastered all {chapter.levels.length} levels! Review all{" "}
            {chapterConcepts.length} concepts to reinforce your learning.
          </p>
          <Button onClick={() => setShowStudyMode(true)}>
            📚 STUDY ALL CONCEPTS
          </Button>
        </motion.div>
      )}

      {/* Level list */}
      <div className="max-w-2xl mx-auto space-y-3">
        {chapter.levels.map((level, index) => (
          <LevelCard
            key={level.id}
            level={level}
            chapterId={chapterId}
            isUnlocked={isLevelUnlocked(chapterId, level.id)}
            isCompleted={isLevelCompleted(chapterId, level.id)}
            index={index}
          />
        ))}
      </div>

      {/* Study button for incomplete chapters too */}
      {!chapterComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-8 text-center"
        >
          <button
            onClick={() => setShowStudyMode(true)}
            className="font-pixel text-[10px] text-gray-500 hover:text-arcade-neon-cyan transition-colors"
          >
            📖 PREVIEW ALL CONCEPTS
          </button>
        </motion.div>
      )}
    </div>
  );
}
