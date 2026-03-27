import { useEffect, Suspense, lazy } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play, RotateCcw, ChevronDown, CheckCircle2, XCircle,
  Lightbulb, Terminal, Code2, Loader2, BookOpen, ExternalLink
} from 'lucide-react'
import { useEditorStore } from '@/store'
import { MOCK_EXERCISES } from '@/data/mockData'
import { cn, getDifficultyBg } from '@/lib/utils'
import { registerAlgorithmLanguage } from '@/lib/algorithmLanguage'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment',  foreground: '5e6880', fontStyle: 'italic' },
    { token: 'keyword',  foreground: '3b7bff' },
    { token: 'string',   foreground: '10b981' },
    { token: 'number',   foreground: 'f59e0b' },
    { token: 'function', foreground: '00d4ff' },
    { token: 'type',     foreground: 'a78bfa' },
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
  const has    = output.trim() !== ''
  const passed = has && output.includes('✅') && !output.includes('❌') && !output.includes('Error') && !output.includes('✗')
  const failed = has && (output.includes('❌') || output.includes('✗') || /Error:/.test(output))

  const scoreMatch = output.match(/(\d+)\s*\/\s*(\d+)\s*test cases passed/)
  const badge = scoreMatch
    ? `${scoreMatch[1]}/${scoreMatch[2]} tests`
    : passed ? 'All passed'
    : failed ? 'Failed'
    : null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <Terminal size={14} className="text-surface-400" />
        <span className="text-xs font-medium text-surface-400">Output</span>

        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-400">
            <Loader2 size={12} className="animate-spin" />
            Running…
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
              Executing code…
            </div>
            <p className="text-surface-600 text-xs">
              First run initialises the Python engine — this may take a moment.
            </p>
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
              Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-800 text-surface-300 font-mono text-xs">
                Run
              </kbd>{' '}
              to execute your code
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Problem description panel ─────────────────────────────────────────────────
function ExercisePanel({ exercise }: { exercise: typeof MOCK_EXERCISES[0] }) {
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">Examples</h4>
          <div className="space-y-2 mb-5">
            {exercise.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-900 border border-white/5 font-mono text-xs">
                <div><span className="text-surface-500">Input: </span><span className="text-surface-300">{ex.input}</span></div>
                <div><span className="text-surface-500">Output: </span><span className="text-emerald-400">{ex.output}</span></div>
                {ex.note && <div className="text-surface-600 mt-1"># {ex.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {exercise.constraints && exercise.constraints.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">Constraints</h4>
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
            <Lightbulb size={13} /> Hint
          </div>
          <p className="text-surface-300 text-xs leading-relaxed">
            {exercise.hint}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CodeEditorPage() {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()
  const exerciseId     = searchParams.get('exercise') || 'ex-001'

  const { code, output, isRunning, language, setCode, setLanguage, runCode, setActiveExercise } = useEditorStore()
  const exercise = MOCK_EXERCISES.find(e => e.id === exerciseId) ?? MOCK_EXERCISES[0]

  // Language → Monaco language id & file extension
  const monacoLang = language === 'algorithm' ? 'algorithm' : 'python'
  const fileExt    = language === 'algorithm' ? 'solution.algo' : 'solution.py'

  // Load starter code when exercise changes
  useEffect(() => {
    setActiveExercise(exerciseId)
    setCode(exercise.starterCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId])

  function handleEditorMount(_: unknown, monaco: any) {
    registerAlgorithmLanguage(monaco)
    monaco.editor.defineTheme('mq-dark', MONACO_THEME)
    monaco.editor.setTheme('mq-dark')
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-surface-900/50 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Active exercise pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-white/8 text-sm">
            <BookOpen size={14} className="text-surface-400 flex-shrink-0" />
            <span className="font-medium truncate max-w-[160px]">{exercise.title}</span>
            <span className={cn('tag border text-xs flex-shrink-0', getDifficultyBg(exercise.difficulty))}>
              {exercise.difficulty}
            </span>
            <ChevronDown size={13} className="text-surface-500 flex-shrink-0" />
          </div>

          {/* Quick switcher — desktop only */}
          <div className="hidden md:flex items-center gap-1.5">
            {MOCK_EXERCISES.slice(0, 4).map(ex => (
              <a
                key={ex.id}
                href={`?exercise=${ex.id}`}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors',
                  ex.id === exerciseId
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                    : 'text-surface-500 hover:text-white hover:bg-white/5'
                )}
              >
                {ex.completed && <CheckCircle2 size={11} className="text-emerald-400" />}
                {ex.title}
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/8 text-sm text-surface-300 outline-none cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="algorithm">Algorithm</option>
          </select>
          <button
            onClick={() => navigate('/sandbox')}
            className="btn-ghost py-1.5 px-3 text-xs"
            title="Open Free Coding Sandbox"
          >
            <ExternalLink size={13} /> Free Mode
          </button>
          <button
            onClick={() => setCode(exercise.starterCode)}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={() => runCode()}
            disabled={isRunning}
            className={cn('btn-primary py-1.5 px-4 text-sm', isRunning && 'opacity-70 cursor-not-allowed')}
          >
            {isRunning
              ? <><Loader2 size={14} className="animate-spin" /> Running…</>
              : <><Play size={14} /> Run Code</>
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
    </div>
  )
}
