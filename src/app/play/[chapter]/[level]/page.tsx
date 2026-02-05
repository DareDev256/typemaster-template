"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { chapters, getConceptById } from "@/data/curriculum";
import { QuizMode } from "@/components/game/QuizMode";
import { RaceMode } from "@/components/game/RaceMode";
import { StudyModeScreen } from "@/components/game/StudyModeScreen";
import { Button } from "@/components/ui/Button";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ChapterType } from "@/types/game";
import { useProgress } from "@/hooks/useProgress";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const { earnXP, markLevelComplete } = useProgress();

  const [showStudyMode, setShowStudyMode] = useState(false);
  const [gameResults, setGameResults] = useState<{
    xp: number;
    accuracy: number;
    wpm: number;
  } | null>(null);

  const chapterId = params.chapter as ChapterType;
  const levelId = parseInt(params.level as string);

  // Validate URL params: levelId must be a positive integer, chapterId must match a known chapter
  const isValidLevelId = Number.isInteger(levelId) && levelId > 0;
  const chapter = chapters.find((c) => c.id === chapterId);
  const level = isValidLevelId
    ? chapter?.levels.find((l) => l.id === levelId)
    : undefined;

  const concepts = useMemo(() => {
    if (!level) return [];
    return level.concepts
      .map((id) => getConceptById(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [level]);

  // Called when game (QuizMode/RaceMode) is complete
  const handleGameComplete = useCallback(
    (results: { xp: number; accuracy: number; wpm: number }) => {
      // Save progress immediately
      earnXP(results.xp);
      markLevelComplete(chapterId, levelId);

      // Store results and show study mode
      setGameResults(results);
      setShowStudyMode(true);
    },
    [chapterId, levelId, earnXP, markLevelComplete]
  );

  // Called when study mode is complete
  const handleStudyComplete = useCallback(() => {
    // Navigate back to chapter
    router.push(`/play/${chapterId}`);
  }, [chapterId, router]);

  if (!chapter || !level) {
    const errorMessage = !isValidLevelId
      ? "Invalid level ID — must be a positive number"
      : !chapter
      ? `Unknown chapter "${chapterId}"`
      : "Level not found";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-pixel text-arcade-error">{errorMessage}</p>
        <Link href="/play">
          <Button variant="secondary">BACK TO CHAPTERS</Button>
        </Link>
      </div>
    );
  }

  // Show study mode after game completion
  if (showStudyMode) {
    return (
      <StudyModeScreen
        concepts={concepts}
        title={`LEVEL ${levelId} RECAP`}
        onComplete={handleStudyComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-arcade-black">
      {/* Header */}
      <div className="p-4 border-b border-arcade-dark flex items-center justify-between">
        <Link href={`/play/${chapterId}`}>
          <Button variant="secondary" size="sm">
            ← EXIT
          </Button>
        </Link>
        <p className="font-pixel text-[10px] text-arcade-neon-cyan">
          {chapter.icon} {chapter.title.toUpperCase()} / LEVEL {levelId}:{" "}
          {level.name.toUpperCase()}
        </p>
        <SoundToggle />
      </div>

      {/* Game */}
      {level.gameMode === "quiz" ? (
        <QuizMode concepts={concepts} onComplete={handleGameComplete} />
      ) : (
        <RaceMode concepts={concepts} onComplete={handleGameComplete} />
      )}
    </div>
  );
}
