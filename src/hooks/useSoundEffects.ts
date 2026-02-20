"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type SoundType =
  | "keypress"
  | "correct"
  | "incorrect"
  | "levelComplete"
  | "timeWarning";

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Load muted preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.muted);
      if (stored === "true") {
        setIsMuted(true);
      }
    }
  }, []);

  // Initialize AudioContext lazily (must be triggered by user interaction)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create an oscillator with 8-bit characteristics
  const createOscillator = useCallback(
    (
      ctx: AudioContext,
      frequency: number,
      type: OscillatorType = "square",
      duration: number = 0.1
    ) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // 8-bit style: sharp attack, quick decay
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);

      return oscillator;
    },
    []
  );

  // Play keypress sound - short blip
  const playKeypress = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 800, "square", 0.03);
  }, [getAudioContext, createOscillator]);

  // Play correct answer sound - rising two-tone
  const playCorrect = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 523, "square", 0.1); // C5
    setTimeout(() => {
      createOscillator(ctx, 659, "square", 0.15); // E5
    }, 80);
  }, [getAudioContext, createOscillator]);

  // Play incorrect answer sound - descending buzz
  const playIncorrect = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 200, "sawtooth", 0.15);
    setTimeout(() => {
      createOscillator(ctx, 150, "sawtooth", 0.2);
    }, 100);
  }, [getAudioContext, createOscillator]);

  // Play level complete sound - victory arpeggio
  const playLevelComplete = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createOscillator(ctx, freq, "square", 0.2);
      }, i * 100);
    });
  }, [getAudioContext, createOscillator]);

  // Play time warning sound - urgent beep
  const playTimeWarning = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 440, "square", 0.08);
  }, [getAudioContext, createOscillator]);

  // Main play function
  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted) return;

      try {
        switch (type) {
          case "keypress":
            playKeypress();
            break;
          case "correct":
            playCorrect();
            break;
          case "incorrect":
            playIncorrect();
            break;
          case "levelComplete":
            playLevelComplete();
            break;
          case "timeWarning":
            playTimeWarning();
            break;
        }
      } catch (error) {
        // Silently fail if audio context isn't available
        console.warn("Audio playback failed:", error);
      }
    },
    [
      isMuted,
      playKeypress,
      playCorrect,
      playIncorrect,
      playLevelComplete,
      playTimeWarning,
    ]
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEYS.muted, String(newValue));
      return newValue;
    });
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
  };
}
