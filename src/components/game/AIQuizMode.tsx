"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Concept } from "@/types/game";
import { Button } from "@/components/ui/Button";
import { VictoryScreen } from "./VictoryScreen";
import { generateQuizQuestion, QuizQuestion } from "@/lib/openai";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface AIQuizModeProps {
  concepts: Concept[];
  onComplete: (results: { score: number; total: number }) => void;
  onExit: () => void;
}

const TOTAL_QUESTIONS = 5;

export function AIQuizMode({ concepts, onComplete, onExit }: AIQuizModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [currentConcept, setCurrentConcept] = useState<Concept | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  const { playSound } = useSoundEffects();

  const loadNextQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      // Pick random concept
      const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
      setCurrentConcept(randomConcept);

      // Generate question
      const question = await generateQuizQuestion(randomConcept);
      setCurrentQuestion(question);

      // Shuffle answers
      const allAnswers = [question.correctAnswer, ...question.wrongAnswers];
      setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate question");
    } finally {
      setIsLoading(false);
    }
  }, [concepts]);

  // Load first question on mount
  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !currentQuestion) return;

      setSelectedAnswer(answer);
      setShowResult(true);

      const isCorrect = answer === currentQuestion.correctAnswer;
      if (isCorrect) {
        playSound("correct");
        setScore((prev) => prev + 1);
      } else {
        playSound("incorrect");
      }

      // Move to next question or finish
      setTimeout(() => {
        if (questionNumber >= TOTAL_QUESTIONS) {
          setShowVictory(true);
        } else {
          setQuestionNumber((prev) => prev + 1);
          loadNextQuestion();
        }
      }, 2000);
    },
    [showResult, currentQuestion, questionNumber, playSound, loadNextQuestion]
  );

  if (showVictory) {
    const accuracy = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <VictoryScreen
        title={
          accuracy === 100
            ? "PERFECT!"
            : accuracy >= 80
              ? "GREAT JOB!"
              : accuracy >= 60
                ? "GOOD TRY!"
                : "KEEP LEARNING!"
        }
        xpEarned={score * 20}
        wpm={0}
        accuracy={accuracy}
        onContinue={() => onComplete({ score, total: TOTAL_QUESTIONS })}
        onRetry={() => {
          setQuestionNumber(1);
          setScore(0);
          setShowVictory(false);
          loadNextQuestion();
        }}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6 flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={onExit}>
          ← EXIT
        </Button>
        <span className="font-pixel text-[10px] text-arcade-neon-cyan">
          QUESTION {questionNumber}/{TOTAL_QUESTIONS}
        </span>
        <span className="font-pixel text-sm text-arcade-neon-green">
          {score}/{questionNumber - (showResult ? 0 : 1)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-2 bg-arcade-dark mb-8 rounded-sm overflow-hidden">
        <motion.div
          className="h-full bg-arcade-neon-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="font-pixel text-arcade-neon-magenta mb-4"
            >
              🤖 AI IS THINKING...
            </motion.p>
            <p className="font-pixel text-[10px] text-gray-500">
              Generating a unique question for you
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="font-pixel text-arcade-error mb-4">{error}</p>
            <Button onClick={loadNextQuestion}>TRY AGAIN</Button>
          </motion.div>
        ) : (
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            {/* Concept hint */}
            <p className="font-pixel text-[10px] text-arcade-neon-magenta text-center mb-2">
              ABOUT: {currentConcept?.term.toUpperCase()}
            </p>

            {/* Question */}
            <div className="bg-arcade-dark border border-arcade-neon-cyan p-6 mb-6 text-center">
              <p className="font-pixel text-sm md:text-base text-white leading-relaxed">
                {currentQuestion?.question}
              </p>
            </div>

            {/* Answers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shuffledAnswers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === currentQuestion?.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(answer)}
                    disabled={showResult}
                    className={`p-4 border text-left font-pixel text-[10px] transition-all ${
                      showCorrect
                        ? "border-arcade-neon-green bg-arcade-neon-green/20 text-arcade-neon-green"
                        : showWrong
                          ? "border-arcade-error bg-arcade-error/20 text-arcade-error"
                          : isSelected
                            ? "border-arcade-neon-cyan bg-arcade-neon-cyan/10"
                            : "border-gray-700 hover:border-arcade-neon-cyan"
                    }`}
                  >
                    <span className="text-arcade-neon-cyan mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {answer}
                  </motion.button>
                );
              })}
            </div>

            {/* Result message */}
            {showResult && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center font-pixel text-sm mt-6 ${
                  selectedAnswer === currentQuestion?.correctAnswer
                    ? "text-arcade-neon-green"
                    : "text-arcade-error"
                }`}
              >
                {selectedAnswer === currentQuestion?.correctAnswer
                  ? "✓ CORRECT!"
                  : "✗ WRONG!"}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
