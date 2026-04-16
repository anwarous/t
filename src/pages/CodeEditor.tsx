import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {
  Play, RotateCcw, ChevronLeft, CheckCircle2, XCircle,
  Lightbulb, Terminal, Code2, Loader2, BookOpen, ExternalLink,
  Zap, Star, Filter, Save, FolderOpen, Cloud
} from 'lucide-react'
import { useEditorStore } from '@/store'
import { useUserStore } from '@/store'
import { MOCK_EXERCISES } from '@/data/mockData'
import { cn, getDifficultyBg } from '@/lib/utils'
import { installAlgorithmBangShortcut, registerAlgorithmLanguage } from '@/lib/algorithmLanguage'
import {
  downloadDriveJsonFile,
  listJsonFilesInLearningPlusPlusFolder,
  saveExerciseJsonToDrive,
  type GoogleDriveFileSummary,
} from '@/lib/googleDriveService.js'
import { useTranslation } from 'react-i18next'
import levelUpSvg from '@/assets/level-up.svg'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment',  foreground: '5e6880', fontStyle: 'italic' },
    { token: 'keyword',  foreground: '3b7bff' },
    { token: 'string',   foreground: '10b981' },
    { token: 'number',   foreground: 'f59e0b' },
    { token: 'function',        foreground: 'a78bfa' },
    { token: 'type',            foreground: 'a78bfa' },
    { token: 'keyword.struct',  foreground: 'f97316' },
  ],
  colors: {
    'editor.background':                '#090e1f',
    'editor.foreground':                '#e2e8f0',
    'editorLineNumber.foreground':      '#3d4560',
    'editorLineNumber.activeForeground':'#8b95b0',
    'editor.selectionBackground':       '#1a5cff30',
    'editor.lineHighlightBackground':   '#141c35',
    'editorCursor.foreground':          '#1a5cff',
    'editor.inactiveSelectionBackground':'#1a5cff15',
  },
}

const EXECUTION_FEEDBACK_ANIMATIONS = {
  error: 'https://lottie.host/8f0449b4-f6d9-4ff6-bfac-c9f77a45c04b/Bc9E8QJAYq.lottie',
  success: 'https://lottie.host/170f762d-7919-4e3e-aed0-7b24de4a55fa/4LK3tbtITs.lottie',
} as const

const SUCCESS_FEEDBACK_DISPLAY_MS = 2200
const ERROR_FEEDBACK_DISPLAY_MS = 1400
const LEVEL_UP_DELAY_AFTER_CONGRATULATION_MS = 220

function toExerciseSlug(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return normalized || 'exercise'
}

function displayDriveFileName(name: string) {
  return name.replace(/\.json$/i, '')
}

function ExecutionFeedback({ status }: { status: 'success' | 'error' }) {
  const isSuccess = status === 'success'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: isSuccess ? 0.35 : 0.24, ease: 'easeOut' }}
      className={cn(
        'fixed z-[80] pointer-events-none',
        isSuccess
          ? 'inset-0 flex items-center justify-center backdrop-blur-[3px] bg-slate-950/45'
          : 'right-5 bottom-5'
      )}
    >
      <div
        className={cn(
          isSuccess
            ? 'h-[54vh] w-[54vw] max-w-[760px] min-w-[280px]'
            : 'rounded-2xl border border-rose-400/35 bg-rose-500/10 px-3 py-2'
        )}
      >
        <div className={cn(isSuccess ? 'h-full w-full' : 'h-24 w-24 sm:h-28 sm:w-28')}>
          <DotLottieReact
            src={EXECUTION_FEEDBACK_ANIMATIONS[status]}
            autoplay
            loop={!isSuccess}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function LevelUpOverlay({ level }: { level: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.32, ease: 'easeOut' }}
      className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center px-4 backdrop-blur-[4px]"
      style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, rgba(3,7,20,0.62) 84%)' }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 8, opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.14 : 0.56, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[380px]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: prefersReducedMotion ? 0.22 : [0.14, 0.34, 0.18] }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 1.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[28px] blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.38) 0%, rgba(16,185,129,0) 72%)' }}
        />

        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/35 bg-slate-950/88 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.95, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-20 -skew-x-12 bg-gradient-to-r from-transparent via-emerald-100/28 to-transparent"
          />

          <div className="relative z-10 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/95">
                <Zap size={12} />
                Level Up
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-2 py-1 text-[10px] font-semibold text-amber-200">
                <Star size={11} />
                +1
              </span>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.08, duration: prefersReducedMotion ? 0.12 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3"
            >
              <div className="mx-auto w-[82%] max-w-[240px]">
                <motion.img
                  src={levelUpSvg}
                  alt="Level up"
                  initial={{ scale: 0.92, y: 8, opacity: 0 }}
                  animate={{ scale: prefersReducedMotion ? 1 : [0.96, 1.02, 1], y: prefersReducedMotion ? 0 : [6, -2, 0], opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-auto drop-shadow-[0_10px_24px_rgba(16,185,129,0.32)]"
                />
              </div>

              <p className="mt-2 text-center text-[11px] uppercase tracking-[0.22em] text-emerald-100/85">You reached</p>
              <p className="text-center text-xl font-extrabold tracking-[0.12em] text-emerald-100">LEVEL {level}</p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.12, duration: prefersReducedMotion ? 0.1 : 0.45, ease: 'easeOut' }}
              className="mt-3 h-1.5 origin-left rounded-full bg-white/10"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.7, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300"
              />
            </motion.div>
          </div>

          {!prefersReducedMotion && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 1, 0], y: [6, -6, -14] }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute left-6 top-14 text-emerald-200/80"
              >
                <Star size={12} />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: [0, 1, 0], y: [4, -5, -12] }}
                transition={{ delay: 0.08, duration: 0.95, ease: 'easeOut' }}
                className="absolute right-7 top-16 text-emerald-200/75"
              >
                <Star size={10} />
              </motion.span>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Per-line syntax-aware colouring ──────────────────────────────────────────
function ColoredOutput({ text }: { text: string }) {
  return (
    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text">
      {text.split('\n').map((line, i) => {
        let cls = 'text-surface-300'
        if (/^\s*✓/.test(line))                       cls = 'text-emerald-400'
        else if (/^\s*✗/.test(line))                  cls = 'text-rose-400'
        else if (line.startsWith('✅'))               cls = 'text-emerald-300'
        else if (line.startsWith('❌'))               cls = 'text-rose-300'
        else if (line.startsWith('⚠️'))              cls = 'text-amber-300'
        else if (line.startsWith('💡'))               cls = 'text-brand-300'
        else if (/^[⏱📦]/.test(line))               cls = 'text-surface-500'
        else if (/Error:|TypeError:|NameError:/.test(line)) cls = 'text-rose-400'
        return (
          <span key={i} className={cn('block', cls)}>{line === '' ? '\u00A0' : line}</span>
        )
      })}
    </pre>
  )
}

// ── Output panel ─────────────────────────────────────────────────────────────
function OutputPanel({ output, isRunning }: { output: string; isRunning: boolean }) {
  const { t } = useTranslation()
  const has    = output.trim() !== ''
  const passed = has && output.includes('✅') && !output.includes('❌') && !output.includes('Error') && !output.includes('✗')
  const failed = has && (output.includes('❌') || output.includes('✗') || /Error:/.test(output))

  const scoreMatch = output.match(/(\d+)\s*\/\s*(\d+)\s*test cases passed/)
  const badge = scoreMatch
    ? `${scoreMatch[1]}/${scoreMatch[2]} tests`
    : passed ? t('editor.allPassed')
    : failed ? t('editor.testsFailed')
    : null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <Terminal size={14} className="text-surface-400" />
        <span className="text-xs font-medium text-surface-400">{t('editor.output')}</span>

        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-400">
            <Loader2 size={12} className="animate-spin" />
            {t('editor.running')}
          </span>
        )}

        {!isRunning && has && badge && (
          <span className={cn(
            'ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border',
            passed
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
              : failed
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/25'
              : 'text-surface-400 bg-surface-800 border-white/8'
          )}>
            {passed && <CheckCircle2 size={11} />}
            {failed && <XCircle size={11} />}
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4 min-h-0">
        {isRunning ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-surface-500 text-sm">
              <Loader2 size={16} className="animate-spin text-brand-400" />
              {t('editor.executingCode')}
            </div>
            <div className="space-y-2">
              {[75, 55, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-surface-800 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : has ? (
          <ColoredOutput text={output} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center">
              <Play size={20} className="text-surface-500" />
            </div>
            <p className="text-surface-500 text-sm">
              {t('editor.pressRun')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Problem description panel ─────────────────────────────────────────────────
function ExercisePanel({ exercise }: { exercise: typeof MOCK_EXERCISES[0] }) {
  const { t } = useTranslation()
  return (
    <div className="h-full overflow-auto p-5">
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-3">
          <h2 className="font-bold text-lg">{exercise.title}</h2>
          <span className={cn('tag border text-xs', getDifficultyBg(exercise.difficulty))}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-500">
          <span className="flex items-center gap-1"><Code2 size={13} />{exercise.category}</span>
          <span className="text-brand-400 font-semibold">+{exercise.xp} XP</span>
        </div>
      </div>

      <p className="text-surface-300 leading-relaxed mb-5 text-sm">{exercise.description}</p>

      {exercise.examples && exercise.examples.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('editor.examples')}</h4>
          <div className="space-y-2 mb-5">
            {exercise.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-900 border border-white/5 font-mono text-xs">
                <div><span className="text-surface-500">{t('editor.input')}: </span><span className="text-surface-300">{ex.input}</span></div>
                <div><span className="text-surface-500">{t('editor.output')}: </span><span className="text-emerald-400">{ex.output}</span></div>
                {ex.note && <div className="text-surface-600 mt-1"># {ex.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {exercise.constraints && exercise.constraints.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('editor.constraints')}</h4>
          <ul className="space-y-1.5 text-sm text-surface-400 mb-5">
            {exercise.constraints.map(c => (
              <li key={c} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-surface-600 flex-shrink-0" />{c}
              </li>
            ))}
          </ul>
        </>
      )}

      {exercise.hint && (
        <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
            <Lightbulb size={13} /> {t('editor.hint')}
          </div>
          <p className="text-surface-300 text-xs leading-relaxed">
            {exercise.hint}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Challenge card ────────────────────────────────────────────────────────────
function ChallengeCard({
  exercise,
  isCompleted,
  onClick,
  index,
}: {
  exercise: typeof MOCK_EXERCISES[0]
  isCompleted: boolean
  onClick: () => void
  index: number
}) {
  const diffColors: Record<string, string> = {
    Easy:   'from-emerald-500/10 to-emerald-500/5  border-emerald-500/20  hover:border-emerald-400/40',
    Medium: 'from-amber-500/10  to-amber-500/5   border-amber-500/20   hover:border-amber-400/40',
    Hard:   'from-rose-500/10   to-rose-500/5    border-rose-500/20    hover:border-rose-400/40',
  }
  const glowColors: Record<string, string> = {
    Easy:   'rgba(16,185,129,0.15)',
    Medium: 'rgba(245,158,11,0.15)',
    Hard:   'rgba(244,63,94,0.15)',
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.025, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'group relative text-left w-full rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        diffColors[exercise.difficulty] ?? 'border-white/10 hover:border-white/20',
      )}
      style={{
        background: `linear-gradient(135deg, rgba(13,15,20,0.95) 0%, rgba(20,24,40,0.90) 100%)`,
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColors[exercise.difficulty] ?? 'transparent'}, transparent 70%)` }}
      />

      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} /> Done
        </div>
      )}

      {/* Difficulty + category row */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('tag border text-xs', getDifficultyBg(exercise.difficulty))}>
          {exercise.difficulty}
        </span>
        <span className="text-xs text-surface-500 flex items-center gap-1">
          <Code2 size={11} />{exercise.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-base mb-2 leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {exercise.title}
      </h3>

      {/* Description */}
      <p className="text-surface-400 text-xs leading-relaxed line-clamp-2 mb-4">
        {exercise.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
          <Zap size={12} /> +{exercise.xp} XP
        </span>
        {exercise.attempts > 0 && !isCompleted && (
          <span className="text-xs text-surface-500">{exercise.attempts} attempt{exercise.attempts !== 1 ? 's' : ''}</span>
        )}
      </div>
    </motion.button>
  )
}

// ── Challenge select view ─────────────────────────────────────────────────────
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'] as const

function ChallengesGrid({
  completedExercises,
  onSelect,
}: {
  completedExercises: string[]
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')

  const visible = filter === 'All'
    ? MOCK_EXERCISES
    : MOCK_EXERCISES.filter(e => e.difficulty === filter)

  const counts = {
    All:    MOCK_EXERCISES.length,
    Easy:   MOCK_EXERCISES.filter(e => e.difficulty === 'Easy').length,
    Medium: MOCK_EXERCISES.filter(e => e.difficulty === 'Medium').length,
    Hard:   MOCK_EXERCISES.filter(e => e.difficulty === 'Hard').length,
  }

  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="px-6 py-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-accent)' }}
        >
          Choose Your Challenge
        </h1>
        <p className="text-surface-400 text-sm">
          {MOCK_EXERCISES.filter(e => completedExercises.includes(e.id)).length} / {MOCK_EXERCISES.length} completed
        </p>
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-surface-500" />
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              filter === d
                ? d === 'Easy'   ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : d === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                : d === 'Hard'   ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                :                  'text-white bg-white/8 border-white/15'
                : 'text-surface-400 border-white/8 hover:text-white hover:bg-white/5'
            )}
          >
            {d}
            <span className="opacity-60">{counts[d]}</span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((exercise, i) => (
          <ChallengeCard
            key={exercise.id}
            exercise={exercise}
            isCompleted={completedExercises.includes(exercise.id)}
            onClick={() => onSelect(exercise.id)}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Challenge editor view ─────────────────────────────────────────────────────
function ChallengeEditor({
  exerciseId,
  onBack,
}: {
  exerciseId: string
  onBack: () => void
}) {
  const { t }      = useTranslation()
  const navigate   = useNavigate()
  const exercise   = MOCK_EXERCISES.find(e => e.id === exerciseId) ?? MOCK_EXERCISES[0]
  const resolvedExerciseId = exercise.id

  const { code, output, isRunning, language, setCode, setLanguage, runCode, setActiveExercise } = useEditorStore()
  const [executionFeedback, setExecutionFeedback] = useState<'success' | 'error' | null>(null)
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
  const [queuedLevelUp, setQueuedLevelUp] = useState<number | null>(null)
  const [driveMessage, setDriveMessage] = useState<string | null>(null)
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false)
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFileSummary[]>([])
  const [isDriveUploadModalOpen, setIsDriveUploadModalOpen] = useState(false)
  const [driveUploadFileName, setDriveUploadFileName] = useState('')
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null)
  const [driveSaveBusy, setDriveSaveBusy] = useState(false)
  const [driveLoadBusy, setDriveLoadBusy] = useState(false)
  const [driveDownloadBusyFileId, setDriveDownloadBusyFileId] = useState<string | null>(null)
  const feedbackTimerRef = useRef<number | null>(null)
  const levelUpOverlayTimerRef = useRef<number | null>(null)
  const levelUpStartTimerRef = useRef<number | null>(null)
  const driveMessageTimerRef = useRef<number | null>(null)

  const monacoLang = language === 'algorithm' ? 'algorithm' : 'python'
  const fileExt    = language === 'algorithm' ? 'solution.algo' : 'solution.py'
  const isDriveBusy = driveSaveBusy || driveLoadBusy || !!driveDownloadBusyFileId
  const driveStatusLabel = isDriveBusy ? 'Drive sync in progress' : 'Drive ready'

  useEffect(() => {
    setActiveExercise(resolvedExerciseId)
    const starter = language === 'algorithm' && exercise.algorithmStarterCode
      ? exercise.algorithmStarterCode
      : exercise.starterCode
    setCode(starter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedExerciseId])

  useEffect(() => {
    if (isRunning || !output.trim()) return

    const failed = output.includes('❌') || output.includes('✗') || /Error:/.test(output)
    setExecutionFeedback(failed ? 'error' : 'success')

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current)
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setExecutionFeedback(null)
      feedbackTimerRef.current = null
    }, failed ? ERROR_FEEDBACK_DISPLAY_MS : SUCCESS_FEEDBACK_DISPLAY_MS)
  }, [isRunning, output])

  useEffect(() => {
    if (queuedLevelUp === null || executionFeedback !== null) return

    if (levelUpStartTimerRef.current) {
      window.clearTimeout(levelUpStartTimerRef.current)
    }

    levelUpStartTimerRef.current = window.setTimeout(() => {
      setLevelUpLevel(queuedLevelUp)
      setShowLevelUpOverlay(true)
      setQueuedLevelUp(null)

      if (levelUpOverlayTimerRef.current) {
        window.clearTimeout(levelUpOverlayTimerRef.current)
      }
      levelUpOverlayTimerRef.current = window.setTimeout(() => {
        setShowLevelUpOverlay(false)
        levelUpOverlayTimerRef.current = null
      }, 2900)
    }, LEVEL_UP_DELAY_AFTER_CONGRATULATION_MS)
  }, [executionFeedback, queuedLevelUp])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current)
      }
      if (levelUpOverlayTimerRef.current) {
        window.clearTimeout(levelUpOverlayTimerRef.current)
      }
      if (levelUpStartTimerRef.current) {
        window.clearTimeout(levelUpStartTimerRef.current)
      }
      if (driveMessageTimerRef.current) {
        window.clearTimeout(driveMessageTimerRef.current)
      }
    }
  }, [])

  function showDriveMessage(message: string) {
    setDriveMessage(message)
    if (driveMessageTimerRef.current) {
      window.clearTimeout(driveMessageTimerRef.current)
    }
    driveMessageTimerRef.current = window.setTimeout(() => {
      setDriveMessage(null)
      driveMessageTimerRef.current = null
    }, 4200)
  }

  async function handleRun() {
    const previousLevel = useUserStore.getState().user.level
    await runCode()

    const nextLevel = useUserStore.getState().user.level
    if (nextLevel > previousLevel) {
      setQueuedLevelUp(nextLevel)
    }
  }

  async function handleSaveToDrive() {
    if (driveSaveBusy) return

    const normalized = driveUploadFileName.trim()
    if (!normalized) {
      setDriveUploadError('Please enter a file name.')
      return
    }

    setDriveSaveBusy(true)
    try {
      const slug = toExerciseSlug(exercise.title)
      const uploaded = await saveExerciseJsonToDrive({
        title: exercise.title,
        slug,
        language: language === 'algorithm' ? 'algorithm' : 'python',
        content: code,
        exerciseId: resolvedExerciseId,
      }, undefined, normalized)
      showDriveMessage(`Saved to Drive as ${displayDriveFileName(uploaded.name)}`)
      setIsDriveUploadModalOpen(false)
      setDriveUploadError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save file to Google Drive.'
      showDriveMessage(message)
    } finally {
      setDriveSaveBusy(false)
    }
  }

  function openDriveUploadModal() {
    if (driveSaveBusy || isRunning) return
    setDriveUploadFileName(toExerciseSlug(exercise.title))
    setDriveUploadError(null)
    setIsDriveUploadModalOpen(true)
  }

  async function handleOpenDriveModal() {
    if (driveLoadBusy) return

    setDriveLoadBusy(true)
    try {
      const files = await listJsonFilesInLearningPlusPlusFolder()
      setDriveFiles(files)
      setIsDriveModalOpen(true)
      if (files.length === 0) {
        showDriveMessage('No JSON files found in your LearningPlusPlus Drive folder.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load files from Google Drive.'
      showDriveMessage(message)
    } finally {
      setDriveLoadBusy(false)
    }
  }

  async function handleLoadDriveFile(fileId: string) {
    if (driveDownloadBusyFileId) return

    setDriveDownloadBusyFileId(fileId)
    try {
      const payload = await downloadDriveJsonFile(fileId)
      const loadedContent = typeof payload?.content === 'string'
        ? payload.content
        : typeof payload?.code === 'string'
        ? payload.code
        : null

      if (!loadedContent) {
        throw new Error('Selected file does not contain a valid code payload.')
      }

      setCode(loadedContent)
      if (payload?.language === 'python' || payload?.language === 'algorithm') {
        setLanguage(payload.language)
      }

      setIsDriveModalOpen(false)
      showDriveMessage('Loaded content from Google Drive.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download selected Drive file.'
      showDriveMessage(message)
    } finally {
      setDriveDownloadBusyFileId(null)
    }
  }

  function handleEditorMount(editor: any, monaco: any) {
    registerAlgorithmLanguage(monaco)
    monaco.editor.defineTheme('mq-dark', MONACO_THEME)
    monaco.editor.setTheme('mq-dark')
    installAlgorithmBangShortcut(editor, monaco)
  }

  return (
    <motion.div
      key="editor"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="h-[calc(100dvh-60px)] flex flex-col"
    >
      <AnimatePresence>
        {showLevelUpOverlay && levelUpLevel !== null && <LevelUpOverlay level={levelUpLevel} />}
      </AnimatePresence>

      <AnimatePresence>
        {executionFeedback && <ExecutionFeedback status={executionFeedback} />}
      </AnimatePresence>

      <AnimatePresence>
        {isDriveUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[111] flex items-center justify-center bg-slate-950/70 px-4"
            onClick={() => {
              if (!driveSaveBusy) {
                setIsDriveUploadModalOpen(false)
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold">Save to Google Drive</h3>
                <button
                  type="button"
                  disabled={driveSaveBusy}
                  onClick={() => setIsDriveUploadModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-surface-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              <form
                className="space-y-3 p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSaveToDrive()
                }}
              >
                <label className="block text-xs font-medium text-surface-400" htmlFor="drive-upload-file-name-editor">
                  File name
                </label>
                <input
                  id="drive-upload-file-name-editor"
                  type="text"
                  value={driveUploadFileName}
                  onChange={(event) => setDriveUploadFileName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-800/70 px-3 py-2 text-sm text-surface-100 outline-none transition-colors focus:border-brand-400/50"
                  placeholder="exercise-solution"
                  autoFocus
                />

                {driveUploadError && (
                  <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {driveUploadError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDriveUploadModalOpen(false)}
                    className="btn-ghost py-1.5 px-3 text-xs"
                    disabled={driveSaveBusy}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-1.5 px-3 text-xs" disabled={driveSaveBusy}>
                    {driveSaveBusy ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDriveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4"
            onClick={() => {
              if (!driveDownloadBusyFileId) {
                setIsDriveModalOpen(false)
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-surface-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold">Load from Google Drive</h3>
                <button
                  type="button"
                  disabled={!!driveDownloadBusyFileId}
                  onClick={() => setIsDriveModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-surface-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto p-3">
                {driveFiles.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-surface-400">
                    No JSON files available in LearningPlusPlus.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {driveFiles.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => {
                          void handleLoadDriveFile(file.id)
                        }}
                        disabled={!!driveDownloadBusyFileId}
                        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-surface-800/60 px-3 py-2 text-left hover:border-white/20 hover:bg-surface-800 disabled:opacity-60"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-surface-200">{displayDriveFileName(file.name)}</p>
                          <p className="text-xs text-surface-500">
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleString()
                              : 'Unknown date'}
                          </p>
                        </div>
                        {driveDownloadBusyFileId === file.id && <Loader2 size={14} className="animate-spin text-surface-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-surface-900/50 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={15} /> Challenges
          </button>

          <div className="w-px h-4 bg-white/10" />

          {/* Active exercise pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-white/8 text-sm">
            <BookOpen size={14} className="text-surface-400 flex-shrink-0" />
            <span className="font-medium truncate max-w-[160px]">{exercise.title}</span>
            <span className={cn('tag border text-xs flex-shrink-0', getDifficultyBg(exercise.difficulty))}>
              {exercise.difficulty}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={cn(
              'hidden 2xl:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
              isDriveBusy
                ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
            )}
            title={driveStatusLabel}
          >
            {isDriveBusy ? <Loader2 size={12} className="animate-spin" /> : <Cloud size={12} />}
            {driveStatusLabel}
          </span>
          {driveMessage && (
            <span className="hidden xl:inline text-xs text-surface-400 max-w-[280px] truncate" title={driveMessage}>
              {driveMessage}
            </span>
          )}
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value
              setLanguage(newLang)
              const starter = newLang === 'algorithm' && exercise.algorithmStarterCode
                ? exercise.algorithmStarterCode
                : exercise.starterCode
              setCode(starter)
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/8 text-sm text-surface-300 outline-none cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="algorithm">Algorithm</option>
          </select>
          <button
            onClick={() => navigate('/sandbox')}
            className="btn-ghost py-1.5 px-3 text-xs"
            title={t('editor.freeMode')}
          >
            <ExternalLink size={13} /> {t('editor.freeMode')}
          </button>
          <button
            onClick={() => {
              const starter = language === 'algorithm' && exercise.algorithmStarterCode
                ? exercise.algorithmStarterCode
                : exercise.starterCode
              setCode(starter)
            }}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            <RotateCcw size={13} /> {t('editor.reset')}
          </button>
          <button
            onClick={openDriveUploadModal}
            disabled={driveSaveBusy || isRunning}
            className={cn('btn-ghost py-1.5 px-3 text-xs', (driveSaveBusy || isRunning) && 'opacity-70 cursor-not-allowed')}
            title="Save current exercise content to Google Drive"
          >
            {driveSaveBusy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save to Drive
          </button>
          <button
            onClick={() => { void handleOpenDriveModal() }}
            disabled={driveLoadBusy || isRunning}
            className={cn('btn-ghost py-1.5 px-3 text-xs', (driveLoadBusy || isRunning) && 'opacity-70 cursor-not-allowed')}
            title="Load a saved JSON file from Google Drive"
          >
            {driveLoadBusy ? <Loader2 size={13} className="animate-spin" /> : <FolderOpen size={13} />}
            Load from Drive
          </button>
          <button
            onClick={() => { void handleRun() }}
            disabled={isRunning}
            className={cn('btn-primary py-1.5 px-4 text-sm', isRunning && 'opacity-70 cursor-not-allowed')}
          >
            {isRunning
              ? <><Loader2 size={14} className="animate-spin" /> {t('editor.running')}</>
              : <><Play size={14} /> {t('editor.run')}</>
            }
          </button>
        </div>
      </div>

      {/* ── Three-panel layout ───────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">

        {/* Problem description */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 border-r border-white/5 flex-shrink-0 bg-surface-900/30">
          <ExercisePanel exercise={exercise} />
        </div>

        {/* Monaco editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* File tab */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-surface-900/20 flex-shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xs text-surface-500 font-mono ml-2">{fileExt}</span>
          </div>

          <div className="flex-1 min-h-0">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center text-surface-500 gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading editor…
              </div>
            }>
              <MonacoEditor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(v) => setCode(v ?? '')}
                onMount={handleEditorMount}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineHeight: 1.7,
                  padding: { top: 16, bottom: 16 },
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'gutter',
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: 'on',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: 'on',
                  overviewRulerBorder: false,
                  hideCursorInOverviewRuler: true,
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  autoSurround: 'languageDefined',
                  contextmenu: false,
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* Output console */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-72 xl:w-96 border-l border-white/5 flex-shrink-0 bg-surface-900/30"
        >
          <OutputPanel output={output} isRunning={isRunning} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CodeEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const exerciseId = searchParams.get('exercise')

  const { user } = useUserStore()
  const completedExercises = user.completedExercises ?? []

  function handleSelect(id: string) {
    setSearchParams({ exercise: id })
  }

  function handleBack() {
    setSearchParams({})
  }

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        {exerciseId ? (
          <ChallengeEditor
            key={`editor-${exerciseId}`}
            exerciseId={exerciseId}
            onBack={handleBack}
          />
        ) : (
          <ChallengesGrid
            key="grid"
            completedExercises={completedExercises}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


