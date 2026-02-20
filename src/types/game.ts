export interface Concept {
  id: string;
  term: string;
  definition: string;
  chapter: string; // Dynamic - matches chapter ID from curriculum JSON
  difficulty: "easy" | "medium" | "hard";
}

// ChapterType is now a string to support dynamic curriculum loading
// Users can define any chapter ID in their curriculum JSON files
export type ChapterType = string;

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  levels: Level[];
}

export interface Level {
  id: number;
  name: string;
  concepts: string[]; // concept IDs
  requiredXp: number;
  gameMode: "quiz" | "race";
}

export interface UserProgress {
  xp: number;
  level: number;
  currentChapter: string; // Dynamic - matches chapter ID from curriculum JSON
  completedLevels: string[];
  streak: number;
  conceptScores: Record<
    string,
    { correct: number; incorrect: number; lastSeen: number }
  >;
}

export interface GameResults {
  xp: number;
  accuracy: number;
  wpm: number;
  correctAnswers: number;
  totalQuestions: number;
}
