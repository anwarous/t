import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Flame, Zap, Trophy, BookOpen, Code2, ArrowRight,
  CheckCircle, Clock, TrendingUp, Star, ChevronRight, Target
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '@/store'
import { MOCK_COURSES, MOCK_EXERCISES, RECENT_ACTIVITY, LEADERBOARD_OTHERS, type LeaderboardEntry } from '@/data/mockData'
import { cn, getDifficultyBg } from '@/lib/utils'

// ── Animation variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.06, ease: 'easeOut' },
  }),
}

// ── SVG progress ring ──────────────────────────────────────────────────────
function ProgressRing({ pct, size = 64, color = 'var(--color-accent)' }: { pct: number; size?: number; color?: string }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, dimColor }: {
  icon: React.ElementType; value: string; label: string; color: string; dimColor: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative p-5 rounded-lg overflow-hidden group"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 150ms ease-out',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${color}30`
        ;(e.currentTarget as HTMLElement).style.background = `${dimColor}`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div>
          <div
            className="text-xl font-bold leading-none mb-1"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
          >
            {value}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Course card ────────────────────────────────────────────────────────────
function CourseCard({ course, index }: { course: typeof MOCK_COURSES[0]; index: number }) {
  const { t } = useTranslation()
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="p-5 rounded-lg group"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 150ms ease-out',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${course.color}15`, border: `1px solid ${course.color}25` }}
        >
          {course.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="font-bold text-sm truncate"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
            >
              {course.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('tag border', getDifficultyBg(course.difficulty))}>
              {course.difficulty}
            </span>
            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
              <Clock size={10} />
              {course.duration}
            </span>
          </div>
        </div>
        <div className="text-[11px] flex-shrink-0" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
          {course.completedLessons}/{course.totalLessons}
        </div>
      </div>

      <div className="progress-bar mb-3">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${course.progress}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
          {t('dashboard.progress', { pct: course.progress })}
        </span>
        <Link
          to={`/learn/${course.id}`}
          className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {t('dashboard.continueBtn')} <ChevronRight size={11} />
        </Link>
      </div>
    </motion.div>
  )
}

// ── Rank delta indicator ───────────────────────────────────────────────────
function RankDelta({ delta }: { delta: number }) {
  if (delta === 0) return null
  const up = delta > 0
  return (
    <span
      className="text-[10px] font-semibold"
      style={{
        color: up ? '#4ade80' : '#f43f5e',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      {up ? `↑${delta}` : `↓${Math.abs(delta)}`}
    </span>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useTranslation()
  const { user, badges } = useUserStore()
  const earnedBadges = badges.filter(b => b.earned)
  const inProgress   = MOCK_COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const recommended  = MOCK_EXERCISES.filter(e => !e.completed).slice(0, 3)

  const leaderboard = useMemo((): (LeaderboardEntry & { rank: number; delta?: number })[] => {
    const entries: LeaderboardEntry[] = [
      ...LEADERBOARD_OTHERS,
      { name: user.name, xp: user.xp, streak: user.streak, avatar: user.avatar, isCurrentUser: true },
    ]
    return entries
      .sort((a, b) => b.xp - a.xp)
      .map((e, i) => ({ ...e, rank: i + 1, delta: e.isCurrentUser ? 2 : i === 1 ? -1 : i === 3 ? 1 : 0 }))
  }, [user.name, user.xp, user.streak, user.avatar])

  const myRank   = leaderboard.find((e) => e.isCurrentUser)?.rank ?? '-'
  const xpToNext = 4000
  const xpPct    = Math.min(100, (user.xp / xpToNext) * 100)

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <p
              className="text-[11px] uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {t('dashboard.goodMorning')}
            </p>
            <h1
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              {t('dashboard.greeting')},{' '}
              <span className="gradient-text">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('dashboard.subGreeting', { streak: user.streak })}
            </p>
          </div>

          {/* Level + XP ring (desktop) */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-right mb-1" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {t('dashboard.level', { level: user.level })} • {user.rank}
                </div>
                <div className="progress-bar w-28">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="text-[10px] mt-1 text-right" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {t('dashboard.xpOf', { xp: user.xp, max: xpToNext })}
                </div>
              </div>
              <ProgressRing pct={xpPct} size={52} />
            </div>
          </div>
        </motion.div>

        {/* ── Stat cards ─────────────────────────────────────────── */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          <StatCard icon={Zap}         value={user.xp.toLocaleString()}  label={t('dashboard.totalXP')}         color="var(--color-accent)" dimColor="rgba(0,245,212,0.04)" />
          <StatCard icon={Flame}       value={`${user.streak}d`}         label={t('dashboard.currentStreak')}   color="var(--color-xp)"     dimColor="rgba(240,160,48,0.04)" />
          <StatCard icon={CheckCircle} value={user.totalSolved.toString()} label={t('dashboard.problemsSolved')} color="#4ade80"              dimColor="rgba(74,222,128,0.04)" />
          <StatCard icon={Trophy}      value={`#${myRank}`}              label={t('dashboard.leaderboardRank')} color="#a855f7"              dimColor="rgba(168,85,247,0.04)" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── Left 2/3 ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Continue Learning */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-bold flex items-center gap-2 text-sm"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
                >
                  <TrendingUp size={15} style={{ color: 'var(--color-accent)' }} />
                  {t('dashboard.continueLearning')}
                </h2>
                <Link
                  to="/learn"
                  className="flex items-center gap-1 text-[11px] transition-colors"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-text)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-text-mid)')}
                >
                  {t('dashboard.allCoursesLink')} <ChevronRight size={12} />
                </Link>
              </div>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 gap-3"
              >
                {inProgress.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </motion.div>
            </motion.section>

            {/* Recommended Exercises */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-bold flex items-center gap-2 text-sm"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
                >
                  <Target size={15} style={{ color: 'var(--color-accent)' }} />
                  {t('dashboard.recommendedExercises')}
                </h2>
                <Link
                  to="/editor"
                  className="flex items-center gap-1 text-[11px] transition-colors"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-text)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-text-mid)')}
                >
                  {t('dashboard.allProblemsLink')} <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-2.5">
                {recommended.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-lg group"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 150ms ease-out',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <Code2 size={14} style={{ color: 'var(--color-text-mid)' }} />
                      </div>
                      <div>
                        <div
                          className="font-medium text-sm"
                          style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
                        >
                          {ex.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded border', getDifficultyBg(ex.difficulty))}>
                            {ex.difficulty}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                            {ex.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        +{ex.xp} XP
                      </span>
                      <Link
                        to={`/editor?exercise=${ex.id}`}
                        className="flex items-center gap-1.5 btn-primary py-1.5 px-3 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`${t('dashboard.solve')} ${ex.title}`}
                      >
                        {t('dashboard.solve')} <ArrowRight size={11} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Quick Access */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
            >
              <h2
                className="font-bold text-sm mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
              >
                {t('dashboard.quickAccess')}
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { to: '/editor',    icon: Code2,    label: t('dashboard.codeEditorLabel'),  color: 'var(--color-accent)' },
                  { to: '/visualize', icon: BookOpen, label: t('dashboard.visualizerLabel'),  color: '#60a5fa' },
                  { to: '/mentor',    icon: Star,     label: t('dashboard.aiMentorLabel'),    color: 'var(--color-xp)' },
                ].map(({ to, icon: Icon, label, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-lg text-center"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 150ms ease-out',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = `${color}30`
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── Right 1/3 ────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Streak & Level */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="p-5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3
                className="text-[10px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('dashboard.yourProgress')}
              </h3>

              <div className="flex items-center gap-3 mb-5">
                {/* Flame ring */}
                <div className="relative flex-shrink-0">
                  <ProgressRing pct={xpPct} size={56} color="var(--color-xp)" />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-base"
                    aria-hidden="true"
                  >
                    🔥
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold leading-none"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em', color: 'var(--color-xp)' }}
                  >
                    {user.streak}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {t('dashboard.dayStreak')}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  <span>{t('dashboard.levelProgress', { level: user.level })}</span>
                  <span style={{ color: 'var(--color-accent)' }}>{t('dashboard.xpOf', { xp: user.xp, max: xpToNext })}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
              className="p-5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3
                className="text-[10px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('dashboard.recentActivity')}
              </h3>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-2.5"
                  >
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs">
                        <span style={{ color: 'var(--color-text-mid)' }}>{item.action} </span>
                        <span className="font-medium truncate">{item.target}</span>
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {item.time}
                      </div>
                    </div>
                    {item.xp > 0 && (
                      <span
                        className="text-[11px] font-semibold flex-shrink-0"
                        style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        +{item.xp}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 }}
              className="p-5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t('profile.badges.title')}
                </h3>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t('dashboard.earnedCount', { count: earnedBadges.length })}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {earnedBadges.slice(0, 8).map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.38 + i * 0.05, type: 'spring', stiffness: 220 }}
                    title={`${badge.name}: ${badge.description}`}
                    className="w-10 h-10 rounded cursor-help flex items-center justify-center text-lg"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'transform 150ms ease-out',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
                  >
                    {badge.icon}
                  </motion.div>
                ))}
                {Array.from({ length: Math.max(0, 8 - earnedBadges.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded flex items-center justify-center text-[10px]"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px dashed rgba(255,255,255,0.07)',
                      color: 'var(--color-text-faint)',
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}
                  >
                    ?
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.36 }}
              className="p-5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3
                className="text-[10px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('dashboard.leaderboard')}
              </h3>
              <div className="space-y-1.5">
                {leaderboard.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors',
                      entry.isCurrentUser ? '' : 'hover:bg-white/3'
                    )}
                    style={entry.isCurrentUser ? {
                      background: 'var(--color-accent-dim)',
                      border: '1px solid rgba(0,245,212,0.18)',
                    } : {}}
                  >
                    <span
                      className={cn('text-xs font-bold w-4 text-center flex-shrink-0')}
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        color: i === 0 ? 'var(--color-xp)' : i === 1 ? 'var(--color-text)' : i === 2 ? '#a16207' : 'var(--color-text-faint)',
                      }}
                    >
                      {entry.rank}
                    </span>
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {entry.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn('text-xs font-medium truncate', entry.isCurrentUser ? '' : '')}
                        style={{
                          color: entry.isCurrentUser ? 'var(--color-accent)' : 'var(--color-text)',
                          fontFamily: 'IBM Plex Mono, monospace',
                        }}
                      >
                        {entry.name}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {entry.xp.toLocaleString()} XP
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {entry.delta !== undefined && entry.delta !== 0 && (
                        <RankDelta delta={entry.delta} />
                      )}
                      <span
                        className="text-[10px] flex items-center gap-0.5"
                        style={{ color: 'var(--color-xp)', fontFamily: 'IBM Plex Mono, monospace' }}
                      >
                        <Flame size={9} />
                        {entry.streak}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
