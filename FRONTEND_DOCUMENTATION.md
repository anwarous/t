# Learning++ Frontend — Complete Documentation

> A thorough reference covering every technology, architectural decision, and component used in the **Learning++** frontend, together with likely teacher questions and their answers.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Application Entry Points](#4-application-entry-points)
5. [Routing & Authentication Guards](#5-routing--authentication-guards)
6. [Layout System](#6-layout-system)
7. [State Management — Zustand Stores](#7-state-management--zustand-stores)
8. [Pages](#8-pages)
9. [Reusable Components](#9-reusable-components)
10. [Custom Hooks](#10-custom-hooks)
11. [Utility Library](#11-utility-library)
12. [Compilers & Code Execution](#12-compilers--code-execution)
13. [Internationalisation (i18n)](#13-internationalisation-i18n)
14. [Design System & Styling](#14-design-system--styling)
15. [Mock Data & Types](#15-mock-data--types)
16. [API Layer](#16-api-layer)
17. [Build Tooling](#17-build-tooling)
18. [Potential Teacher Questions & Answers](#18-potential-teacher-questions--answers)

---

## 1. Project Overview

**Learning++** is a gamified, browser-based platform for learning algorithms and data structures. Students can:

- Read structured courses with lessons organised into chapters.
- Solve coding exercises in **Python** or a custom **Algorithm pseudo-language** and receive instant feedback.
- Watch step-by-step algorithm visualisations (Bubble Sort, Selection Sort).
- Chat with an AI mentor for hints, debugging help, and explanations.
- Track XP, streaks, badges, and a leaderboard from a personalised dashboard.
- Switch the UI between **English** and **French**.
- Toggle **dark / light** themes.

The entire platform runs in the browser; code execution uses **Pyodide** (Python compiled to WebAssembly) for Python and calls a local **Flask REST API** for the custom algorithm language.

---

## 2. Tech Stack

| Layer | Tool / Library | Version | Purpose |
|---|---|---|---|
| UI Framework | **React** | 18.2 | Component-based UI rendering |
| Language | **TypeScript** | 5.3 | Static typing, better DX |
| Build Tool | **Vite** | 5.1 | Fast dev server, HMR, production bundling |
| Routing | **React Router DOM** | 6.22 | Client-side SPA routing |
| State Management | **Zustand** | 4.5 | Lightweight global state without boilerplate |
| Animation | **Framer Motion** | 11 | Declarative animations and transitions |
| Styling | **Tailwind CSS** | 3.4 | Utility-first CSS |
| CSS Utilities | **clsx + tailwind-merge** | 2.x | Conditional class merging without conflicts |
| Icons | **Lucide React** | 0.344 | Consistent SVG icon set |
| Code Editor | **Monaco Editor** | 4.6 | VS Code's editor embedded in the browser |
| Python Runtime | **Pyodide** | 0.29 | Python 3 compiled to WebAssembly — runs in the browser |
| i18n | **i18next + react-i18next** | 25 / 17 | Multi-language support (EN / FR) |
| Language Detection | **i18next-browser-languagedetector** | 8 | Auto-detect browser language |
| PostCSS | **autoprefixer** | 10 | Vendor-prefix CSS properties automatically |

---

## 3. Project Structure

```
src/
├── App.tsx                  # Root component: router, guards, theme watcher
├── main.tsx                 # DOM mount point
├── i18n.ts                  # i18next configuration
├── index.css                # Global CSS variables, Tailwind layers, utility classes
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx       # Decides which shell to render (public / code / app)
│   │   ├── Navbar.tsx       # Top navigation bar (public pages)
│   │   ├── Sidebar.tsx      # 220 px fixed sidebar (app pages) + mobile drawer
│   │   ├── CodeModeNav.tsx  # Minimal 3-item top bar for the editor
│   │   └── LanguageSwitcher.tsx  # EN / FR toggle
│   └── ui/
│       ├── Badge.tsx        # Badge / pill display component
│       ├── Skeleton.tsx     # Loading placeholder skeleton
│       └── Toast.tsx        # Global toast notification system
│
├── pages/
│   ├── Landing.tsx          # Public marketing / hero page
│   ├── SignIn.tsx           # Login form
│   ├── SignUp.tsx           # Registration form
│   ├── Dashboard.tsx        # Authenticated home: stats, courses, activity
│   ├── Learn.tsx            # Course catalogue and lesson list
│   ├── CodeEditor.tsx       # Coding challenge environment
│   ├── Sandbox.tsx          # Free-form Python / Algorithm scratchpad
│   ├── Visualization.tsx    # Animated algorithm step-through
│   ├── Mentor.tsx           # AI-powered chat assistant
│   ├── Profile.tsx          # User profile, badges, settings, notifications
│   └── NotFound.tsx         # 404 page
│
├── store/
│   └── index.ts             # All Zustand stores (Auth, User, Editor, Mentor, Visualization)
│
├── lib/
│   ├── api.ts               # HTTP auth API + demo/offline mode
│   ├── algoCompiler.ts      # Calls Flask REST API to run algorithm language code
│   ├── algorithmLanguage.ts # Monaco language grammar for the custom algo language
│   ├── pythonCompiler.ts    # Pyodide wrapper — runs Python in-browser
│   └── utils.ts             # cn(), XP helpers, difficulty/rarity colour helpers
│
├── hooks/
│   ├── useInterval.ts       # setInterval wrapper that cleans up on unmount
│   ├── useKeyboard.ts       # Keyboard shortcut listener
│   └── useLocalStorage.ts   # useState synced to localStorage
│
├── data/
│   └── mockData.ts          # Type definitions + static demo data (courses, exercises, badges…)
│
└── locales/
    ├── en/translation.json  # English strings
    └── fr/translation.json  # French strings
```

---

## 4. Application Entry Points

### `index.html`
Standard HTML shell. Loads **Space Grotesk** and **IBM Plex Mono** from Google Fonts. The `<div id="root">` is the React mount target.

### `src/main.tsx`
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```
- Mounts the React tree.
- Imports `index.css` (global styles) and `i18n.ts` (initialises translations before first render).
- `React.StrictMode` enables extra warnings in development (double-invokes effects to detect side-effect bugs).

---

## 5. Routing & Authentication Guards

**File:** `src/App.tsx`

React Router v6 is used in **layout-route** pattern: a single `<Route element={<Layout />}>` wraps all child routes so every page uses the same shell.

### Route table

| Path | Component | Guard |
|---|---|---|
| `/` | `Landing` | Public |
| `/signin` | `SignIn` | `RedirectIfAuth` — redirects authenticated users to `/dashboard` |
| `/signup` | `SignUp` | `RedirectIfAuth` |
| `/dashboard` | `Dashboard` | `RequireAuth` — redirects anonymous users to `/signin` |
| `/editor` | `CodeEditorPage` | `RequireAuth` |
| `/visualize` | `VisualizationPage` | `RequireAuth` |
| `/mentor` | `MentorPage` | `RequireAuth` |
| `/learn` | `LearnPage` | `RequireAuth` |
| `/learn/:courseId` | `LearnPage` | `RequireAuth` |
| `/profile` | `ProfilePage` | `RequireAuth` |
| `/sandbox` | `SandboxPage` | `RequireAuth` |
| `*` | `NotFound` | Public |

### Guard components

```tsx
function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated)
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  return <>{children}</>
}
```
- Reads `isAuthenticated` from the Zustand **AuthStore** (which is seeded from `localStorage` on boot).
- Passes the attempted path in `state.from` so after login the user can be redirected back.

### ThemeWatcher

A tiny side-effect component that watches the Zustand `user.theme` and adds/removes the `dark` / `light` class on `<html>`, activating the correct CSS variable set.

---

## 6. Layout System

**File:** `src/components/layout/Layout.tsx`

Three distinct shells are rendered depending on the current path:

| Condition | Shell | Nav |
|---|---|---|
| Path is `/`, `/signin`, `/signup` | Public | Top `Navbar` |
| Path starts with `/editor` | Code mode | Compact `CodeModeNav` (3 items) |
| All other authenticated paths | App | 220 px fixed `Sidebar` |

All shells wrap `<Outlet />` (the child page) in a **Framer Motion** `<motion.main>` with `opacity: 0 → 1, y: 8 → 0` fade-up transition on route change.

### Sidebar (`src/components/layout/Sidebar.tsx`)

- **Desktop (≥ md):** Fixed left column, 220 px wide.
  - Logo area → Stats pills (XP, streak, language switcher) → Nav links → User footer card.
- **Mobile (< md):** Fixed top bar with hamburger → slide-in drawer using `AnimatePresence` + `motion.nav`.
- Active link detection uses `useLocation()` + `startsWith` matching.
- **XPRing** — an inline SVG circle with `stroke-dashoffset` animation showing XP progress to next level.
- **AvatarDropdown** — appears above the footer with animated mount/unmount via `AnimatePresence`, shows mini stats (XP, streak, solved) and navigation shortcuts.

---

## 7. State Management — Zustand Stores

**File:** `src/store/index.ts`

Zustand is chosen over Redux because it requires no providers, reducers, or action creators — just `create()` and selector functions.

### 7.1 AuthStore (`useAuthStore`)

| Field | Type | Description |
|---|---|---|
| `token` | `string \| null` | JWT (or demo Base64 token) from the API |
| `isAuthenticated` | `boolean` | `true` when `token` is non-null |
| `authUser` | object | `{ username, email, displayName }` |
| `setAuth(token, user)` | action | Saves to `localStorage`, updates state, calls `initUser` on UserStore |
| `clearAuth()` | action | Removes from `localStorage`, resets both stores |

On app boot the store reads `mqa_token` from `localStorage`; if it exists the user is considered authenticated without a server round-trip (token is treated as valid unless a protected API call rejects it).

### 7.2 UserStore (`useUserStore`)

Holds the gamification profile:

| Field | Type |
|---|---|
| `user.xp` | XP points |
| `user.level` | Derived from XP |
| `user.streak` | Consecutive days |
| `user.totalSolved` | Exercises completed |
| `user.rank` | Text rank (Novice → Legend) |
| `user.theme` | `'dark'` or `'light'` |
| `user.language` | Preferred coding language |
| `user.completedExercises` | Array of exercise IDs |
| `badges` | Array of `Badge` objects |

Each profile is persisted to `localStorage` under the key `mqa_profile_<username>`, so multiple accounts on the same browser keep separate progress. Actions include `addXP`, `incrementStreak`, `markExerciseSolved`, `updateProfile`, `updateNotifications`, `updateTheme`.

### 7.3 EditorStore (`useEditorStore`)

Tracks the coding exercise session:
- Selected exercise, current language, code draft per exercise.
- `output`, `isRunning`, `hints` state.
- `runCode()` action — dispatches to `runPython` or `runAlgo` depending on language.
- `markSolved()` — calls `useUserStore.markExerciseSolved` and fires a `showToast('xp')`.

### 7.4 MentorStore (`useMentorStore`)

Manages the AI chat interface:
- `messages: ChatMessage[]` — conversation history.
- `isTyping: boolean` — controls the animated typing indicator.
- `sendMessage(text)` — appends user message, simulates an AI response after a short delay.
- `clearMessages()` — resets the conversation.

### 7.5 VisualizationStore (`useVisualizationStore`)

Controls the sorting visualiser:
- `array` — the current array being sorted.
- `steps` — pre-computed list of all algorithm steps (each step has the array state, which elements are comparing/swapping, and a description string).
- `currentStep`, `isPlaying`, `speed`.
- Actions: `generateArray`, `setAlgorithm`, `generateSteps`, `play`, `pause`, `next`, `prev`, `reset`.

---

## 8. Pages

### 8.1 Landing (`/`)

Marketing hero page. Highlights four key features (visualisation, AI mentor, gamification, editor) using animated cards. Contains a scrolling ticker of algorithm names and stat badges (active students, exercises, satisfaction). All strings go through `useTranslation` for bilingual support.

### 8.2 SignIn & SignUp (`/signin`, `/signup`)

Form pages backed by `authApi.login` / `authApi.register`. On success they call `useAuthStore.setAuth()`. Error messages are displayed inline. Both redirect authenticated users away immediately (`RedirectIfAuth` guard).

### 8.3 Dashboard (`/dashboard`)

The authenticated home page. Shows:
- **Stat cards** — XP, streak, exercises solved, rank (with SVG `ProgressRing` per card).
- **Continue Learning** — first in-progress course.
- **Recommended Exercises** — filtered from `MOCK_EXERCISES` by unsolved status.
- **Recent Activity** feed.
- **Leaderboard** — user's position among mock competitors.

Uses staggered Framer Motion `fadeUp` variants to animate cards in sequence on mount.

### 8.4 Learn (`/learn`, `/learn/:courseId`)

Two-mode page:
- **Without `courseId`:** Course catalogue grid — cards per course with progress bar and difficulty badge.
- **With `courseId`:** Course detail — chapters accordion with `LessonRow` list items (video / reading / practice / quiz icons, lock state, completion status).

### 8.5 Code Editor (`/editor`)

The main coding challenge environment:

- **Left panel** — Exercise list (filterable by difficulty), exercise description, examples, constraints.
- **Right panel** — Monaco Editor (lazy-loaded via `React.lazy` + `Suspense`) above an output panel.
- Language selector toggles between **Python** (runs via Pyodide) and **Algorithm** (runs via Flask API).
- A custom Monaco theme (`MONACO_THEME`) overrides syntax token colours.
- `ColoredOutput` colours each output line by prefix emoji/symbol (✅, ❌, ⚠️, 💡…).
- On correct solution, XP is awarded and a toast fires.
- The `registerAlgorithmLanguage` function registers a custom Monaco language definition for the pseudo-language.

### 8.6 Sandbox (`/sandbox`)

Free-form scratchpad — no predefined exercises. Supports:
- **Python** and **Algorithm** languages.
- **Multiple named tabs** — users can open several files simultaneously (with close / add buttons).
- **Starter templates** (blank, Fibonacci, sorting examples) selectable from a dropdown per language.
- Save to `localStorage`, copy code to clipboard, download as a `.py` / `.algo` file.

### 8.7 Visualization (`/visualize`)

Step-by-step sorting visualiser:
- Choose between **Bubble Sort** and **Selection Sort**.
- Generate a random array (5–20 elements, configurable).
- Pre-compute all steps on algorithm selection, then animate through them.
- Bars are coloured: **comparing** (blue), **swapping** (red/orange), **sorted** (cyan accent).
- Controls: Play, Pause, Step Back, Step Forward, Reset. Speed slider.
- Complexity card shows `O(n²)` time and `O(1)` space for both supported algorithms.

### 8.8 Mentor (`/mentor`)

Chat-style AI assistant page:
- Left sidebar (desktop only): quick-prompt buttons (Debug, Hint, Explain, Optimize) and capability list.
- Chat area: `MessageBubble` components with animated mount, user/bot avatars, type badges (error / hint / explanation).
- Auto-scrolls to the latest message.
- `TypingIndicator` with three bouncing dots (Framer Motion `y` keyframes).
- `Textarea` auto-grows up to 120 px as the user types.
- `Enter` sends, `Shift+Enter` inserts a newline.

### 8.9 Profile (`/profile`)

Four tabs (driven by `?tab=` query param):
- **Profile** — avatar (initials), name, email, bio, language preference, recent activity.
- **Achievements** — badge grid with rarity colours (common / rare / epic / legendary) and glow shadows.
- **Settings** — theme toggle (dark/light), language preference, account info.
- **Notifications** — toggle switches for streak reminders, new challenges, mentor replies, weekly reports.

Settings are saved to the UserStore (and thus `localStorage`) on submit with animated save confirmation.

### 8.10 NotFound (`/404`)

Simple 404 page with a "Go home" button.

---

## 9. Reusable Components

### `Toast` (`src/components/ui/Toast.tsx`)

A **headless pub/sub toast system** — no React context required:
- Module-level `toastQueue` array and `listeners` array.
- `showToast(options)` — pushes a toast, notifies all listeners, auto-removes after 3 s.
- `ToastProvider` component registers a listener and renders the queue into a fixed bottom-right stack via `AnimatePresence`.
- Three types: `xp` (cyan), `badge` (amber), `streak` (orange).

### `Skeleton` (`src/components/ui/Skeleton.tsx`)

Pulsing placeholder blocks for loading states. Accepts `className` for custom sizing.

### `Badge` (`src/components/ui/Badge.tsx`)

A pill component for displaying labels (difficulty level, category, rarity) with colour variants.

### `LanguageSwitcher` (`src/components/layout/LanguageSwitcher.tsx`)

Calls `i18n.changeLanguage('en' | 'fr')` and stores the choice in `localStorage` via the i18next language detector.

---

## 10. Custom Hooks

| Hook | File | Purpose |
|---|---|---|
| `useLocalStorage<T>` | `hooks/useLocalStorage.ts` | `useState` that reads/writes `localStorage`. Gracefully handles JSON parse errors. |
| `useInterval` | `hooks/useInterval.ts` | `setInterval` that automatically clears on unmount or when `delay` changes. Used by the Visualization play loop. |
| `useKeyboard` | `hooks/useKeyboard.ts` | Attaches a `keydown` listener to `window` and cleans up on unmount. Used for editor keyboard shortcuts. |

---

## 11. Utility Library

**File:** `src/lib/utils.ts`

| Function | Purpose |
|---|---|
| `cn(...inputs)` | Merges Tailwind classes using `clsx` + `tailwind-merge`, resolving conflicts (e.g. two `text-*` classes). |
| `formatXP(xp)` | Formats numbers ≥ 1000 as `1.2k`. |
| `getLevel(xp)` | Returns level number (`Math.floor(xp / 250) + 1`). |
| `getLevelProgress(xp)` | Returns 0–1 progress fraction within the current level. |
| `getDifficultyColor(difficulty)` | Returns a Tailwind text class for Easy/Medium/Hard. |
| `getDifficultyBg(difficulty)` | Returns a Tailwind background+border class combination. |
| `getRarityColor(rarity)` | Returns a Tailwind text class for common/rare/epic/legendary badges. |
| `getRarityGlow(rarity)` | Returns a Tailwind shadow class for badge glow effects. |

---

## 12. Compilers & Code Execution

### 12.1 Python — Pyodide (`src/lib/pythonCompiler.ts`)

```ts
import { loadPyodide } from 'pyodide'

let pyodideInstance: PyodideAPI | null = null

async function getPyodide(): Promise<PyodideAPI> {
  if (pyodideInstance) return pyodideInstance          // singleton
  pyodideInstance = await loadPyodide()
  return pyodideInstance
}

export async function runPython(code: string, inputs = ''): Promise<string> {
  const pyodide = await getPyodide()
  // redirect stdout / stderr to an array
  // inject pre-supplied input lines into stdin
  await pyodide.runPythonAsync(code)
  return outputLines.join('\n')
}
```

**How it works:**
- Pyodide loads the CPython runtime compiled to **WebAssembly** the first time it is needed (lazy, ~10 MB download cached by the browser thereafter).
- `stdout` and `stderr` are captured by custom handlers — nothing escapes to the browser console.
- Simulated `stdin` is provided by splitting the `inputs` string on newlines and returning one line per `input()` call.
- The singleton pattern prevents re-downloading Pyodide on every run.

### 12.2 Algorithm Language — Flask API (`src/lib/algoCompiler.ts`)

```ts
const ALGO_API_URL = import.meta.env.VITE_ALGO_COMPILER_URL ?? 'http://localhost:5000'

export async function runAlgo(code: string, inputs = ''): Promise<string> {
  const response = await fetch(`${ALGO_API_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, inputs }),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.output ?? ''
}
```

The custom algorithm pseudo-language is interpreted by a **Python Flask server** (`algoCompiler/CompilerRes/web_ui.py`). The frontend simply POSTs code + inputs and displays the returned `output` or throws the `error`.

### 12.3 Monaco Language Registration (`src/lib/algorithmLanguage.ts`)

Registers a custom Monaco Editor language (`algorithm`) with:
- Token rules (keywords, operators, strings, numbers, comments).
- Auto-complete suggestions.
- Called once when the Code Editor or Sandbox page mounts.

---

## 13. Internationalisation (i18n)

**File:** `src/i18n.ts`

```ts
i18n
  .use(LanguageDetector)  // reads from localStorage then navigator.language
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },  // React already escapes
  })
```

- Translation JSON files live in `src/locales/en/translation.json` and `src/locales/fr/translation.json`.
- Every user-visible string is accessed via `const { t } = useTranslation()` then `t('key.path')`.
- The `LanguageSwitcher` component calls `i18n.changeLanguage()` and the detection layer caches the choice to `localStorage`.

---

## 14. Design System & Styling

### CSS Custom Properties (`src/index.css`)

All colours are defined as CSS variables to enable **dark ↔ light** switching with a single class swap on `<html>`:

| Variable | Dark value | Light value |
|---|---|---|
| `--color-bg` | `#0d0f14` (deep charcoal) | `#f0f4f0` (light grey-green) |
| `--color-surface` | `#0f1520` | `#e8ede8` |
| `--color-accent` | `#00f5d4` (electric cyan) | `#00b898` |
| `--color-xp` | `#f0a030` (amber) | unchanged |
| `--color-text` | `#dde4ea` | `#0e1520` |

### Tailwind Configuration (`tailwind.config.js`)

Extends the default theme with:
- **Fonts:** `display` → Space Grotesk, `sans`/`mono` → IBM Plex Mono.
- **Brand palette:** `brand-50` through `brand-900` (cyan shades).
- **Surface palette:** `surface-50` through `surface-950` (charcoal shades).
- **Custom animations:** `shimmer`, `float`, `bar-grow`, `stagger-in`, `progress`, `ring-spin`.
- **Background images:** Inline SVG grid pattern (`bg-grid-pattern`) used as the page texture.
- **Box shadows:** `glow-accent`, `glow-blue`, `glow-cyan`, `glow-amber`, `glow-purple`, `card`.

### Global Utility Classes (`src/index.css`)

Re-usable CSS classes authored in Tailwind's `@layer components`:

| Class | Description |
|---|---|
| `.glass` | Semi-transparent frosted-glass card (backdrop-filter blur + surface overlay) |
| `.glass-strong` | Heavier glass effect |
| `.gradient-text` | Cyan-to-blue gradient applied to `<span>` text |
| `.btn-primary` | Primary cyan call-to-action button |
| `.btn-ghost` | Transparent button with subtle border |
| `.input-field` | Styled `<input>` / `<textarea>` |
| `.progress-bar` / `.progress-fill` | XP progress bar track and fill |
| `.card-hover` | Lift shadow on hover |

---

## 15. Mock Data & Types

**File:** `src/data/mockData.ts`

All content is currently static mock data. It exports:

| Export | Description |
|---|---|
| `MOCK_USER` | Default user profile (name, XP, streak, rank, joinDate…) |
| `MOCK_BADGES` | Array of `Badge` objects (earned/unearned, rarity) |
| `MOCK_COURSES` | Array of `Course` objects with chapters and lessons |
| `MOCK_EXERCISES` | Array of `Exercise` objects with starter code, test cases, hints, constraints |
| `MOCK_CHAT_MESSAGES` | Initial AI mentor conversation |
| `RECENT_ACTIVITY` | Array of activity log entries for the dashboard feed |
| `LEADERBOARD_OTHERS` | Mock competitors for the leaderboard |

The store file also defines `EXERCISE_SPECS` — pattern-matching rules used to judge student submissions without actually executing the code (regex checks for required algorithmic structures like loops, hash maps, pointers).

---

## 16. API Layer

**File:** `src/lib/api.ts`

### Demo Mode (default)

When `VITE_API_BASE_URL` is not set, the app runs in **demo/offline mode**:
- Registered users are stored in `localStorage` as `mqa_demo_users`.
- Passwords are "hashed" with a simple non-cryptographic hash (explicitly documented as demo-only).
- Tokens are Base64 strings encoding `demo:<username>:<timestamp>`.
- Allows full sign-up/sign-in flow with zero backend.

### Production Mode

When `VITE_API_BASE_URL` is set, a generic `request<T>()` helper wraps `fetch`:
- Always sends `Content-Type: application/json`.
- Throws a human-readable error if the response is not `ok`, extracting the server's `message` or `error` field.

Two exported operations: `authApi.login(payload)` and `authApi.register(payload)`, both returning `AuthResponse` (`token`, `tokenType`, `username`, `email`, `displayName`).

---

## 17. Build Tooling

### Vite (`vite.config.ts`)

- Uses `@vitejs/plugin-react` for JSX transform and Fast Refresh (HMR without full reload).
- Path alias `@/` → `src/` so imports are always absolute regardless of file depth.
- Production build runs `tsc` (type-check) then Vite bundle (tree-shaking, code-splitting).

### TypeScript

- Strict mode enabled.
- Separate `tsconfig.node.json` for Node.js-specific files (e.g. `vite.config.ts`).

### PostCSS

- `autoprefixer` adds vendor prefixes to CSS output automatically.
- Tailwind CSS uses PostCSS as its processing pipeline.

### NPM Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start development server with HMR |
| `build` | `tsc && vite build` | Type-check then bundle for production |
| `preview` | `vite preview` | Locally serve the production build |

---

## 18. Potential Teacher Questions & Answers

### Architecture & Decisions

**Q: Why did you choose React over another framework like Vue or Angular?**
> React's component model, huge ecosystem, and wide adoption in the industry made it the natural choice. Its unidirectional data flow and hooks API pair perfectly with Zustand for state management. The team had prior React experience, reducing ramp-up time.

**Q: Why Zustand instead of Redux or Context API?**
> Redux requires significant boilerplate (actions, reducers, selectors). The React Context API causes unnecessary re-renders across the whole tree. Zustand gives us a minimal API (`create`, selector functions) with automatic re-render optimisation — only subscribers of changed slices re-render. It also works outside React components (useful for calling `useUserStore.getState()` inside store actions).

**Q: Why Vite instead of Create React App (CRA)?**
> CRA uses Webpack, which is slow for large projects. Vite uses native ES modules in development for near-instant hot module replacement (HMR) and esbuild for bundling, making it 10–100× faster in development startup and rebuild times.

**Q: How does the routing work? What is the difference between `<Route element>` and `<Outlet>`?**
> React Router v6 uses **layout routes** — a parent route renders a shell component (`Layout`) containing `<Outlet />`, which acts as a placeholder. When a child route matches, React Router renders that child's component into the `<Outlet />`. This removes the need to repeat the navbar/sidebar in every page.

**Q: What is the purpose of `RequireAuth`? Could this be bypassed?**
> `RequireAuth` is a client-side guard that redirects unauthenticated users. It does **not** protect data — it only protects the UI. Any real sensitive data must be protected on the server side (the backend API rejects requests without a valid token). The guard improves UX but is not a security measure by itself.

---

### State Management

**Q: How is user authentication persisted across page refreshes?**
> The `AuthStore` reads `mqa_token` from `localStorage` on module initialisation. If a token exists, `isAuthenticated` is `true` immediately — before any React rendering. This means the user stays logged in after a refresh without a server round-trip.

**Q: How does the gamification system work? How are XP and levels calculated?**
> Completing an exercise calls `markExerciseSolved(id, xp)` on the UserStore, which adds the exercise ID to `completedExercises` (preventing double-earning) and increments `xp` and `totalSolved`. Level = `Math.floor(xp / 250) + 1`. The profile is immediately written to `localStorage` so progress survives a refresh.

**Q: Why is user progress stored in `localStorage` and not on the server?**
> The project uses a demo/offline mode where there is no persistent backend database. In a production version, profile data would be saved to and loaded from the server API on every session. The localStorage approach works for a demo or single-device use case.

---

### Code Execution

**Q: How does Python code run inside the browser without a server?**
> We use **Pyodide**, which is the official CPython interpreter compiled to WebAssembly. WebAssembly is a low-level binary format that modern browsers can execute at near-native speed. Pyodide exposes the same Python API as regular CPython, so student code runs identically to how it would on their laptop. The WASM binary is downloaded once and cached by the browser.

**Q: What are the limitations of Pyodide?**
> The initial load takes a few seconds (~10 MB download). Modules with C extensions may not be available (though common ones like `numpy` are pre-built). It runs on the main thread by default, so heavy computations could block the UI (a Web Worker can fix this). It also cannot open network sockets or access the local file system.

**Q: How does the algorithm pseudo-language work?**
> It is a custom language with its own syntax, interpreted by a Python parser running in a local Flask server. The frontend sends the source code as JSON to `POST /run`, and the server returns the output. The `VITE_ALGO_COMPILER_URL` environment variable points to the Flask server (default `http://localhost:5000`).

**Q: How does the editor know if a student's solution is correct without running it for every test case?**
> The `EXERCISE_SPECS` object defines **required regex patterns** for each exercise (e.g. the solution must contain a hash map reference, a return statement, nested loops). The engine also detects known wrong patterns and returns a targeted hint. For Python exercises, Pyodide actually executes the code against all test cases and compares output. For the algorithm language, the Flask server handles execution.

---

### UI & Animations

**Q: How do the page transitions work?**
> Every `<motion.main>` wrapping `<Outlet />` has `initial={{ opacity: 0, y: 8 }}` and `animate={{ opacity: 1, y: 0 }}`. Because the `key` prop is set to `location.pathname`, React unmounts and remounts the element on route change, triggering a fresh animation each time.

**Q: What is `AnimatePresence` used for?**
> `AnimatePresence` from Framer Motion allows elements to animate **out** before being unmounted from the DOM. Normally React removes elements instantly. With `AnimatePresence`, the `exit` prop (e.g. `exit={{ opacity: 0 }}`) plays before the DOM node is removed, enabling smooth dismiss animations for modals, toasts, dropdowns, and the mobile drawer.

**Q: How is the SVG progress ring drawn?**
> An SVG `<circle>` with `stroke-dasharray` equal to the full circumference and `stroke-dashoffset` equal to the unfilled portion. The formula is:
> ```
> circumference = 2π × radius
> offset = circumference × (1 − progress/100)
> ```
> A CSS transition on `stroke-dashoffset` animates the fill smoothly when XP changes.

**Q: How does the sidebar know which link is active?**
> `useLocation()` from React Router returns the current pathname. The `isActive(to)` helper checks `pathname === to` for the dashboard (exact match) and `pathname.startsWith(to + '/')` for nested routes. Active links receive a left `2px` cyan border, a dimmed background, and a glowing dot indicator.

---

### Styling

**Q: What is the purpose of `cn()` / `clsx` + `tailwind-merge`?**
> When building class strings conditionally in Tailwind, you can accidentally apply two conflicting utility classes (e.g. `text-red-400 text-green-400`). `clsx` handles conditional class logic, and `tailwind-merge` resolves conflicts by keeping only the last of any conflicting utility group. Together they replace verbose template-literal class strings.

**Q: How does dark/light mode switching work?**
> The design system uses CSS custom properties (variables) for every colour. Two sets are defined in `index.css`: the default dark theme under `:root` and a light theme under `html.light`. The `ThemeWatcher` component (mounted in `App.tsx`) observes the Zustand `user.theme` and toggles the `dark` / `light` class on `<html>`. Tailwind's `darkMode: 'class'` also honours this class.

**Q: Why are Google Fonts loaded in `index.html` rather than installed as npm packages?**
> Loading fonts from the Google CDN is simpler and leverages browser caching across sites that use the same fonts. It avoids bundling the font files into the app's assets and lets the browser preload them using the `<link rel="preconnect">` hints already in `index.html`.

---

### Internationalisation

**Q: How does the app know which language to use on first load?**
> The `i18next-browser-languagedetector` plugin checks, in order: `localStorage` (previously saved preference) and then `navigator.language` (the browser's operating system language). If neither matches `en` or `fr`, it falls back to English.

**Q: How do you add a new language?**
> 1. Create `src/locales/<code>/translation.json` with all the same keys translated.
> 2. Import it in `src/i18n.ts` and add it to `resources` and `supportedLngs`.
> 3. Add the option to `LanguageSwitcher.tsx`.

---

### Testing & Extensibility

**Q: How would you add unit tests to this project?**
> Install **Vitest** (Vite-native test runner) and **React Testing Library**. Test utility functions (e.g. `getLevel`, `cn`) as pure functions. Test store actions with Zustand's `act()` wrapper. Test components by rendering them and asserting on DOM output.

**Q: How would you connect this frontend to a real backend?**
> Set `VITE_API_BASE_URL` in `.env` to the backend URL. The `authApi` functions already switch to real HTTP calls when this variable is set. Profile/progress persistence would need additional API endpoints (`GET /profile`, `PATCH /profile`) and the Zustand stores would need to call them instead of reading/writing `localStorage` directly.

**Q: If you had to scale the course content, what would you change?**
> Replace the `MOCK_COURSES` and `MOCK_EXERCISES` arrays in `mockData.ts` with API calls. Add a loading state and `Skeleton` placeholders while data fetches. Implement **React Query** or SWR for caching, background refetching, and cache invalidation.
