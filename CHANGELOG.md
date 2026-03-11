# Changelog

## [1.4.0] (2026-03-11)

### Added
- **Keyboard shortcut hints overlay** — New users see a contextual controls overlay on their first game session. Shows mode-specific shortcuts (Tab to skip in Race mode, backspace hint in Quiz mode). Auto-dismisses after 6 seconds or on first keystroke. Persisted to localStorage so it only shows once.
- **`useShortcutHints` hook** (`src/hooks/useTypingHandler.ts`) — Manages new-user detection, auto-dismiss timer, and keystroke listener with proper cleanup
- **`ShortcutHints` component** (`src/components/game/ShortcutHints.tsx`) — Arcade-styled overlay with animated key badges, progress bar, and spring entrance/exit transitions
- **`hintsShown` storage key** — Added to centralized storage key registry

## [1.3.1] (2026-03-09)

### Security
- **Added Content-Security-Policy header** — Restricts script/style/connect/font/image sources to prevent XSS injection; only allows `connect-src` to `self` and `https://api.openai.com`
- **Added HSTS header** — `Strict-Transport-Security: max-age=31536000; includeSubDomains` forces HTTPS and prevents protocol downgrade attacks
- **API key format validation** — `saveApiKey()` and `validateApiKey()` now reject keys that don't match the `sk-` prefix pattern before touching localStorage or the network
- **Client-side rate limiting** — OpenAI API calls are capped at 10/minute to prevent quota burn from rapid clicks or automation
- **AI response structure validation** — `generateQuizQuestion()` and `explainConcept()` now validate parsed JSON matches the expected interface shape, preventing crashes from malformed AI output
- **Settings page format feedback** — Shows immediate "bad format" error for invalid key patterns instead of making a wasted network call

## [1.3.0] (2026-03-08)

### Added
- **`diversePick()` category-balanced task selection** (`src/utils/task.ts`) — New utility function replaces naive `Math.random()` shuffling with an algorithm that guarantees chapter-proportional selection and a configurable hard-difficulty floor (default 2). Uses round-robin across chapter buckets then Fisher-Yates shuffles the result
- **Race Mode** now uses `diversePick()` instead of `.sort(() => Math.random() - 0.5)` — rounds cover all unlocked chapters proportionally
- **AI Explain Mode** now uses `diversePick()` — concept exploration sessions are balanced across chapters

## [1.2.0] (2026-03-07)

### Changed
- **Extracted shared validation into `src/utils/validation.ts`** — Level param validation, API key presence checks, and completed-concepts filtering are now centralized in a single utility module instead of scattered inline across page components
- **`challenge/page.tsx`** — Replaced inline API key check and concept filtering with `hasApiKey()` and `getCompletedConcepts()` from validation utility
- **`play/[chapter]/[level]/page.tsx`** — Replaced inline level/chapter validation with `validateLevelParams()` discriminated union, removing direct dependency on `chapters` array

## [1.1.1] (2026-02-23)

### Security
- **Added HTTP security headers** — Configured `next.config.ts` with production-grade security headers applied to all routes:
  - `Referrer-Policy: strict-origin-when-cross-origin` — Fixes YouTube Error 153 for embedded video content by sending proper origin info on cross-origin requests
  - `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing attacks
  - `X-Frame-Options: SAMEORIGIN` — Blocks clickjacking while allowing same-origin iframes
  - `X-XSS-Protection: 1; mode=block` — Enables XSS filter in legacy browsers
  - `Permissions-Policy` — Disables camera, microphone, and geolocation APIs by default

## [1.1.0] (2026-02-20)

### Changed
- **Centralized storage key registry** — All localStorage keys now derive from a single `storage-keys.ts` module, namespaced by `config.siteName`. Previously, keys were scattered across `storage.ts`, `useSoundEffects.ts`, and `openai.ts` with inconsistent namespacing
- **Default chapter is now dynamic** — `storage.ts` defaults to the first loaded chapter (`chapters[0].id`) instead of hardcoded `"ai-foundations"`, so forks work correctly out of the box

### Fixed
- **Reset button was silently broken** — The reset button in `/play` used hardcoded `"typemaster_progress"` and `"typemaster_last_played"` localStorage keys instead of the namespaced keys from `storage.ts`. Any fork with a different `siteName` would have a non-functional reset. Now uses the exported `resetProgress()` function
- **Sound mute preference leaked between instances** — `useSoundEffects.ts` used `"typemaster_muted"` regardless of site name. Now namespaced via centralized key registry
- **OpenAI key leaked between instances** — `openai.ts` used `"typemaster_openai_key"` regardless of site name. Now namespaced

### Removed
- **Unused `GameState` interface** from `types/game.ts` — was defined but never consumed by any component or hook

## v1.0.0 (2025-01-11)

### Initial Release

TypeMaster Template - a customizable typing game for learning any topic.

#### Features

- **Retro Arcade Theme** - 8-bit pixel art aesthetic with neon green/cyan/magenta colors
- **Multiple Game Modes**
  - Quiz Mode: Type the term that matches the definition
  - Race Mode: Type as many terms as possible in 60 seconds
- **Progress Tracking** - XP system, levels, streaks saved to localStorage
- **Study Mode** - Review concepts before playing each level
- **AI Challenge** (Optional) - OpenAI-powered quiz generation and concept explanations
- **Sound Effects** - Procedural 8-bit audio using Web Audio API
- **Mobile Friendly** - Responsive design works on all devices
- **100% Customizable** - Change curriculum, branding, and features via JSON

#### Architecture

**JSON-Based Curriculum System**
- `curriculum/config.json` - Site configuration (name, tagline, theme, features)
- `curriculum/chapters/*.json` - Chapter definitions with concepts and levels
- No TypeScript changes needed to customize content

**Key Files Created/Modified**
- `src/lib/curriculum-loader.ts` - Loads and validates JSON curriculum at build time
- `src/types/game.ts` - Changed ChapterType from union to string for dynamic chapters
- `src/data/curriculum.ts` - Re-exports from curriculum loader
- `src/components/ui/PixelIcon.tsx` - 24 built-in pixel art icons with fallback
- `src/components/ui/Logo.tsx` - Reads site name/tagline from config
- `src/app/page.tsx` - Conditionally shows AI Challenge based on config

#### Example Curriculum

Includes 2 example chapters demonstrating the JSON schema:
1. **Programming Basics** (15 concepts, 5 levels)
   - Data Types, Structures, Functions, Advanced concepts
2. **Web Development** (15 concepts, 5 levels)
   - HTML/CSS/JS foundations, React basics, SSR/Hydration

#### Tech Stack

- Next.js 16.1.1 (App Router)
- TypeScript 5.x
- Tailwind CSS 4.x (using `@theme inline`)
- Framer Motion 12.x
- Web Audio API (procedural sounds)
- LocalStorage (progress persistence)

#### Built-in Icons

| Icon Name | Color | Use Case |
|-----------|-------|----------|
| ai-foundations | #00FF9F (green) | General learning |
| full-stack | #FF6B9D (pink) | Layered concepts |
| machine-learning | #FFD93D (yellow) | Data/analytics |
| generative-ai | #00D4FF (cyan) | AI/creative |
| deep-learning | #A855F7 (purple) | Neural networks |
| transformers-llms | #F97316 (orange) | NLP/LLMs |
| fine-tuning | #EF4444 (red) | Optimization |
| rag-embeddings | #22D3EE (cyan) | Search/retrieval |
| containers-docker | #0EA5E9 (blue) | DevOps |
| kubernetes | #3B82F6 (blue) | Orchestration |
| cloud-platforms | #8B5CF6 (violet) | Cloud services |
| cicd-automation | #FBBF24 (amber) | Automation |
| databases | #10B981 (emerald) | Storage |
| scalability | #14B8A6 (teal) | Performance |
| apis-microservices | #6366F1 (indigo) | APIs |
| security-auth | #F43F5E (rose) | Security |
| code-practice | #84CC16 (lime) | Programming |
| sound-on/off | varies | UI controls |
| trophy, xp-star, streak | varies | Gamification |
| home, play, back | varies | Navigation |

---

## Development Notes

### How to Add a New Chapter

1. Create `curriculum/chapters/your-chapter.json`:
```json
{
  "id": "your-chapter",
  "title": "Your Chapter",
  "description": "Description here",
  "icon": "ai-foundations",
  "order": 3,
  "concepts": [...],
  "levels": [...]
}
```

2. Import in `src/lib/curriculum-loader.ts`:
```typescript
import yourChapter from "../../curriculum/chapters/your-chapter.json";

const chapterFiles = [
  programmingBasics,
  webDevelopment,
  yourChapter,  // Add here
];
```

3. Run `npm run build` to verify

### How to Add a New Icon

Edit `src/components/ui/PixelIcon.tsx` and add to `iconPaths`:
```typescript
"your-icon": {
  path: "M...", // SVG path data for 16x16 grid
  color: "#HEX",
},
```

### AI Challenge Setup

1. Keep `features.aiChallenge: true` in config.json
2. Get OpenAI API key from platform.openai.com
3. Enter key in Settings page (stored in localStorage)
4. Key only sent to OpenAI API, never to any other server

---

Built with Claude Code. Type your way to mastery!
