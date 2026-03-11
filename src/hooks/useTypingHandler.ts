"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

const HINTS_SHOWN_KEY = STORAGE_KEYS.hintsShown;
const DISMISS_DELAY_MS = 6000;

export interface ShortcutHint {
  key: string;
  label: string;
  description: string;
}

interface UseShortcutHintsReturn {
  /** Whether the overlay should be visible */
  visible: boolean;
  /** Manually dismiss the overlay */
  dismiss: () => void;
  /** Whether this is the user's very first session */
  isNewUser: boolean;
}

/**
 * Manages keyboard shortcut hints for new users.
 *
 * Shows overlay on first visit, auto-dismisses after DISMISS_DELAY_MS
 * or on first keystroke. Persists dismissal to localStorage so hints
 * only appear once per user.
 */
export function useShortcutHints(): UseShortcutHintsReturn {
  const isNewUser = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(HINTS_SHOWN_KEY);
  }, []);

  const [visible, setVisible] = useState(isNewUser);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after delay
  useEffect(() => {
    if (!visible) return;

    timerRef.current = setTimeout(() => {
      setVisible(false);
      localStorage.setItem(HINTS_SHOWN_KEY, "1");
    }, DISMISS_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  // Dismiss on first keystroke
  useEffect(() => {
    if (!visible) return;

    const handleKey = () => {
      setVisible(false);
      localStorage.setItem(HINTS_SHOWN_KEY, "1");
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    window.addEventListener("keydown", handleKey, { once: true });
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(HINTS_SHOWN_KEY, "1");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { visible, dismiss, isNewUser };
}

/** Shortcut definitions for each game mode */
export const RACE_SHORTCUTS: ShortcutHint[] = [
  { key: "⌨️", label: "TYPE", description: "Start typing to begin the race" },
  { key: "⇥", label: "TAB", description: "Skip to next term" },
  { key: "⌫", label: "BKSP", description: "Fix mistakes" },
];

export const QUIZ_SHORTCUTS: ShortcutHint[] = [
  { key: "⌨️", label: "TYPE", description: "Start typing to begin the quiz" },
  { key: "⌫", label: "BKSP", description: "Fix mistakes before time runs out" },
];
