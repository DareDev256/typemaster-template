"use client";

import { useState, useCallback, useRef } from "react";

interface GameStats {
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  wpm: number;
  accuracy: number;
  startTime: number | null;
}

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    wpm: 0,
    accuracy: 100,
    startTime: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = useCallback(() => {
    const now = Date.now();
    setStats((prev) => ({ ...prev, startTime: now }));

    // Update WPM every second
    intervalRef.current = setInterval(() => {
      setStats((prev) => {
        if (!prev.startTime) return prev;
        const elapsedMinutes = (Date.now() - prev.startTime) / 60000;
        const words = prev.correctChars / 5; // standard: 5 chars = 1 word
        const wpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;
        return { ...prev, wpm };
      });
    }, 1000);
  }, []);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const recordKeypress = useCallback((isCorrect: boolean) => {
    setStats((prev) => {
      const correctChars = prev.correctChars + (isCorrect ? 1 : 0);
      const incorrectChars = prev.incorrectChars + (isCorrect ? 0 : 1);
      const totalChars = correctChars + incorrectChars;
      const accuracy =
        totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

      // Calculate WPM
      let wpm = prev.wpm;
      if (prev.startTime) {
        const elapsedMinutes = (Date.now() - prev.startTime) / 60000;
        const words = correctChars / 5;
        wpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;
      }

      return {
        ...prev,
        correctChars,
        incorrectChars,
        totalChars,
        accuracy,
        wpm,
      };
    });
  }, []);

  const reset = useCallback(() => {
    stopTracking();
    setStats({
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      wpm: 0,
      accuracy: 100,
      startTime: null,
    });
  }, [stopTracking]);

  return { stats, startTracking, stopTracking, recordKeypress, reset };
}
