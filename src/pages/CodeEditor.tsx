import { useEffect, useState, Suspense, lazy } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Play, RotateCcw, ChevronLeft, CheckCircle2, XCircle,
  Lightbulb, Terminal, Code2, Loader2, BookOpen, ExternalLink,
  Zap, Star, Filter
} from 'lucide-react'
import { useEditorStore } from '@/store'
import { useUserStore } from '@/store'
import { MOCK_EXERCISES } from '@/data/mockData'
import { cn, getDifficultyBg } from '@/lib/utils'
import { registerAlgorithmLanguage } from '@/lib/algorithmLanguage'
import { useTranslation } from 'react-i18next'

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
          {MOCK_EXERCISES.filter(e => completedExercises.includes(e.id) || e.completed).length} / {MOCK_EXERCISES.length} completed
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
            isCompleted={exercise.completed || completedExercises.includes(exercise.id)}
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

  const monacoLang = language === 'algorithm' ? 'algorithm' : 'python'
  const fileExt    = language === 'algorithm' ? 'solution.algo' : 'solution.py'

  useEffect(() => {
    setActiveExercise(resolvedExerciseId)
    const starter = language === 'algorithm' && exercise.algorithmStarterCode
      ? exercise.algorithmStarterCode
      : exercise.starterCode
    setCode(starter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedExerciseId])

  function handleEditorMount(_: unknown, monaco: any) {
    registerAlgorithmLanguage(monaco)
    monaco.editor.defineTheme('mq-dark', MONACO_THEME)
    monaco.editor.setTheme('mq-dark')
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
            onClick={() => runCode()}
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


