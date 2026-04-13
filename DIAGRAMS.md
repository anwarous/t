# Learning++ – Diagrammes UML

> Les diagrammes sont rédigés en [Mermaid](https://mermaid.js.org/) et s'affichent nativement sur GitHub.

---

## 1. Diagramme de cas d'utilisation

```mermaid
%%{init: {"theme": "default"}}%%
graph LR
    Guest(["👤 Invité"])
    Student(["🎓 Étudiant"])
    AIMentor(["🤖 Mentor IA\n(Système)"])

    subgraph Plateforme Learning++
        UC1([Voir la page d'accueil])
        UC2([S'inscrire])
        UC3([Se connecter])
        UC4([Se déconnecter])
        UC5([Voir le tableau de bord])
        UC6([Parcourir les cours])
        UC7([Voir les détails du cours])
        UC8([Suivre la progression des leçons])
        UC9([Résoudre des exercices])
        UC10([Exécuter du code Python])
        UC11([Exécuter du code d'algorithme])
        UC12([Visualiser les algorithmes de tri])
        UC13([Contrôler la visualisation\nlecture / pause / étape])
        UC14([Discuter avec le Mentor IA])
        UC15([Recevoir des indices IA])
        UC16([Voir le profil])
        UC17([Gérer les paramètres\nthème / langue / notifications])
        UC18([Voir les badges et réalisations])
        UC19([Gagner des XP et monter de niveau])
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

    UC9 -.->|inclut| UC10
    UC9 -.->|inclut| UC11
    UC9 -.->|étend| UC19
    UC8 -.->|étend| UC19

    UC14 --> AIMentor
    AIMentor --> UC15
    UC15 -.->|étend| UC14
```

---

## 2. Diagramme de classes

```mermaid
classDiagram
    direction TB

    %% ── Modèle de données ───────────────────────────────────────────

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

    %% ── Stores Zustand ──────────────────────────────────────────────

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

    %% ── Bibliothèque / Utilitaires ──────────────────────────────────

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

    %% ── Relations ───────────────────────────────────────────────────

    Course "1" *-- "many" Chapter : contient
    Chapter "1" *-- "many" Lesson : contient
    useVisualizationStore "1" *-- "many" SortStep : génère

    useEditorStore --> PythonCompiler : utilise
    useEditorStore --> AlgoCompiler : utilise
    useEditorStore --> useUserStore : appelle markExerciseSolved

    useAuthStore --> useUserStore : déclenche initUser / resetUser

    DashboardPage --> useUserStore : lit
    DashboardPage --> useEditorStore : lit
    CodeEditorPage --> useEditorStore : lit / écrit
    CodeEditorPage --> useUserStore : lit
    VisualizationPage --> useVisualizationStore : lit / écrit
    MentorPage --> useMentorStore : lit / écrit
    LearnPage --> useUserStore : lit
    ProfilePage --> useUserStore : lit / écrit
    SandboxPage --> useEditorStore : lit / écrit
    SignInPage --> useAuthStore : écrit
    SignUpPage --> useAuthStore : écrit
```

---

## 3. Diagramme de paquets

```mermaid
graph TD
    subgraph src["📦 src (Racine de l'application)"]

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

        subgraph components["🧩 composants"]
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

        subgraph data["📊 données"]
            D1[mockData]
        end

        App[App.tsx]
        Main[main.tsx]
        I18N[i18n.ts]
    end

    subgraph backend["🖥️ backend (Flask – algoCompiler/)"]
        B1[Flask API /run]
    end

    subgraph external["📦 Bibliothèques externes"]
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
