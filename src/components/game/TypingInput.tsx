"use client";

import { useEffect, useRef, useCallback } from "react";

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
  targetText: string;
  disabled?: boolean;
}

export function TypingInput({
  value,
  onChange,
  onComplete,
  targetText,
  disabled = false,
}: TypingInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and when enabled
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // Re-focus when clicking anywhere on the game area
  useEffect(() => {
    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [disabled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      // Check if complete (matches target, case-insensitive)
      if (newValue.toLowerCase() === targetText.toLowerCase()) {
        onComplete();
      }
    },
    [onChange, onComplete, targetText]
  );

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className="absolute opacity-0 w-full h-full cursor-default"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
    />
  );
}
