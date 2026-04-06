import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, Brain, Trophy, GitBranch, Code2,
  CheckCircle, Star, BarChart2, Terminal, Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

// ── Stagger variants ──────────────────────────────────────────────────────
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' },
  }),
}

const ALGORITHMS = [
  'Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search',
  'BFS', 'DFS', 'Dijkstra', 'Dynamic Programming',
  'Heap Sort', 'A* Search', 'Kruskal', 'Floyd-Warshall',
]

const FEATURE_DATA = [
  { icon: GitBranch, colorVar: 'var(--color-accent)',   key: 'viz'      },
  { icon: Brain,     colorVar: '#818cf8',               key: 'ai'       },
  { icon: Trophy,    colorVar: 'var(--color-xp)',       key: 'gamified' },
  { icon: Code2,     colorVar: '#4ade80',               key: 'editor'   },
]

// ── Inline stat counter ────────────────────────────────────────────────────
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl font-bold leading-none mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em', color: 'var(--color-accent)' }}
      >
        {value}
      </div>
      <div
        className="text-xs uppercase tracking-widest"
        style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
      >
        {label}
      </div>
    </div>
  )
}

// ── Terminal prompt decoration ─────────────────────────────────────────────
function TerminalLine({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 text-xs"
      style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--color-text-mid)' }}
    >
      <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>❯</span>
      <span>{children}</span>
    </div>
  )
}

export default function Landing() {
  const { t } = useTranslation()

  const STATS = [
    { value: '50+',  label: t('landing.stats.algorithms') },
    { value: '200+', label: t('landing.stats.problems') },
    { value: '12k+', label: t('landing.stats.students') },
    { value: '4.9★', label: t('landing.stats.rating') },
  ]

  return (
    <div className="relative overflow-hidden" style={{ paddingTop: '56px' }}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col justify-center px-6 py-20">
        {/* Accent glow — asymmetric, top-left anchored */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%', left: '-5%',
            width: '50vw', height: '50vw',
            background: 'radial-gradient(ellipse, rgba(0,245,212,0.06) 0%, transparent 65%)',
          }}
        />
        {/* Secondary glow — right side */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '5%', right: '-10%',
            width: '35vw', height: '35vw',
            background: 'radial-gradient(ellipse, rgba(240,160,48,0.04) 0%, transparent 65%)',
          }}
        />

        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Status badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 mb-8"
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                background: 'rgba(0,245,212,0.06)',
                border: '1px solid rgba(0,245,212,0.2)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                color: 'var(--color-accent)',
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={11} />
              <span>v2.4.0 — NOW LIVE</span>
              <span style={{ color: 'rgba(0,245,212,0.4)' }}>•</span>
              <span style={{ color: 'var(--color-text-mid)' }}>AI Mentor beta</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="leading-none tracking-tight mb-6 text-balance"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em',
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                fontWeight: 700,
              }}
            >
              {t('landing.heroTitle')}{' '}
              <br className="hidden sm:block" />
              <span className="gradient-text">{t('landing.heroTitleHighlight')}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-xl mb-10 leading-relaxed"
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-mid)',
                fontFamily: 'IBM Plex Mono, monospace',
              }}
            >
              {t('landing.heroDesc')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-3 mb-16">
              <Link
                to="/signup"
                className="btn-primary px-7 py-3.5 text-sm"
                aria-label={t('landing.getStarted')}
              >
                {t('landing.getStarted')}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/visualize"
                className="btn-ghost px-7 py-3.5 text-sm"
                aria-label={t('landing.watchDemo')}
              >
                <Terminal size={14} />
                {t('landing.watchDemo')}
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap items-center gap-5"
            >
              {[t('landing.trust.noCard'), t('landing.trust.languages'), t('landing.trust.free')].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  <CheckCircle size={12} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Terminal card — decorative, asymmetric bleed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 max-w-lg"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex gap-1.5">
                {['#f43f5e', '#f0a030', 'var(--color-accent)'].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span
                className="text-[10px] ml-1"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                learning++ — dashboard
              </span>
            </div>
            {/* Content */}
            <div className="px-4 py-4 space-y-2">
              <TerminalLine>npm install learning-plus-plus</TerminalLine>
              <TerminalLine>
                <span style={{ color: 'var(--color-text)' }}>
                  ✓ <span style={{ color: 'var(--color-accent)' }}>50</span> algorithms loaded
                </span>
              </TerminalLine>
              <TerminalLine>
                <span style={{ color: 'var(--color-text)' }}>
                  ✓ AI mentor <span style={{ color: 'var(--color-accent)' }}>online</span>
                </span>
              </TerminalLine>
              <TerminalLine>
                <span style={{ color: 'var(--color-text)' }}>
                  ✓ streak <span style={{ color: 'var(--color-xp)' }}>7 days 🔥</span>
                </span>
              </TerminalLine>
              <TerminalLine>
                <span style={{ color: 'var(--color-text-faint)' }}>
                  Waiting for input<span className="animate-pulse">_</span>
                </span>
              </TerminalLine>
            </div>
          </motion.div>
        </div>

        {/* Algorithm tags — bottom of hero, full-width overflow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute bottom-6 left-0 right-0 overflow-hidden"
        >
          <div className="flex gap-2 px-6 flex-wrap max-w-5xl mx-auto">
            {ALGORITHMS.map((algo, i) => (
              <motion.span
                key={algo}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.04, duration: 0.25 }}
                className="cursor-default"
                style={{
                  padding: '4px 10px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: 'var(--color-text-mid)',
                  transition: 'all 150ms ease-out',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.3)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-mid)'
                }}
              >
                {algo}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <section
        className="py-12 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <StatBadge value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div
              className="text-[10px] uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              // FEATURES
            </div>
            <h2
              className="leading-tight"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 700,
              }}
            >
              {t('landing.features.title')}{' '}
              <span className="gradient-text">{t('landing.features.titleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {FEATURE_DATA.map(({ icon: Icon, colorVar, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                className="relative group overflow-hidden"
                style={{
                  padding: '28px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  transition: 'all 150ms ease-out',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${colorVar}40`
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 flex items-center justify-center mb-5"
                  style={{
                    background: `${colorVar}15`,
                    border: `1px solid ${colorVar}30`,
                    borderRadius: '6px',
                  }}
                >
                  <Icon size={18} style={{ color: colorVar }} />
                </div>
                <h3
                  className="mb-2 font-bold"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  {t(`landing.features.${key}.title`)}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t(`landing.features.${key}.desc`)}
                </p>
                {/* Left accent bar on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: colorVar, boxShadow: `0 0 8px ${colorVar}` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div
              className="text-[10px] uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-xp)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              // HOW IT WORKS
            </div>
            <h2
              className="leading-tight"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 700,
              }}
            >
              {t('landing.howItWorks.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {(['step1', 'step2', 'step3'] as const).map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8"
                style={{ background: 'var(--color-bg)' }}
              >
                <div
                  className="text-5xl font-bold mb-5 leading-none"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '-0.04em',
                    color: 'rgba(0,245,212,0.08)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: 'var(--color-accent)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t(`landing.howItWorks.${step}.title`)}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t(`landing.howItWorks.${step}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-3">
            {(['r1', 'r2', 'r3'] as const).map((key, i) => {
              const review = {
                quote: t(`landing.reviews.${key}.quote`),
                name:  t(`landing.reviews.${key}.name`),
                role:  t(`landing.reviews.${key}.role`),
                stars: 5,
              }
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                  }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.stars }).map((_, j) => (
                      <Star key={j} size={12} style={{ color: 'var(--color-xp)', fill: 'var(--color-xp)' }} />
                    ))}
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    "{review.quote}"
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: 'var(--color-accent-dim)',
                        border: '1px solid rgba(0,245,212,0.2)',
                        color: 'var(--color-accent)',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {review.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {review.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden p-12"
            style={{
              background: 'rgba(0,245,212,0.04)',
              border: '1px solid rgba(0,245,212,0.15)',
              borderRadius: '6px',
              boxShadow: '0 0 60px rgba(0,245,212,0.06)',
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(0,245,212,0.12) 0%, transparent 70%)' }}
            />

            <div className="relative text-center">
              <div
                className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--color-accent)', boxShadow: '0 0 20px var(--color-accent-glow)' }}
              >
                <BarChart2 size={22} style={{ color: '#0a120e' }} />
              </div>
              <h2
                className="mb-4 leading-tight"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                }}
              >
                {t('landing.cta.title')}{' '}
                <span className="gradient-text">{t('landing.cta.titleHighlight')}</span>
              </h2>
              <p
                className="mb-8 text-sm"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('landing.cta.desc')}
              </p>
              <Link to="/signup" className="btn-primary px-8 py-3.5 text-sm">
                {t('landing.cta.button')}
                <ArrowRight size={16} />
              </Link>
              <p
                className="mt-4 text-xs"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('landing.cta.sub')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold select-none"
              style={{ background: 'var(--color-accent)', color: '#0a120e', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              L+
            </div>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
            >
              Learning++
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
            © 2025 Learning++. {t('landing.footer.tagline')}
          </p>
          <div className="flex gap-5 text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {[t('landing.footer.privacy'), t('landing.footer.terms'), t('landing.footer.contact')].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors"
                style={{ color: 'var(--color-text-faint)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-text)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-text-faint)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
