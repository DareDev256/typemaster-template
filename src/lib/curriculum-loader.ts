import { Chapter, Concept } from "@/types/game";

// Import curriculum config
import config from "../../curriculum/config.json";

// Import all chapter files
// Add your chapter imports here
import programmingBasics from "../../curriculum/chapters/programming-basics.json";
import webDevelopment from "../../curriculum/chapters/web-development.json";

// =============================================================
// HOW TO ADD YOUR OWN CHAPTERS:
// 1. Create a new JSON file in /curriculum/chapters/
// 2. Import it above (e.g., import myChapter from "../../curriculum/chapters/my-chapter.json")
// 3. Add it to the chapterFiles array below
// =============================================================

const chapterFiles = [
  programmingBasics,
  webDevelopment,
  // Add more chapters here
];

// Type for the raw JSON structure
interface RawConcept {
  id: string;
  term: string;
  definition: string;
  difficulty: "easy" | "medium" | "hard";
}

interface RawLevel {
  id: number;
  name: string;
  concepts: string[];
  requiredXp: number;
  gameMode: "quiz" | "race";
}

interface RawChapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  concepts: RawConcept[];
  levels: RawLevel[];
}

// Process and validate chapters
function processChapters(rawChapters: RawChapter[]): {
  chapters: Chapter[];
  concepts: Concept[];
} {
  const allConcepts: Concept[] = [];
  const chapters: Chapter[] = [];

  // Sort chapters by order
  const sortedChapters = [...rawChapters].sort((a, b) => a.order - b.order);

  for (const rawChapter of sortedChapters) {
    // Add concepts with chapter reference
    for (const concept of rawChapter.concepts) {
      allConcepts.push({
        ...concept,
        chapter: rawChapter.id,
      });
    }

    // Create chapter object
    chapters.push({
      id: rawChapter.id,
      title: rawChapter.title,
      description: rawChapter.description,
      icon: rawChapter.icon,
      levels: rawChapter.levels,
    });
  }

  return { chapters, concepts: allConcepts };
}

// Process the curriculum
const { chapters, concepts } = processChapters(chapterFiles as RawChapter[]);

// Export curriculum data
export { chapters, concepts, config };

// Helper functions
export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getConceptsByChapter(chapterId: string): Concept[] {
  return concepts.filter((c) => c.chapter === chapterId);
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getConceptsForLevel(
  chapterId: string,
  levelId: number
): Concept[] {
  const chapter = getChapterById(chapterId);
  const level = chapter?.levels.find((l) => l.id === levelId);

  if (!level) return [];

  return level.concepts
    .map((id) => getConceptById(id))
    .filter((c): c is Concept => c !== undefined);
}

// Export site config for use in components
export function getSiteConfig() {
  return config;
}
