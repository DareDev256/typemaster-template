import { Concept } from "@/types/game";

const OPENAI_KEY_STORAGE = "typemaster_openai_key";

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

// Get API key from localStorage
export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(OPENAI_KEY_STORAGE);
}

// Save API key to localStorage
export function saveApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OPENAI_KEY_STORAGE, key);
}

// Remove API key from localStorage
export function removeApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OPENAI_KEY_STORAGE);
}

// Test if API key is valid
export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Generate a quiz question about a concept
export async function generateQuizQuestion(
  concept: Concept
): Promise<QuizQuestion> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key configured");

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
    // Parse JSON from response (handle potential markdown code blocks)
    const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}

// Explain a concept in depth
export async function explainConcept(
  concept: Concept
): Promise<ConceptExplanation> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key configured");

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
    const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
