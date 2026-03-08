import type { Concept } from "@/types/game";

// ─── Diverse Task Selection ─────────────────────────────────────────
//
// Replaces naive Math.random() shuffling with category-balanced,
// difficulty-aware selection. Ensures every round covers multiple
// chapters and includes at least some hard concepts.
// ─────────────────────────────────────────────────────────────────────

/**
 * Selects `count` concepts from a pool with two guarantees:
 *
 * 1. **Category balance** — concepts are drawn proportionally from each
 *    chapter so no single chapter dominates a round.
 * 2. **Difficulty floor** — at least `minHard` hard-difficulty concepts
 *    are included (when available) to prevent all-easy rounds.
 *
 * Falls back gracefully: if the pool is smaller than `count`, returns
 * the entire pool shuffled. If fewer than `minHard` hard concepts
 * exist, includes as many as possible.
 */
export function diversePick(
  pool: Concept[],
  count: number,
  minHard: number = 2
): Concept[] {
  if (pool.length <= count) return shuffle([...pool]);

  // ── Step 1: Guarantee hard-difficulty floor ───────────────────────
  const hard = shuffle(pool.filter((c) => c.difficulty === "hard"));
  const guaranteed = hard.slice(0, Math.min(minHard, hard.length));
  const guaranteedIds = new Set(guaranteed.map((c) => c.id));
  const remaining = pool.filter((c) => !guaranteedIds.has(c.id));

  // ── Step 2: Group remaining by chapter (category) ────────────────
  const byChapter = new Map<string, Concept[]>();
  for (const concept of remaining) {
    const group = byChapter.get(concept.chapter) ?? [];
    group.push(concept);
    byChapter.set(concept.chapter, group);
  }

  // Shuffle within each chapter bucket
  for (const [key, group] of byChapter) {
    byChapter.set(key, shuffle(group));
  }

  // ── Step 3: Round-robin fill from each chapter ───────────────────
  const slotsLeft = count - guaranteed.length;
  const picked: Concept[] = [...guaranteed];
  const chapters = [...byChapter.keys()];
  let filled = 0;

  // Round-robin: take one from each chapter per pass
  while (filled < slotsLeft && chapters.length > 0) {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (filled >= slotsLeft) break;
      const group = byChapter.get(chapters[i])!;
      if (group.length === 0) {
        chapters.splice(i, 1);
        continue;
      }
      picked.push(group.pop()!);
      filled++;
    }
  }

  // ── Step 4: Shuffle final selection ──────────────────────────────
  return shuffle(picked);
}

/** Fisher-Yates shuffle — in-place, returns the same array */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
