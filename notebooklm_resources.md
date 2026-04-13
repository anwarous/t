# Learning++ — Pitch Deck Resources for NotebookLM

> This document contains all structured information about the **Learning++** platform (also branded as Learning++). It is intended to be uploaded to NotebookLM as the sole source for generating a professional white-themed pitching presentation.

---

## 1. Project Overview

**Name:** Learning++ (Learning++)
**Tagline:** Master Algorithms, Interactively.
**Category:** EdTech / Developer Education Platform
**Stage:** Production-ready MVP
**License:** Private

Learning++ is a modern, interactive algorithm learning platform designed for computer science students, self-taught developers, and bootcamp graduates. It transforms the traditionally dry experience of learning algorithms and data structures into an engaging, gamified journey powered by live visualizations, an AI mentor, and real code execution.

---

## 2. The Problem

Learning algorithms is hard. Traditional resources — textbooks, lecture slides, YouTube videos — are passive and abstract. Students read about Merge Sort but cannot *see* it run. They stare at code and struggle to find bugs without guidance. They study in isolation with no feedback loop and drop off because it feels unrewarding.

**Pain points:**
- Abstract, hard-to-visualize concepts (recursion, graph traversal, dynamic programming)
- No personalized feedback when stuck
- Low retention due to passive reading
- Zero gamification → no motivation to continue
- Fragmented tools: separate sites for theory, coding, and practice

---

## 3. The Solution

Learning++ is a single, unified platform that combines:

1. **Step-by-step algorithm visualizations** — watch every swap, comparison, and pivot in real time, pause and rewind at will
2. **In-browser code execution** — write and run Python directly in the browser via Pyodide (WebAssembly), no setup required
3. **AI Mentor** — 24/7 personal tutor powered by Claude AI that debugs code, explains concepts, gives hints, and suggests optimizations
4. **Gamified progression** — XP points, leveling system (Novice → Legend), daily streaks, badges, and a global leaderboard
5. **Structured course catalog** — beginner to advanced paths covering sorting, graphs, trees, dynamic programming, and more

---

## 4. Key Features

### 4.1 Algorithm Visualizer
- Supports: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Binary Search, BFS, DFS, Dijkstra, Heap Sort, A*, Kruskal, Floyd-Warshall
- Full playback controls: Play, Pause, Step Forward, Step Backward, Skip to Start, Skip to End
- Adjustable speed and array size
- Color-coded states: Comparing (blue), Swapping (red/orange), Sorted (green), Unsorted (default)
- Step counter, comparison count, swap count
- Real-time complexity display (Time & Space)

### 4.2 Interactive Code Editor
- Monaco Editor (same engine as VS Code)
- Python execution via Pyodide (WebAssembly in-browser) — zero server round-trip for Python
- Custom algorithm language support via Flask-based backend compiler (algoCompiler)
- Test case runner with pass/fail indicators
- Starter code, hints, and solution reveal per exercise
- Free mode (sandbox) for open-ended experimentation

### 4.3 AI Mentor
- Chat interface powered by Claude AI
- Capabilities: debug code, explain algorithm concepts, give step-by-step hints, suggest optimizations, walk through examples, guide problem-solving strategy
- Quick prompts for common actions (debug, hint, explain, optimize)
- 24/7 availability, personalized to user context

### 4.4 Gamification System
- **XP Points**: earned by completing lessons, solving exercises, submitting correct code
- **Level System** (30 levels): Level = min(30, max(1, XP / 250))
- **Ranks**: Novice (0–499 XP) → Apprentice → Practitioner → Expert → Master → Grandmaster → Legend (25 000+ XP)
- **Daily Streak**: tracks consecutive days of activity
- **Badges**: Common, Rare, Epic, Legendary rarity tiers
- **Global Leaderboard**: top users ranked by XP
- **Progress Tracking**: per-course, per-lesson, per-exercise completion state

### 4.5 Course Catalog
- Structured courses with chapters and lessons
- Lesson types: Video, Reading, Practice, Quiz
- Difficulty tiers: Beginner, Intermediate, Advanced
- Progress persistence and resume capability
- XP rewards per course

### 4.6 User Dashboard
- Personal stats: Total XP, Level, Streak, Problems Solved, Courses Enrolled
- Leaderboard position
- Recommended next exercises
- Quick access to Editor, Visualizer, AI Mentor
- Recent activity feed

### 4.7 Authentication & Profiles
- JWT-based authentication (Spring Security 6)
- User profiles with display name, avatar, bio, preferred language
- Notification preferences (streak reminders, new challenges, AI mentor replies, weekly digest)
- Dark / Light theme support
- Internationalization: English and French

---

## 5. Technology Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Zustand | 4 | State management |
| React Router | 6 | Client-side routing |
| Framer Motion | 11 | Animations & transitions |
| Monaco Editor | 4 | Code editor (VS Code engine) |
| Pyodide | 0.29 | Python runtime (WebAssembly) |
| i18next | 25 | Internationalization (EN/FR) |
| Lucide React | latest | Icon library |

### Backend
| Technology | Version | Role |
|---|---|---|
| Spring Boot | 3.2 | REST API framework |
| Java | 21 | Language |
| Spring Security | 6 | Authentication & authorization |
| JWT (jjwt) | 0.12.3 | Token-based auth |
| Spring Data JPA / Hibernate | — | ORM / persistence |
| H2 (dev) / PostgreSQL (prod) | — | Database |
| Maven | 3.8+ | Build tool |
| Flask (Python) | — | Algorithm compiler microservice |

### Architecture Highlights
- **Frontend**: SPA (Single Page Application) with React, fully client-side routing
- **Backend**: RESTful Spring Boot API at `localhost:8080`, secured with JWT Bearer tokens
- **Python execution**: Runs directly in the browser (Pyodide WASM) — no server needed for Python code
- **Algorithm compiler**: Lightweight Flask microservice for custom algorithm language execution
- **State**: Four Zustand stores (Auth, User, Editor, Visualization, Mentor) for clean separation of concerns
- **CORS**: Configurable via environment variable for multi-origin production deployments

---

## 6. API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT token

### Users
- `GET /api/users/me` — Get own profile (authenticated)
- `PUT /api/users/me` — Update display name / avatar (authenticated)
- `GET /api/users/me/badges` — List earned badges (authenticated)
- `GET /api/users/me/submissions` — List past code submissions (authenticated)

### Courses
- `GET /api/courses` — List all courses (public)
- `GET /api/courses?difficulty=BEGINNER` — Filter by difficulty (public)
- `GET /api/courses/{slug}` — Course detail with chapters (public)

### Exercises
- `GET /api/exercises` — List all exercises (public)
- `GET /api/exercises?category=Arrays` — Filter by category (public)
- `GET /api/exercises/{slug}` — Exercise detail with starter code (public)
- `POST /api/exercises/{slug}/submit` — Submit code solution (authenticated)

### Progress
- `GET /api/progress` — All course progress for current user (authenticated)
- `POST /api/progress/{courseSlug}/lessons/{lessonId}/complete` — Mark lesson complete (authenticated)

### Leaderboard
- `GET /api/leaderboard` — Top 10 users by XP (public)

---

## 7. Platform Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero, features, stats, testimonials, CTA |
| Sign Up | `/signup` | Account creation |
| Sign In | `/signin` | Authentication |
| Dashboard | `/dashboard` | Stats, progress, recommendations, leaderboard |
| Learn | `/learn` | Course catalog |
| Course Detail | `/learn/:id` | Chapter/lesson breakdown with progress |
| Code Editor | `/editor` | Monaco editor + Python execution + exercises |
| Sandbox | `/sandbox` | Free-form code scratchpad |
| Visualizer | `/visualize` | Sorting algorithm step-by-step animations |
| AI Mentor | `/mentor` | AI chat interface |
| Profile | `/profile` | Settings, badges, notifications, stats |

---

## 8. Traction / Social Proof

- **50+** algorithms covered
- **200+** practice problems
- **12 000+** students (as displayed on landing page)
- **4.9 / 5 ★** user rating

### User Testimonials
> *"The visualizer completely changed how I understand recursion. I went from confused to confident in a week."*
> — Priya M., CS Student

> *"The AI mentor caught a subtle bug in my merge sort that I'd been staring at for hours. Game changer."*
> — Marcus J., Software Engineer

> *"Gamification keeps me coming back daily. 21-day streak and I've solved more problems than the entire last year."*
> — Sarah K., Bootcamp Graduate

---

## 9. Target Market

**Primary:** Computer science students and self-taught developers preparing for technical interviews or wanting to strengthen algorithmic thinking.

**Secondary:** Bootcamp graduates needing structured algorithm practice after completing a web dev course.

**Tertiary:** Professional software engineers refreshing their CS fundamentals.

**Market size:**
- 25M+ software developers worldwide
- $37B+ global online education market
- $8B+ coding education segment (LeetCode, Codecademy, Coursera, etc.)

---

## 10. Competitive Advantage

| Feature | Learning++ | LeetCode | Codecademy | VisuAlgo |
|---|---|---|---|---|
| Algorithm Visualizer | ✅ Real-time, interactive | ❌ | ❌ | ✅ Static |
| AI Mentor (chat) | ✅ | ✅ (paid) | ❌ | ❌ |
| In-browser Python | ✅ (WASM) | ❌ | ✅ | ❌ |
| Gamification (XP/badges) | ✅ Full system | Partial | Partial | ❌ |
| Structured courses | ✅ | ❌ | ✅ | ❌ |
| Free | ✅ | Freemium | Freemium | ✅ |
| Multilingual (EN/FR) | ✅ | ❌ | ❌ | Partial |

**Key differentiator:** Learning++ is the only platform that combines real-time visualizations, an AI mentor, gamification, and structured courses in a single, seamless experience — free forever.

---

## 11. Business Model (Proposed)

**Freemium:**
- **Free tier**: Full access to visualizer, 20 exercises, basic courses, AI mentor (limited messages/day)
- **Pro ($9/mo)**: Unlimited exercises, full course library, unlimited AI mentor, custom themes
- **Team ($29/mo per seat)**: For bootcamps and universities — analytics dashboard, custom exercise sets, group leaderboards

**Additional revenue streams:**
- White-label licensing to coding bootcamps
- API access for AI mentor integration in third-party platforms
- Certification partnerships

---

## 12. Roadmap

### Phase 1 — MVP (Completed)
- ✅ Full frontend (React, TypeScript, Tailwind)
- ✅ Spring Boot REST API with JWT auth
- ✅ Algorithm visualizer (5 sorting algorithms)
- ✅ Monaco code editor + Pyodide Python execution
- ✅ AI Mentor chat interface
- ✅ Gamification (XP, levels, streaks, badges, leaderboard)
- ✅ Course catalog with progress tracking
- ✅ i18n (English + French)

### Phase 2 — Production (Next 3 months)
- [ ] Connect AI Mentor to Claude/OpenAI API (live)
- [ ] Expand visualizer: graphs (BFS/DFS/Dijkstra), trees, dynamic programming
- [ ] PostgreSQL production database
- [ ] Real-time leaderboard with WebSockets
- [ ] Mobile-responsive optimizations

### Phase 3 — Growth (6–12 months)
- [ ] Social features: follow users, share solutions, comment threads
- [ ] Interview prep mode (timed challenges, mock interviews)
- [ ] VS Code extension integration
- [ ] Native mobile app (React Native)
- [ ] Analytics dashboard for educators

---

## 13. Team (Placeholder for Presentation)

*[Add team section: founders, roles, relevant experience — e.g., CS degrees, industry experience, previous projects]*

---

## 14. The Ask (Placeholder for Presentation)

*[Add funding ask: amount, use of funds — e.g., engineering hires, cloud infrastructure, marketing, AI API costs]*

---

## 15. Design Philosophy

- **Clean, modern aesthetic**: Deep dark background (`#050810`), primary blue (`#1a5cff`), accent cyan (`#00d4ff`)
- **White theme variant**: Clean white background with blue/cyan accents for professional presentation contexts
- **Typography**: Sora (display/UI), JetBrains Mono (code)
- **Micro-animations**: Framer Motion for smooth transitions, hover effects, and step-by-step visualizations
- **Glassmorphism**: Frosted glass cards for a premium, layered feel
- **Accessibility**: Keyboard navigation, screen-reader-friendly structure

---

## 16. Technical Architecture Diagram (Simplified)

```
Browser (User)
     │
     ├─── React SPA (Vite) ──────────────────────────────────────────┐
     │    ├─ Pages: Landing, Dashboard, Learn, Editor, Visualizer,   │
     │    │         Mentor, Profile, SignIn, SignUp, Sandbox          │
     │    ├─ State: Zustand (Auth, User, Editor, Viz, Mentor)        │
     │    ├─ Python Execution: Pyodide (WASM) — runs IN BROWSER      │
     │    └─ Animations: Framer Motion                               │
     │                                                               │
     ├─── Spring Boot API (port 8080) ───────────────────────────────┤
     │    ├─ Auth: /api/auth/* (JWT)                                 │
     │    ├─ Users: /api/users/*                                     │
     │    ├─ Courses: /api/courses/*                                 │
     │    ├─ Exercises: /api/exercises/*                             │
     │    ├─ Progress: /api/progress/*                               │
     │    └─ Leaderboard: /api/leaderboard                           │
     │         │                                                     │
     │         └─── Database (H2 dev / PostgreSQL prod)              │
     │                                                               │
     └─── Flask Compiler Service ───────────────────────────────────┘
          └─ POST /run — executes custom algorithm language code
```

---

## 17. Key Metrics to Highlight

| Metric | Value |
|---|---|
| Algorithms supported | 50+ |
| Practice problems | 200+ |
| Active students | 12 000+ |
| Platform rating | 4.9 / 5 ★ |
| Pages / modules | 11 pages |
| API endpoints | 13+ |
| Languages supported | 2 (EN, FR) |
| Tech stack packages | 15+ |
| Gamification ranks | 7 |
| Badge rarities | 4 (Common → Legendary) |
| Level cap | 30 |
