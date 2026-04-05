# MQAcademy – UML Diagrams

> Diagrams are written in [Mermaid](https://mermaid.js.org/) and render natively on GitHub.

---

## 1. Use Case Diagram

```mermaid
%%{init: {"theme": "default"}}%%
graph LR
    Guest(["👤 Guest"])
    Student(["🎓 Student"])
    AIMentor(["🤖 AI Mentor\n(System)"])

    subgraph MQAcademy Platform
        UC1([View Landing Page])
        UC2([Sign Up])
        UC3([Sign In])
        UC4([Sign Out])
        UC5([View Dashboard])
        UC6([Browse Courses])
        UC7([View Course Details])
        UC8([Track Lesson Progress])
        UC9([Solve Exercises])
        UC10([Run Python Code])
        UC11([Run Algorithm Code])
        UC12([Visualize Sorting Algorithms])
        UC13([Control Visualization\nplay / pause / step])
        UC14([Chat with AI Mentor])
        UC15([Receive AI Hints])
        UC16([View Profile])
        UC17([Manage Settings\ntheme / language / notifications])
        UC18([View Badges & Achievements])
        UC19([Earn XP & Level Up])
    end

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3

    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7
    Student --> UC8
    Student --> UC9
    Student --> UC10
    Student --> UC11
    Student --> UC12
    Student --> UC13
    Student --> UC14
    Student --> UC16
    Student --> UC17
    Student --> UC18

    UC9 -.->|includes| UC10
    UC9 -.->|includes| UC11
    UC9 -.->|extends| UC19
    UC8 -.->|extends| UC19

    UC14 --> AIMentor
    AIMentor --> UC15
    UC15 -.->|extends| UC14
```

---

## 2. Class Diagram

```mermaid
classDiagram
    direction TB

    %% ── Data Model ──────────────────────────────────────────────────

    class Course {
        +string id
        +string title
        +string description
        +string category
        +string difficulty
        +number progress
        +number totalLessons
        +number completedLessons
        +string duration
        +number xpReward
        +string color
        +string icon
        +string[] tags
        +Chapter[] chapters
    }

    class Chapter {
        +string id
        +string title
        +Lesson[] lessons
    }

    class Lesson {
        +string id
        +string title
        +string type
        +string duration
        +boolean completed
        +boolean locked
        +number xp
    }

    class Exercise {
        +string id
        +string title
        +string difficulty
        +string category
        +boolean completed
        +number attempts
        +number xp
        +string description
        +string starterCode
        +string algorithmStarterCode
        +string solution
        +Array examples
        +string[] constraints
        +string hint
        +Array testCases
        +Array algorithmTestCases
    }

    class Badge {
        +string id
        +string name
        +string description
        +string icon
        +boolean earned
        +string earnedAt
        +string rarity
    }

    class ChatMessage {
        +string id
        +string role
        +string content
        +string timestamp
        +string type
    }

    class SortStep {
        +number[] array
        +number[] comparing
        +number[] swapping
        +number[] sorted
        +string description
    }

    %% ── Zustand Stores ──────────────────────────────────────────────

    class useAuthStore {
        +string|null token
        +boolean isAuthenticated
        +object|null authUser
        +setAuth(token, user) void
        +clearAuth() void
    }

    class useUserStore {
        +string id
        +string name
        +string email
        +string avatar
        +number xp
        +number level
        +number streak
        +number totalSolved
        +string rank
        +string joinedAt
        +string bio
        +string language
        +string theme
        +string[] completedExercises
        +object notifications
        +addXP(amount) void
        +incrementStreak() void
        +markExerciseSolved(id, xp) void
        +updateProfile(patch) void
        +updateNotifications(patch) void
        +updateTheme(theme) void
        +initUser(username, displayName, email) void
        +resetUser() void
    }

    class useEditorStore {
        +string code
        +string language
        +string output
        +boolean isRunning
        +string|null activeExerciseId
        +setCode(code) void
        +setLanguage(lang) void
        +setOutput(output) void
        +setRunning(bool) void
        +setActiveExercise(id) void
        +runCode() Promise~void~
    }

    class useVisualizationStore {
        +string algorithm
        +number[] array
        +SortStep[] steps
        +number currentStep
        +string state
        +number speed
        +number arraySize
        +setAlgorithm(algo) void
        +generateArray() void
        +setSpeed(speed) void
        +setArraySize(size) void
        +play() void
        +pause() void
        +reset() void
        +stepForward() void
        +stepBackward() void
        +skipToStart() void
        +skipToEnd() void
        +generateSteps() void
        +cleanup() void
    }

    class useMentorStore {
        +ChatMessage[] messages
        +boolean isTyping
        +sendMessage(content) Promise~void~
        +clearMessages() void
    }

    %% ── Library / Utility ───────────────────────────────────────────

    class PythonCompiler {
        +runPython(code, inputs) Promise~string~
    }

    class AlgoCompiler {
        +runAlgo(code, inputs) Promise~string~
    }

    class Utils {
        +cn(...inputs) string
        +formatXP(xp) string
        +getLevel(xp) number
        +getLevelProgress(xp) number
        +getDifficultyColor(difficulty) string
        +getDifficultyBg(difficulty) string
        +getRarityColor(rarity) string
        +getRarityGlow(rarity) string
    }

    %% ── Pages ───────────────────────────────────────────────────────

    class LandingPage { }
    class DashboardPage { }
    class CodeEditorPage { }
    class VisualizationPage { }
    class MentorPage { }
    class LearnPage { }
    class ProfilePage { }
    class SandboxPage { }
    class SignInPage { }
    class SignUpPage { }

    %% ── Relationships ───────────────────────────────────────────────

    Course "1" *-- "many" Chapter : contains
    Chapter "1" *-- "many" Lesson : contains
    useVisualizationStore "1" *-- "many" SortStep : generates

    useEditorStore --> PythonCompiler : uses
    useEditorStore --> AlgoCompiler : uses
    useEditorStore --> useUserStore : calls markExerciseSolved

    useAuthStore --> useUserStore : triggers initUser / resetUser

    DashboardPage --> useUserStore : reads
    DashboardPage --> useEditorStore : reads
    CodeEditorPage --> useEditorStore : reads / writes
    CodeEditorPage --> useUserStore : reads
    VisualizationPage --> useVisualizationStore : reads / writes
    MentorPage --> useMentorStore : reads / writes
    LearnPage --> useUserStore : reads
    ProfilePage --> useUserStore : reads / writes
    SandboxPage --> useEditorStore : reads / writes
    SignInPage --> useAuthStore : writes
    SignUpPage --> useAuthStore : writes
```

---

## 3. Package Diagram

```mermaid
graph TD
    subgraph src["📦 src (Application Root)"]

        subgraph pages["📄 pages"]
            P1[Landing]
            P2[Dashboard]
            P3[CodeEditor]
            P4[Visualization]
            P5[Mentor]
            P6[Learn]
            P7[Profile]
            P8[Sandbox]
            P9[SignIn]
            P10[SignUp]
            P11[NotFound]
        end

        subgraph components["🧩 components"]
            subgraph layout["layout"]
                C1[Layout]
                C2[Navbar]
            end
            subgraph ui["ui"]
                C3[Badge]
                C4[Toast]
                C5[Skeleton]
            end
        end

        subgraph store["🗃️ store"]
            S1[useAuthStore]
            S2[useUserStore]
            S3[useEditorStore]
            S4[useVisualizationStore]
            S5[useMentorStore]
        end

        subgraph hooks["🪝 hooks"]
            H1[useInterval]
            H2[useKeyboard]
            H3[useLocalStorage]
        end

        subgraph lib["🔧 lib"]
            L1[utils]
            L2[pythonCompiler]
            L3[algoCompiler]
            L4[algorithmLanguage]
        end

        subgraph data["📊 data"]
            D1[mockData]
        end

        App[App.tsx]
        Main[main.tsx]
        I18N[i18n.ts]
    end

    subgraph backend["🖥️ backend (Flask – algoCompiler/)"]
        B1[Flask API /run]
    end

    subgraph external["📦 External Libraries"]
        E1[Pyodide – Python WASM]
        E2[Monaco Editor]
        E3[i18next]
        E4[Zustand]
        E5[Framer Motion]
        E6[React Router]
        E7[Tailwind CSS]
    end

    Main --> App
    App --> pages
    App --> components
    App --> I18N

    pages --> store
    pages --> components
    pages --> data

    store --> lib
    store --> hooks
    store --> data

    lib --> E1
    lib --> B1

    I18N --> E3
    store --> E4
    components --> E5
    App --> E6

    style src fill:#1e293b,color:#e2e8f0,stroke:#334155
    style backend fill:#1e3a2f,color:#e2e8f0,stroke:#166534
    style external fill:#1e1b4b,color:#e2e8f0,stroke:#3730a3
```
