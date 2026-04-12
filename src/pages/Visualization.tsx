import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipForward, SkipBack,
  RefreshCw, ChevronLeft, ChevronRight, Info, Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useVisualizationStore } from '@/store'
import { cn } from '@/lib/utils'

const ALGORITHMS = [
  { id: 'bubble',    label: 'Bubble Sort',    complexity: 'O(n²)', color: '#1a5cff' },
  { id: 'selection', label: 'Selection Sort', complexity: 'O(n²)', color: '#00d4ff' },
]

const COMPLEXITIES: Record<string, { time: string; space: string; desc: string }> = {
  bubble:    { time: 'O(n²)', space: 'O(1)', desc: 'Repeatedly swaps adjacent elements that are out of order. Simple but slow on large inputs.' },
  selection: { time: 'O(n²)', space: 'O(1)', desc: 'Finds the minimum element each pass and places it at the front. Fewer swaps than bubble sort.' },
}

// ── Bars ──────────────────────────────────────────────────────────────────────
function SortBars() {
  const { t } = useTranslation()
  const { steps, currentStep, array } = useVisualizationStore()
  const step       = steps.length > 0 ? steps[currentStep] : null
  const displayArr = step ? step.array : array
  const comparing  = step?.comparing ?? null
  const swapping   = step?.swapping  ?? null
  const sorted     = step?.sorted    ?? []
  const maxVal     = Math.max(...displayArr, 1)

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Description bar */}
      <div className="px-4 py-2.5 border-b border-white/5 min-h-[44px] flex items-center flex-shrink-0">
        <AnimatePresence mode="wait">
          {step ? (
            <motion.div
              key={step.description}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2 text-sm text-surface-300"
            >
              <Info size={13} className="text-brand-400 flex-shrink-0" />
              {step.description}
            </motion.div>
          ) : (
            <p key="idle" className="text-sm text-surface-500 flex items-center gap-2">
              <Info size={13} />
              {t('visualize.pressPlay')}
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Bars */}
      <div className="flex-1 flex items-end justify-center gap-[3px] px-5 pb-5 pt-6 min-h-0">
        {displayArr.map((val, i) => {
          const isCmp  = comparing && (comparing[0] === i || comparing[1] === i)
          const isSw   = swapping  && (swapping[0]  === i || swapping[1]  === i)
          const isSrtd = sorted.includes(i)

          const bg   = isSw ? '#f43f5e' : isCmp ? '#f59e0b' : isSrtd ? '#10b981' : '#3b7bff'
          const glow = isSw
            ? '0 0 14px rgba(244,63,94,0.7)'
            : isCmp
            ? '0 0 14px rgba(245,158,11,0.6)'
            : isSrtd
            ? '0 0 8px rgba(16,185,129,0.35)'
            : 'none'

          return (
            <motion.div
              key={i}
              layout
              className="relative flex-1 min-w-[4px] max-w-[52px] rounded-t-sm"
              style={{
                height: `${Math.max((val / maxVal) * 100, 2)}%`,
                background: bg,
                boxShadow: glow,
                transition: 'height 0.08s ease, background 0.12s ease, box-shadow 0.12s ease',
              }}
            >
              {displayArr.length <= 16 && (
                <span
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono leading-none select-none"
                  style={{ color: isSw ? '#f43f5e' : isCmp ? '#f59e0b' : isSrtd ? '#10b981' : '#5e6880' }}
                >
                  {val}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 pb-4 flex-wrap flex-shrink-0">
        {[
          { color: '#3b7bff',  key: 'unsorted'  },
          { color: '#f59e0b',  key: 'comparing' },
          { color: '#f43f5e',  key: 'swapping'  },
          { color: '#10b981',  key: 'sorted'    },
        ].map(({ color, key }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-surface-500">{t(`visualize.legend.${key}`)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VisualizationPage() {
  const { t } = useTranslation()
  const {
    algorithm, steps, currentStep, state, speed, arraySize,
    setAlgorithm, generateArray, setSpeed, setArraySize,
    play, pause, reset,
    stepForward, stepBackward, skipToStart, skipToEnd,
    cleanup,
  } = useVisualizationStore()

  // Only cleanup on unmount — no timer logic here at all
  useEffect(() => {
    generateArray()
    return () => cleanup()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived ────────────────────────────────────────────────────────────────
  const isPlaying = state === 'playing'
  const isDone    = state === 'done'
  const progress  = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0
  const algoInfo  = COMPLEXITIES[algorithm]

  const statusLabel = isPlaying ? t('visualize.statusPlaying') : isDone ? t('visualize.statusDone') : state === 'paused' ? t('visualize.statusPaused') : t('visualize.statusReady')
  const statusColor = isPlaying
    ? 'bg-emerald-500/15 text-emerald-400'
    : isDone
    ? 'bg-brand-500/15 text-brand-400'
    : state === 'paused'
    ? 'bg-amber-500/15 text-amber-400'
    : 'bg-surface-800 text-surface-500'

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="max-w-[1120px] mx-auto">

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-1">
            {t('visualize.title')}
          </h1>
          <p className="text-surface-400">{t('visualize.subtitle')}</p>
        </motion.div>

        <div className="grid xl:grid-cols-4 gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1 space-y-4"
          >
            {/* Algorithm picker */}
            <div className="p-4 rounded-2xl glass border border-white/8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('visualize.algorithmLabel')}</h3>
              <div className="space-y-1.5">
                {ALGORITHMS.map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => { setAlgorithm(algo.id as 'bubble' | 'selection'); generateArray() }}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                      algorithm === algo.id
                        ? 'bg-brand-500/15 border border-brand-500/30 text-white'
                        : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'
                    )}
                  >
                    <span>{t(`visualize.algorithms.${algo.id}`)}</span>
                    <span className="font-mono text-xs text-surface-500">{algo.complexity}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Array size */}
            <div className="p-4 rounded-2xl glass border border-white/8">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">
                <span>{t('visualize.arraySize')}</span>
                <span className="text-white">{arraySize}</span>
              </div>
              <input
                type="range" min={5} max={22} value={arraySize}
                onChange={e => setArraySize(Number(e.target.value))}
                disabled={isPlaying}
                className="w-full accent-brand-500 cursor-pointer mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => { reset(); generateArray() }}
                disabled={isPlaying}
                className="w-full btn-ghost text-xs py-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw size={13} /> {t('visualize.randomize')}
              </button>
            </div>

            {/* Speed */}
            <div className="p-4 rounded-2xl glass border border-white/8">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">
                <span>{t('visualize.speed')}</span>
                <span className="text-white">{speed <= 200 ? t('visualize.fast') : speed <= 500 ? t('visualize.normal') : t('visualize.slow')}</span>
              </div>
              {/* Inverted: slider right = faster = lower ms */}
              <input
                type="range" min={80} max={1000} step={40}
                value={1080 - speed}
                onChange={e => setSpeed(1080 - Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-surface-600 mt-1">
                <span>{t('visualize.slow')}</span><span>{t('visualize.fast')}</span>
              </div>
            </div>

            {/* Complexity */}
            {algoInfo && (
              <div className="p-4 rounded-2xl glass border border-white/8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('visualize.complexityLabel')}</h3>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">{t('visualize.timeLabel')}</span>
                    <span className="font-mono text-amber-400">{algoInfo.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">{t('visualize.spaceLabel')}</span>
                    <span className="font-mono text-emerald-400">{algoInfo.space}</span>
                  </div>
                </div>
                <p className="text-xs text-surface-500 leading-relaxed">{t(`visualize.desc.${algorithm}`)}</p>
              </div>
            )}
          </motion.div>

          {/* ── Main canvas ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="xl:col-span-3"
          >
            <div
              className="rounded-2xl glass border border-white/8 overflow-hidden flex flex-col"
              style={{ height: '540px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">
                    {t(`visualize.algorithms.${algorithm}`)}
                  </h3>
                  <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', statusColor)}>
                    {statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <Zap size={12} className="text-brand-400" />
                  {steps.length > 0
                    ? t('visualize.stepOf', { current: currentStep + 1, total: steps.length })
                    : `${arraySize} elements`}
                </div>
              </div>

              {/* Bars area */}
              <div className="flex-1 min-h-0 flex flex-col">
                <SortBars />
              </div>

              {/* Controls footer */}
              <div className="border-t border-white/5 px-5 py-4 flex-shrink-0">
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-surface-800 mb-5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #1a5cff, #00d4ff)',
                      boxShadow: '0 0 8px rgba(0,212,255,0.4)',
                    }}
                    transition={{ duration: 0.06 }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3">

                  {/* Skip to start */}
                  <button
                    onClick={skipToStart}
                    disabled={isPlaying || currentStep === 0}
                    className="w-9 h-9 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center text-surface-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Skip to start"
                  >
                    <SkipBack size={16} />
                  </button>

                  {/* Step back */}
                  <button
                    onClick={stepBackward}
                    disabled={isPlaying || currentStep === 0}
                    className="w-9 h-9 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center text-surface-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Step back"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Play / Pause — big button */}
                  <motion.button
                    onClick={isPlaying ? pause : play}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow-blue transition-shadow"
                    style={{
                      background: isDone
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #1a5cff, #0039f5)',
                    }}
                    title={isPlaying ? 'Pause' : isDone ? 'Replay' : 'Play'}
                  >
                    <AnimatePresence mode="wait">
                      {isPlaying ? (
                        <motion.span
                          key="pause"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Pause size={22} className="text-white" />
                        </motion.span>
                      ) : isDone ? (
                        <motion.span
                          key="replay"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <RefreshCw size={20} className="text-white" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="play"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Play size={22} className="text-white ml-0.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Step forward */}
                  <button
                    onClick={stepForward}
                    disabled={isPlaying || isDone}
                    className="w-9 h-9 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center text-surface-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Step forward"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Skip to end */}
                  <button
                    onClick={skipToEnd}
                    disabled={isPlaying || isDone}
                    className="w-9 h-9 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center text-surface-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Skip to end"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Hint text */}
                <p className="text-center text-xs text-surface-600 mt-3">
                  {isPlaying
                    ? t('visualize.hintPlaying')
                    : isDone
                    ? t('visualize.hintDone')
                    : t('visualize.hintIdle')}
                </p>
              </div>
            </div>

            {/* Step stats */}
            {steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-3 mt-4"
              >
                {[
                  { labelKey: 'visualize.stats.totalSteps',  value: steps.length                },
                  { labelKey: 'visualize.stats.currentStep', value: currentStep + 1             },
                  { labelKey: 'visualize.stats.progressLabel', value: `${Math.round(progress)}%` },
                ].map(({ labelKey, value }) => (
                  <div key={labelKey} className="p-4 rounded-2xl glass border border-white/8 text-center">
                    <div className="text-2xl font-display font-bold gradient-text">{value}</div>
                    <div className="text-xs text-surface-500 mt-1">{t(labelKey)}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
