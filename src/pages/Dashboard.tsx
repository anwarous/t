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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
}

function StatCard({ icon: Icon, value, label, color, bg }: {
  icon: React.ElementType; value: string; label: string; color: string; bg: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative p-5 rounded-2xl glass border border-white/8 overflow-hidden group"
    >
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300', bg)} />
      <div className="relative flex items-start gap-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
          <Icon size={20} className={color} />
        </div>
        <div>
          <div className="text-2xl font-display font-bold">{value}</div>
          <div className="text-sm text-surface-400">{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

function CourseCard({ course, index }: { course: typeof MOCK_COURSES[0]; index: number }) {
  const { t } = useTranslation()
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl glass border border-white/8 hover:border-white/15 transition-colors group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${course.color}20`, border: `1px solid ${course.color}30` }}
        >
          {course.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold truncate">{course.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('tag border text-xs', getDifficultyBg(course.difficulty))}>
              {course.difficulty}
            </span>
            <span className="text-xs text-surface-500 flex items-center gap-1">
              <Clock size={11} />
              {course.duration}
            </span>
          </div>
        </div>
        <div className="text-xs text-surface-500 flex-shrink-0">{course.completedLessons}/{course.totalLessons}</div>
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
        <span className="text-xs text-surface-500">{t('dashboard.progress', { pct: course.progress })}</span>
        <Link
          to={`/learn/${course.id}`}
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {t('dashboard.continueBtn')} <ChevronRight size={12} />
        </Link>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, badges } = useUserStore()
  const earnedBadges = badges.filter(b => b.earned)
  const inProgress = MOCK_COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const recommended = MOCK_EXERCISES.filter(e => !e.completed).slice(0, 3)

  // Build dynamic leaderboard with the real current-user entry
  const leaderboard = useMemo((): (LeaderboardEntry & { rank: number })[] => {
    const entries: LeaderboardEntry[] = [
      ...LEADERBOARD_OTHERS,
      { name: user.name, xp: user.xp, streak: user.streak, avatar: user.avatar, isCurrentUser: true },
    ]
    return entries
      .sort((a, b) => b.xp - a.xp)
      .map((e, i) => ({ ...e, rank: i + 1 }))
  }, [user.name, user.xp, user.streak, user.avatar])

  const myRank = leaderboard.find((e) => e.isCurrentUser)?.rank ?? '-'

  const xpToNext = 4000
  const xpProgress = (user.xp / xpToNext) * 100

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-400 text-sm mb-1">{t('dashboard.goodMorning')}</p>
              <h1 className="text-3xl font-display font-bold">
                {t('dashboard.greeting')}, <span className="gradient-text">{user.name.split(' ')[0]}</span>
              </h1>
              <p className="text-surface-400 mt-1.5">{t('dashboard.subGreeting', { streak: user.streak })}</p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-surface-500 mb-1">{t('dashboard.level', { level: user.level })} • {user.rank}</div>
              <div className="progress-bar w-32">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <div className="text-xs text-surface-500 mt-1">{t('dashboard.xpOf', { xp: user.xp.toLocaleString(), max: xpToNext.toLocaleString() })}</div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={Zap} value={user.xp.toLocaleString()} label={t('dashboard.totalXP')} color="text-brand-400" bg="bg-brand-500/10" />
          <StatCard icon={Flame} value={`${user.streak} ${t('dashboard.days')}`} label={t('dashboard.currentStreak')} color="text-amber-400" bg="bg-amber-500/10" />
          <StatCard icon={CheckCircle} value={user.totalSolved.toString()} label={t('dashboard.problemsSolved')} color="text-emerald-400" bg="bg-emerald-500/10" />
          <StatCard icon={Trophy} value={`#${myRank}`} label={t('dashboard.leaderboardRank')} color="text-purple-400" bg="bg-purple-500/10" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Continue Learning */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-400" />
                  {t('dashboard.continueLearning')}
                </h2>
                <Link to="/learn" className="text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-1">
                  {t('dashboard.allCoursesLink')} <ChevronRight size={14} />
                </Link>
              </div>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 gap-4"
              >
                {inProgress.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </motion.div>
            </motion.section>

            {/* Recommended Exercises */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Target size={18} className="text-accent-cyan" />
                  {t('dashboard.recommendedExercises')}
                </h2>
                <Link to="/editor" className="text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-1">
                  {t('dashboard.allProblemsLink')} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {recommended.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className="flex items-center justify-between p-4 rounded-xl glass border border-white/8 hover:border-white/15 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center">
                        <Code2 size={16} className="text-surface-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{ex.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', getDifficultyBg(ex.difficulty))}>
                            {ex.difficulty}
                          </span>
                          <span className="text-xs text-surface-500">{ex.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-brand-400 font-semibold">+{ex.xp} XP</span>
                      <Link
                        to={`/editor?exercise=${ex.id}`}
                        className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {t('dashboard.solve')} <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Quick Access */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-lg font-bold mb-4">{t('dashboard.quickAccess')}</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { to: '/editor', icon: Code2, label: t('dashboard.codeEditorLabel'), color: 'text-brand-400', bg: 'bg-brand-500/10' },
                  { to: '/visualize', icon: BookOpen, label: t('dashboard.visualizerLabel'), color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { to: '/mentor', icon: Star, label: t('dashboard.aiMentorLabel'), color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map(({ to, icon: Icon, label, color, bg }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl glass border border-white/8 hover:border-white/20 transition-all hover:-translate-y-0.5 text-center"
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                      <Icon size={18} className={color} />
                    </div>
                    <span className="text-xs font-medium text-surface-300">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="space-y-6">

            {/* Streak & XP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-2xl glass border border-white/8"
            >
              <h3 className="font-bold text-sm text-surface-400 uppercase tracking-wider mb-4">{t('dashboard.yourProgress')}</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Flame size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold">{user.streak}</div>
                  <div className="text-sm text-surface-400">{t('dashboard.dayStreak')}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                    <span>{t('dashboard.levelProgress', { level: user.level })}</span>
                    <span>{t('dashboard.xpOf', { xp: user.xp, max: xpToNext })}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl glass border border-white/8"
            >
              <h3 className="font-bold text-sm text-surface-400 uppercase tracking-wider mb-4">{t('dashboard.recentActivity')}</h3>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-xs flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs">
                        <span className="text-surface-400">{item.action} </span>
                        <span className="font-medium truncate">{item.target}</span>
                      </div>
                      <div className="text-xs text-surface-500">{item.time}</div>
                    </div>
                    {item.xp > 0 && (
                      <span className="text-xs text-brand-400 font-semibold flex-shrink-0">+{item.xp}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="p-5 rounded-2xl glass border border-white/8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-surface-400 uppercase tracking-wider">{t('profile.badges.title')}</h3>
                <span className="text-xs text-surface-500">{t('dashboard.earnedCount', { count: earnedBadges.length })}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {earnedBadges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 200 }}
                    title={`${badge.name}: ${badge.description}`}
                    className="w-10 h-10 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center text-xl cursor-help hover:scale-110 transition-transform"
                  >
                    {badge.icon}
                  </motion.div>
                ))}
                {Array.from({ length: Math.max(0, 8 - earnedBadges.length) }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-surface-800/50 border border-dashed border-white/5 flex items-center justify-center text-surface-700 text-xs">
                    ?
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl glass border border-white/8"
            >
              <h3 className="font-bold text-sm text-surface-400 uppercase tracking-wider mb-4">{t('dashboard.leaderboard')}</h3>
              <div className="space-y-2.5">
                {leaderboard.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-xl transition-colors',
                      entry.isCurrentUser ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-white/3'
                    )}
                  >
                    <span className={cn(
                      'text-xs font-bold w-5 text-center',
                      i === 0 ? 'text-amber-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-amber-700' : 'text-surface-500'
                    )}>
                      {entry.rank}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-surface-700 flex items-center justify-center text-xs font-bold">
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <div className={cn('text-xs font-medium', entry.isCurrentUser && 'text-brand-300')}>
                        {entry.name}
                      </div>
                      <div className="text-xs text-surface-500">{entry.xp.toLocaleString()} XP</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Flame size={10} /> {entry.streak}
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
