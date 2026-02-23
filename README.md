# TypeMaster Template

A customizable typing game for learning any topic. Fork this template and populate it with your own curriculum - medical terms, language vocabulary, coding shortcuts, or anything else you want to learn by typing.

![TypeMaster Screenshot](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)

## Features

- **Retro Arcade Theme** - 8-bit pixel art aesthetic with neon colors
- **Multiple Game Modes** - Quiz mode and timed race mode
- **Progress Tracking** - XP system, levels, and streaks saved locally
- **Study Mode** - Review concepts before playing
- **AI Challenge** (Optional) - OpenAI-powered quiz generation
- **Sound Effects** - Procedural 8-bit audio
- **Mobile Friendly** - Responsive design works on all devices
- **100% Customizable** - Change curriculum, branding, and features via JSON

## Quick Start

```bash
# Clone the template
git clone https://github.com/YOUR_USERNAME/typemaster-template.git my-typing-game
cd my-typing-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your game.

## Customizing Your Game

### 1. Site Branding (`curriculum/config.json`)

Edit the main config file to customize your game:

```json
{
  "siteName": "MedTerms",
  "tagline": "Learn medical terminology by typing",
  "description": "Master medical vocabulary with this typing game",
  "theme": {
    "primary": "#00FF9F",
    "secondary": "#00D4FF",
    "accent": "#FF6B9D"
  },
  "features": {
    "soundEffects": true,
    "studyMode": true,
    "aiChallenge": true,
    "leaderboard": true
  },
  "gameModes": {
    "quiz": {
      "enabled": true,
      "description": "Type the term that matches the definition"
    },
    "race": {
      "enabled": true,
      "duration": 60,
      "description": "Type as many terms as possible in 60 seconds"
    }
  }
}
```

### 2. Adding Chapters

Create a new JSON file in `curriculum/chapters/`:

```json
{
  "id": "anatomy-basics",
  "title": "Anatomy Basics",
  "description": "Learn the fundamental parts of the human body",
  "icon": "ai-foundations",
  "order": 1,
  "concepts": [
    {
      "id": "anat-001",
      "term": "femur",
      "definition": "The thigh bone, longest bone in the human body",
      "difficulty": "easy"
    },
    {
      "id": "anat-002",
      "term": "patella",
      "definition": "The kneecap, a small bone protecting the knee joint",
      "difficulty": "medium"
    }
  ],
  "levels": [
    {
      "id": 1,
      "name": "Bones 101",
      "concepts": ["anat-001", "anat-002"],
      "requiredXp": 0,
      "gameMode": "quiz"
    }
  ]
}
```

Then import it in `src/lib/curriculum-loader.ts`:

```typescript
import anatomyBasics from "../../curriculum/chapters/anatomy-basics.json";

const chapterFiles = [
  anatomyBasics,
  // Add more chapters here
];
```

### 3. Available Icons

Use any of these built-in icons in your chapter's `icon` field:

| Icon Name | Color | Best For |
|-----------|-------|----------|
| `ai-foundations` | Green | General learning, intro chapters |
| `full-stack` | Pink | Layered concepts, stacks |
| `machine-learning` | Yellow | Data, analytics |
| `code-practice` | Lime | Programming, code |
| `databases` | Emerald | Storage, data |
| `security-auth` | Rose | Security, passwords |
| `containers-docker` | Blue | DevOps, infrastructure |
| `cloud-platforms` | Violet | Cloud, services |

Unknown icon names gracefully fall back to a question mark icon.

## Chapter & Concept Schema

### Chapter Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (used in URLs) |
| `title` | string | Yes | Display title |
| `description` | string | Yes | Short description shown on chapter card |
| `icon` | string | Yes | Icon name from built-in set |
| `order` | number | Yes | Display order (1, 2, 3...) |
| `concepts` | array | Yes | Array of concept objects |
| `levels` | array | Yes | Array of level objects |

### Concept Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (referenced in levels) |
| `term` | string | Yes | The word/phrase to type |
| `definition` | string | Yes | The definition shown as a prompt |
| `difficulty` | string | Yes | `"easy"`, `"medium"`, or `"hard"` |

### Level Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Level number (1, 2, 3...) |
| `name` | string | Yes | Level display name |
| `concepts` | array | Yes | Array of concept IDs for this level |
| `requiredXp` | number | Yes | XP needed to unlock (0 for first level) |
| `gameMode` | string | Yes | `"quiz"` or `"race"` |

## AI Challenge Mode (Optional)

AI Challenge uses OpenAI to generate unique quiz questions based on concepts you've learned. To enable:

1. Keep `features.aiChallenge: true` in config.json
2. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
3. In the game, go to Settings and enter your API key
4. Your key is stored locally in your browser - never sent to any server except OpenAI

To disable AI Challenge completely, set `features.aiChallenge: false` in config.json.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

This is a standard Next.js 14+ app. Deploy to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with `npm run build && npm start`

## Security

TypeMaster ships with production-grade HTTP security headers configured in `next.config.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Safe cross-origin requests (fixes YouTube Error 153) |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Blocks clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Minimizes API surface |

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling (uses `@theme inline`)
- **Framer Motion** - Animations
- **Web Audio API** - Procedural 8-bit sounds
- **LocalStorage** - Progress persistence (auto-namespaced per instance)

## File Structure

```
typemaster-template/
├── curriculum/
│   ├── config.json              # Site configuration
│   └── chapters/
│       ├── programming-basics.json   # Example chapter
│       └── web-development.json      # Example chapter
├── src/
│   ├── app/                     # Next.js pages
│   ├── components/              # React components
│   ├── data/curriculum.ts       # Re-exports from loader
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── curriculum-loader.ts # Loads JSON curriculum
│   │   ├── storage-keys.ts      # Centralized localStorage key registry
│   │   ├── storage.ts           # Progress persistence (localStorage)
│   │   └── openai.ts            # Optional AI integration
│   └── types/game.ts            # TypeScript types
├── public/                      # Static assets
└── package.json
```

## Development

```bash
# Run dev server
npm run dev

# Type check
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

Contributions welcome! Feel free to:
- Add new icons to `src/components/ui/PixelIcon.tsx`
- Improve the game mechanics
- Add new features
- Fix bugs

## License

MIT License - feel free to use this for personal or commercial projects.

---

Made with love. Type your way to mastery!
