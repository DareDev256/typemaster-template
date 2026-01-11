// =============================================================
// CURRICULUM DATA - Loaded from JSON configuration files
// =============================================================
//
// This file re-exports curriculum data from the loader.
// To customize your curriculum:
//
// 1. Edit /curriculum/config.json for site settings
// 2. Add/edit chapter files in /curriculum/chapters/
// 3. Import new chapters in /src/lib/curriculum-loader.ts
//
// See README.md for detailed instructions.
// =============================================================

export {
  chapters,
  concepts,
  config,
  getConceptById,
  getConceptsByChapter,
  getChapterById,
  getConceptsForLevel,
  getSiteConfig,
} from "@/lib/curriculum-loader";
