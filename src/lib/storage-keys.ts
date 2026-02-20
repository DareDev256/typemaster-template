import { config } from "@/data/curriculum";

/**
 * Centralized storage key registry.
 * All localStorage keys derive from the site name in curriculum/config.json,
 * preventing collisions when multiple TypeMaster instances share a domain.
 */
const prefix = config.siteName.toLowerCase().replace(/\s+/g, "_");

export const STORAGE_KEYS = {
  /** User progress (XP, level, completed levels, concept scores) */
  progress: `${prefix}_progress`,
  /** Last played date string (streak tracking) */
  lastPlayed: `${prefix}_last_played`,
  /** Sound mute preference */
  muted: `${prefix}_muted`,
  /** OpenAI API key */
  openaiKey: `${prefix}_openai_key`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
