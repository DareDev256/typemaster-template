import { Concept } from "@/types/game";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export interface QuizQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

export interface ConceptExplanation {
  analogy: string;
  example: string;
  whyItMatters: string;
}

// --- API Key Format Validation ---
// OpenAI keys follow known prefix patterns. Reject anything else
// before it touches localStorage or the network.
const OPENAI_KEY_PATTERN = /^sk-[a-zA-Z0-9_-]{20,}$/;

export function isValidKeyFormat(key: string): boolean {
  return OPENAI_KEY_PATTERN.test(key.trim());
}

// --- Rate Limiter ---
// Prevents runaway API calls from burning through quota.
// Tracks timestamps of recent calls; rejects if too many in the window.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_CALLS = 10; // max 10 calls per minute
const callTimestamps: number[] = [];

function checkRateLimit(): void {
  const now = Date.now();
  // Evict expired timestamps
  while (callTimestamps.length > 0 && now - callTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    callTimestamps.shift();
  }
  if (callTimestamps.length >= RATE_LIMIT_MAX_CALLS) {
    throw new Error("Rate limit exceeded — wait a moment before trying again");
  }
  callTimestamps.push(now);
}

// Get API key from localStorage
export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.openaiKey);
}

// Save API key to localStorage (with format validation)
export function saveApiKey(key: string): void {
  if (typeof window === "undefined") return;
  if (!isValidKeyFormat(key)) {
    throw new Error("Invalid API key format — must start with sk- followed by 20+ alphanumeric characters");
  }
  localStorage.setItem(STORAGE_KEYS.openaiKey, key.trim());
}

// Remove API key from localStorage
export function removeApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.openaiKey);
}

// Test if API key is valid
export async function validateApiKey(key: string): Promise<boolean> {
  if (!isValidKeyFormat(key)) return false;
  checkRateLimit();
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${key.trim()}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// --- Response Validators ---
// Validate AI responses have the expected shape before trusting them.
// Prevents crashes from malformed/adversarial AI output.

function isQuizQuestion(obj: unknown): obj is QuizQuestion {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.question === "string" &&
    typeof o.correctAnswer === "string" &&
    Array.isArray(o.wrongAnswers) &&
    o.wrongAnswers.length === 3 &&
    o.wrongAnswers.every((a: unknown) => typeof a === "string")
  );
}

function isConceptExplanation(obj: unknown): obj is ConceptExplanation {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.analogy === "string" &&
    typeof o.example === "string" &&
    typeof o.whyItMatters === "string"
  );
}

function safeParseJSON(raw: string): unknown {
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

// Generate a quiz question about a concept
export async function generateQuizQuestion(
  concept: Concept
): Promise<QuizQuestion> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key configured");
  checkRateLimit();

  const prompt = `You are a quiz master for a typing game about AI/software engineering.

Create a multiple-choice question about this concept:
Term: ${concept.term}
Definition: ${concept.definition}

Requirements:
- Question should test understanding, not just recall
- Provide 1 correct answer and 3 plausible wrong answers
- Keep answers concise (1-2 sentences max)
- Make wrong answers believable but clearly incorrect

Return ONLY valid JSON in this exact format, no markdown:
{"question": "...", "correctAnswer": "...", "wrongAnswers": ["...", "...", "..."]}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate question");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  try {
    const parsed = safeParseJSON(content);
    if (!isQuizQuestion(parsed)) {
      throw new Error("AI response did not match expected quiz format");
    }
    return parsed;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Failed to parse AI response");
  }
}

// Explain a concept in depth
export async function explainConcept(
  concept: Concept
): Promise<ConceptExplanation> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key configured");
  checkRateLimit();

  const prompt = `Explain this AI/software engineering concept for a beginner:
Term: ${concept.term}
Definition: ${concept.definition}

Provide a helpful explanation with:
1. A simple analogy (1-2 sentences) - compare it to something from everyday life
2. A real-world example (1-2 sentences) - where you'd see this in practice
3. Why it matters (1-2 sentences) - why someone should care about this

Keep it concise, engaging, and use plain language. Avoid jargon.

Return ONLY valid JSON in this exact format, no markdown:
{"analogy": "...", "example": "...", "whyItMatters": "..."}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate explanation");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  try {
    const parsed = safeParseJSON(content);
    if (!isConceptExplanation(parsed)) {
      throw new Error("AI response did not match expected explanation format");
    }
    return parsed;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Failed to parse AI response");
  }
}
