"use client";

interface TypingDisplayProps {
  targetText: string;
  userInput: string;
}

export function TypingDisplay({ targetText, userInput }: TypingDisplayProps) {
  return (
    <div className="font-pixel text-xl md:text-2xl lg:text-3xl tracking-wider leading-relaxed">
      {targetText.split("").map((char, index) => {
        const userChar = userInput[index];
        let colorClass = "text-gray-600"; // not typed yet

        if (userChar !== undefined) {
          colorClass =
            userChar.toLowerCase() === char.toLowerCase()
              ? "text-arcade-neon-green"
              : "text-arcade-error";
        }

        // Show cursor at current position
        const showCursor = index === userInput.length;

        return (
          <span key={index} className={`relative ${colorClass}`}>
            {char === " " ? "\u00A0" : char}
            {showCursor && (
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-arcade-neon-cyan animate-pulse" />
            )}
          </span>
        );
      })}
    </div>
  );
}
