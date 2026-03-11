"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useShortcutHints, ShortcutHint, RACE_SHORTCUTS, QUIZ_SHORTCUTS } from "@/hooks/useTypingHandler";

function KeyBadge({ hint }: { hint: ShortcutHint }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex items-center justify-center min-w-[44px] h-[32px] px-2 font-pixel text-[10px] text-arcade-neon-cyan border border-arcade-neon-cyan/40 bg-arcade-neon-cyan/5 rounded-sm shadow-[0_0_6px_rgba(0,255,255,0.15)]"
        role="img"
        aria-label={`${hint.label} key`}
      >
        {hint.label}
      </span>
      <span className="font-pixel text-[9px] text-gray-400 leading-tight">
        {hint.description}
      </span>
    </div>
  );
}

/** Arcade-styled keyboard shortcut hints overlay for new users. */
export function ShortcutHints({ mode }: { mode: "race" | "quiz" }) {
  const { visible, dismiss } = useShortcutHints();
  const shortcuts = mode === "race" ? RACE_SHORTCUTS : QUIZ_SHORTCUTS;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm bg-arcade-black/95 backdrop-blur-sm border border-arcade-neon-cyan/20 px-5 py-4 shadow-[0_0_20px_rgba(0,255,255,0.08)]"
          role="tooltip"
          aria-label="Keyboard shortcut hints"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-arcade-neon-cyan/30" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-arcade-neon-magenta tracking-wider">
              CONTROLS
            </span>
            <button
              onClick={dismiss}
              className="font-pixel text-[8px] text-gray-600 hover:text-arcade-neon-cyan transition-colors focus:outline-none focus:ring-1 focus:ring-arcade-neon-cyan/40 px-1"
              aria-label="Dismiss shortcut hints"
            >
              ESC
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {shortcuts.map((hint, i) => (
              <motion.div
                key={hint.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <KeyBadge hint={hint} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-px bg-arcade-neon-cyan/40"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
