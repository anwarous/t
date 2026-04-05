# 🎓 Learning++ — Interactive Algorithm Learning Platform

A modern, production-ready frontend for an interactive algorithm learning platform. Built with React, TypeScript, Tailwind CSS, Zustand, and Framer Motion.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Navigate to the project directory
cd mqacademy

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open your browser
# → http://localhost:5173
```

---

## 🏗 Project Structure

```
mqacademy/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Root layout with ambient background
│   │   │   └── Navbar.tsx          # Responsive navigation with XP/streak
│   │   └── ui/
│   │       ├── Badge.tsx           # Gamification badge components
│   │       ├── Skeleton.tsx        # Loading skeleton screens
│   │       └── Toast.tsx           # XP / badge notification toasts
│   ├── data/
│   │   └── mockData.ts             # All mock data + TypeScript types
│   ├── lib/
│   │   └── utils.ts                # cn(), formatXP(), color helpers
│   ├── pages/
│   │   ├── Landing.tsx             # Hero, features, social proof, CTA
│   │   ├── Dashboard.tsx           # User stats, progress, recommendations
│   │   ├── CodeEditor.tsx          # Monaco editor + output console
│   │   ├── Visualization.tsx       # Sorting algorithm visualizer
│   │   ├── Mentor.tsx              # AI chat mentor interface
│   │   └── Learn.tsx               # Course listing + course detail
│   ├── store/
│   │   └── index.ts                # Zustand stores (user, editor, viz, mentor)
│   ├── App.tsx                     # Router setup
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + design tokens
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🧩 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features overview, social proof, CTA |
| Dashboard | `/dashboard` | Stats, progress, exercises, leaderboard |
| Code Editor | `/editor` | Monaco editor, run Python, output console |
| Visualizer | `/visualize` | Step-by-step sorting algorithm animations |
| AI Mentor | `/mentor` | Chat interface with mock AI responses |
| Learn | `/learn` | Course catalog and course detail pages |
| Course Detail | `/learn/:id` | Chapter/lesson breakdown with progress |

---

## 🗄 State Management (Zustand)

Four independent stores in `src/store/index.ts`:

### `useUserStore`
```ts
{ user, badges, addXP, incrementStreak }
```

### `useEditorStore`
```ts
{ code, language, output, isRunning, setCode, runCode, ... }
```

### `useVisualizationStore`
```ts
{ algorithm, array, steps, currentStep, state, play, pause, stepForward, ... }
```

### `useMentorStore`
```ts
{ messages, isTyping, sendMessage, clearMessages }
```

---

## 🎨 Design System

### Colors (CSS Variables)
```css
--brand-primary: #1a5cff     /* Primary blue */
--accent-cyan:   #00d4ff     /* Accent cyan  */
--bg-primary:    #050810     /* Deep dark    */
--bg-card:       #141c35     /* Card surface */
```

### Component Classes
```
.glass          → Frosted glass card background
.glass-strong   → Stronger glass for overlays
.btn-primary    → Blue gradient primary button
.btn-ghost      → Outlined ghost button  
.gradient-text  → Blue → cyan gradient text
.progress-bar   → Glowing progress bar
.input-field    → Dark styled input
.tag            → Small colored label pill
```

### Fonts
- **Display/UI**: `Sora` (headings, UI text)
- **Code**: `JetBrains Mono` (editor, code snippets)

---

## ⚙️ Customization

### Adding a new exercise
In `src/data/mockData.ts`, add to `MOCK_EXERCISES`:
```ts
{
  id: 'ex-005',
  title: 'My New Problem',
  difficulty: 'Medium',
  category: 'Trees',
  completed: false,
  attempts: 0,
  xp: 200,
  description: 'Problem description...',
  starterCode: `def solution():\n    pass`,
  solution: `def solution():\n    return 42`,
}
```

### Adding a visualization algorithm
In `src/store/index.ts`, create a step generator function and add it to `generateSteps()`.

### Adding a course
In `src/data/mockData.ts`, add to `MOCK_COURSES` with chapters and lessons.

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool + dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Zustand | 4 | State management |
| React Router | 6 | Client-side routing |
| Framer Motion | 11 | Animations |
| Monaco Editor | 4 | Code editor |
| Lucide React | latest | Icons |

---

## 🚫 What's Intentionally Missing

- No backend / API calls (mock data only)
- No authentication (uses mock user)
- No real code execution (simulated output)
- No real AI integration (mock responses)

These can be added by wiring up real APIs to the existing store actions.

---

## 🌟 Next Steps (Production Readiness)

1. **Backend**: Connect `runCode()` to a sandboxed Python execution service (e.g., Judge0)
2. **Auth**: Add Clerk/Auth0 for real user accounts
3. **AI**: Connect `sendMessage()` to Claude/OpenAI API
4. **Database**: Store progress in Supabase/PostgreSQL
5. **Testing**: Add Vitest + React Testing Library
6. **Analytics**: Track learning events with PostHog
