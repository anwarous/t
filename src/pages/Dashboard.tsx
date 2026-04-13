import { Link } from 'react-router-dom'
import { type ReactNode, useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {
  ArrowRight,
  Clock,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useUserStore } from '@/store'
import { MOCK_COURSES, MOCK_EXERCISES, RECENT_ACTIVITY } from '@/data/mockData'
import { courseApi, exerciseApi, leaderboardApi, progressApi, userApi } from '@/lib/api'
import { cn, getDifficultyBg } from '@/lib/utils'
import type { Course, Exercise } from '@/data/mockData'

const WEEK_ACTIVITY = [
  { day: 'Mon', value: 34 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 46 },
  { day: 'Thu', value: 68 },
  { day: 'Fri', value: 84 },
  { day: 'Sat', value: 58 },
  { day: 'Sun', value: 72 },
]

function MetricLine({ label, value, muted = false }: { label: string; value: ReactNode; muted?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/6 px-3 py-3 space-y-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{label}</div>
      <div
        className={cn('text-sm sm:text-base font-medium')}
        style={{
          color: muted ? 'var(--color-text-mid)' : 'var(--color-text)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  )
}

const DASHBOARD_CARACTERS = [
  {
    id: 'pet-caracter',
    lottieSrc: 'https://lottie.host/c62b0afb-22ca-48be-974f-b061e671f5a2/P4fNzo7YQL.lottie',
    nameKey: 'collection.pets.caracter.name',
  },
  {
    id: 'pet-caracter-2',
    lottieSrc: 'https://lottie.host/d5f5b742-750a-43b8-a339-6e80059a344b/UfFf4hIllR.lottie',
    nameKey: 'collection.pets.caracter2.name',
  },
  {
    id: 'pet-caracter-3',
    lottieSrc: 'https://lottie.host/bdcdb140-851b-4545-b69b-ea076668764c/2Nekh5M3Sr.lottie',
    nameKey: 'collection.pets.caracter3.name',
  },
  {
    id: 'pet-caracter-4',
    lottieSrc: 'https://lottie.host/7ad5bf32-c32a-4b64-837d-70a668bd7d7b/6a7DoBKL93.lottie',
    nameKey: 'collection.pets.caracter4.name',
  },
  {
    id: 'pet-caracter-5',
    lottieSrc: 'https://lottie.host/7456a036-cd8a-498f-80d0-1874467ec611/Mrs62RRPcC.lottie',
    nameKey: 'collection.pets.caracter5.name',
  },
  {
    id: 'pet-fox',
    icon: '🦊',
    nameKey: 'collection.pets.fox.name',
  },
  {
    id: 'pet-owl',
    icon: '🦉',
    nameKey: 'collection.pets.owl.name',
  },
  {
    id: 'pet-dragon',
    icon: '🐉',
    nameKey: 'collection.pets.dragon.name',
  },
  {
    id: 'pet-phoenix',
    icon: '🔥',
    nameKey: 'collection.pets.phoenix.name',
  },
] as const

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="ascii-empty">{`[ ${title.toUpperCase()} ]\n   .--.\n  / _.-'\n  \  '-.\n   '--'`}</div>
      <p className="mt-3 text-sm" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>{body}</p>
    </div>
  )
}

type RecentActivityItem = {
  id: string
  action: string
  target: string
  xp: number
  time: string
  icon: string
}

function formatRelativeTime(input?: string) {
  if (!input) return 'just now'
  const date = new Date(input)
  const diffMs = Date.now() - date.getTime()
  if (Number.isNaN(diffMs) || diffMs < 0) return 'just now'

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'just now'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} h ago`
  return `${Math.floor(diffMs / day)} d ago`
}

function normalizeCourseDifficulty(value: string) {
  // Keep return type aligned with Course['difficulty'] union.
  const upper = value.toUpperCase()
  if (upper === 'EASY') return 'Beginner'
  if (upper === 'MEDIUM') return 'Intermediate'
  if (upper === 'HARD') return 'Advanced'
  return 'Intermediate'
}

function normalizeExerciseDifficulty(value: string) {
  // Keep return type aligned with Exercise['difficulty'] union.
  const upper = value.toUpperCase()
  if (upper === 'EASY') return 'Easy'
  if (upper === 'MEDIUM') return 'Medium'
  if (upper === 'HARD') return 'Hard'
  return 'Medium'
}

function ActivityBars({ weeklyActivity, recentActivity }: { weeklyActivity: Array<{ day: string; value: number }>; recentActivity: RecentActivityItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl px-5 py-5 sm:px-6 sm:py-6" style={{ background: 'rgba(255,255,255,0.025)', boxShadow: '8px 8px 0 rgba(0,0,0,0.22)' }}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Progress / Activity</div>
            <h2 className="mt-2 text-xl sm:text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}>Your best week was March.</h2>
          </div>
          <div className="rounded-2xl border border-white/6 px-3 py-2 text-[11px]" style={{ color: 'var(--color-text-mid)', background: 'rgba(255,255,255,0.02)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Last updated {recentActivity[0]?.time ?? 'just now'}
          </div>
        </div>
        <div className="flex h-40 items-end gap-2 sm:gap-3">
          {weeklyActivity.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div className="w-full rounded-t-md border border-white/8 bg-white/[0.03]" style={{ height: `${item.value}%`, boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)' }}>
                  <div className="h-full w-full rounded-t-md" style={{ background: 'var(--color-accent)' }} />
                </div>
              </div>
              <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{item.day}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-lg text-sm" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
          You study hardest in short evening bursts. Friday spikes usually turn into a strong weekend streak.
        </p>
      </div>

      <div className="rounded-3xl px-5 py-5 sm:px-6 sm:py-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>{item.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span style={{ color: 'var(--color-text-mid)' }}>{item.action} </span>
                  {item.target}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{item.time}</div>
              </div>
              {item.xp > 0 && <div className="text-[11px]" style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}>+{item.xp}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CourseLeadCard({ course }: { course: Course }) {
  const { t } = useTranslation()

  return (
    <div className="group rounded-3xl border border-white/8 px-5 py-5 sm:px-6 sm:py-6" style={{ background: 'rgba(255,255,255,0.025)', boxShadow: '8px 8px 0 rgba(0,0,0,0.22)' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Continue learning</div>
          <h3 className="mt-2 text-2xl sm:text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.04em' }}>{course.title}</h3>
        </div>
        <div className="rounded-xl border border-white/8 px-3 py-2 text-right" style={{ transform: 'rotate(-3deg)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Progress</div>
          <div className="text-2xl" style={{ color: 'var(--color-accent)', fontFamily: 'Space Grotesk, sans-serif' }}>{course.progress}%</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full border px-2.5 py-1 text-[11px]', getDifficultyBg(course.difficulty))}>{course.difficulty}</span>
        <span className="rounded-full border border-white/8 px-2.5 py-1 text-[11px]" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
          <Clock size={10} className="inline-block" /> {course.duration}
        </span>
        <span className="rounded-full border border-white/8 px-2.5 py-1 text-[11px]" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
          {course.completedLessons}/{course.totalLessons} lessons
        </span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: 'var(--color-accent)' }} />
      </div>

      <p className="mt-4 max-w-xl text-sm leading-6" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
        {t('dashboard.progress', { pct: course.progress })}. {t('dashboard.continueBtn')} when you are ready to push the next concept.
      </p>

      <Link
        to={`/learn/course/${course.id}`}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
        style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace', background: 'rgba(255,255,255,0.03)' }}
      >
        {t('dashboard.continueBtn')} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

function MiniChallengeCard({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation()

  return (
    <div className="group rounded-3xl border border-white/8 px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Next challenge</div>
      <h3 className="mt-2 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}>{exercise.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <span className={cn('rounded-full border px-2.5 py-1 text-[11px]', getDifficultyBg(exercise.difficulty))}>{exercise.difficulty}</span>
        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{exercise.category}</span>
      </div>
      <p className="mt-4 text-sm leading-6" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
        {exercise.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm" style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}>+{exercise.xp} XP</div>
        <Link
          to={`/editor?exercise=${exercise.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace', background: 'rgba(255,255,255,0.03)' }}
        >
          {t('dashboard.solve')} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

function BadgeStripCard({ count }: { count: number }) {
  const { t } = useTranslation()

  return (
    <div className="group rounded-3xl border border-white/8 px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{t('profile.badges.title')}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[Trophy, Star, Sparkles].map((Icon, index) => (
            <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03]" style={{ transform: `rotate(${index % 2 === 0 ? -4 : 3}deg)` }}>
              <Icon size={14} style={{ color: index === 0 ? 'var(--color-accent)' : index === 1 ? 'var(--color-xp)' : 'var(--color-text)' }} />
            </div>
          ))}
        </div>
        <div>
          <div className="text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{count} earned</div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Unlock more by finishing lessons and streaks.</div>
        </div>
      </div>
      <Link
        to="/profile?tab=badges"
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
        style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace', background: 'rgba(255,255,255,0.03)' }}
      >
        {t('dashboard.viewAll')} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, badges, hydrateStatsFromBackend } = useUserStore()
  const [selectedCaracterId] = useLocalStorage<string | null>(`collection:selected-caracter:${user.name}`, null)
  const [allTimeHighStreak, setAllTimeHighStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return user.streak
    const raw = window.localStorage.getItem(`dashboard:high-streak:${user.name}`)
    const parsed = raw ? Number(raw) : Number.NaN
    if (Number.isFinite(parsed)) return Math.max(parsed, user.streak)
    return user.streak
  })
  const [profileUser, setProfileUser] = useState(user)
  const [earnedBadgeCount, setEarnedBadgeCount] = useState(badges.filter((badge) => badge.earned).length)
  const [weeklyActivity, setWeeklyActivity] = useState(WEEK_ACTIVITY)
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    RECENT_ACTIVITY.slice(0, 5).map((item) => ({ ...item, id: String(item.id) }))
  )
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES)
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>(
    MOCK_EXERCISES.filter((exercise) => !exercise.completed).slice(0, 2)
  )
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; name: string; xp: number; level: number; streak: number; avatar: string; isCurrentUser: boolean; delta?: number }>>([])
  const inProgress = courses.filter((course) => course.progress > 0 && course.progress < 100)
  const recommended = recommendedExercises

  useEffect(() => {
    let active = true

    Promise.allSettled([
      leaderboardApi.list(),
      userApi.me(),
      userApi.myBadges(),
      userApi.mySubmissions(),
      progressApi.list(),
      courseApi.list(),
      exerciseApi.list(),
    ]).then((results) => {
      if (!active) return

      const [leaderboardResult, userResult, badgesResult, submissionsResult, progressResult, coursesResult, exercisesResult] = results

      if (leaderboardResult.status === 'fulfilled') {
        setLeaderboard(
          leaderboardResult.value.map((entry, index) => ({
            rank: entry.position || index + 1,
            name: entry.displayName?.trim() || entry.username,
            xp: entry.xp,
            level: entry.level,
            streak: entry.streak,
            avatar: entry.avatarInitials?.trim() || '??',
            isCurrentUser: (entry.displayName?.trim() || entry.username).toLowerCase() === user.name.trim().toLowerCase(),
            delta: (entry.displayName?.trim() || entry.username).toLowerCase() === user.name.trim().toLowerCase() ? 2 : index === 1 ? -1 : index === 3 ? 1 : 0,
          }))
        )
      }

      if (userResult.status === 'fulfilled') {
        hydrateStatsFromBackend({
          xp: userResult.value.xp,
          level: userResult.value.level,
          streak: userResult.value.streak,
          totalSolved: userResult.value.totalSolved,
          rank: userResult.value.rank,
        })
        setProfileUser((prev) => ({
          ...prev,
          name: userResult.value.displayName || prev.name,
          xp: userResult.value.xp,
          level: userResult.value.level,
          streak: userResult.value.streak,
          totalSolved: userResult.value.totalSolved,
          rank: userResult.value.rank,
          joinedAt: userResult.value.createdAt,
        }))
      }

      if (badgesResult.status === 'fulfilled') {
        setEarnedBadgeCount(badgesResult.value.filter((badge) => Boolean(badge.earnedAt)).length)
      }

      const submissions = submissionsResult.status === 'fulfilled' ? submissionsResult.value : []
      const progress = progressResult.status === 'fulfilled' ? progressResult.value : []

      if (submissions.length > 0 || progress.length > 0) {
        const submissionActivity: Array<RecentActivityItem & { at: number }> = submissions.map((submission) => ({
          id: `sub-${submission.id}`,
          action: submission.passed ? 'Solved' : 'Attempted',
          target: submission.exerciseTitle,
          xp: submission.xpEarned,
          time: formatRelativeTime(submission.submittedAt),
          icon: submission.passed ? '⚡' : '•',
          at: new Date(submission.submittedAt).getTime() || 0,
        }))

        const progressActivity: Array<RecentActivityItem & { at: number }> = progress
          .filter((p) => Boolean(p.lastActivityAt))
          .map((entry) => ({
            id: `prog-${entry.courseSlug}`,
            action: entry.completedLessons >= entry.totalLessons ? 'Completed' : 'Progressed',
            target: entry.courseTitle,
            xp: 0,
            time: formatRelativeTime(entry.lastActivityAt),
            icon: '↗',
            at: new Date(entry.lastActivityAt as string).getTime() || 0,
          }))

        const merged = [...submissionActivity, ...progressActivity]
          .sort((a, b) => b.at - a.at)
          .slice(0, 5)
          .map(({ at, ...item }) => item)

        if (merged.length > 0) {
          setRecentActivity(merged)
        }
      }

      if (submissions.length > 0) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const now = Date.now()
        const counts = new Map<string, number>(days.map((day) => [day, 0]))

        submissions.forEach((submission) => {
          const timestamp = new Date(submission.submittedAt).getTime()
          if (!timestamp || now - timestamp > 7 * 24 * 60 * 60 * 1000) return
          const dayIndex = new Date(timestamp).getDay()
          const key = days[(dayIndex + 6) % 7]
          counts.set(key, (counts.get(key) || 0) + 1)
        })

        const max = Math.max(...Array.from(counts.values()), 1)
        setWeeklyActivity(days.map((day) => ({ day, value: Math.round(((counts.get(day) || 0) / max) * 100) })))
      }

      if (coursesResult.status === 'fulfilled') {
        const progressBySlug = new Map(progress.map((entry) => [entry.courseSlug, entry]))
        const mappedCourses: Course[] = coursesResult.value.map((course) => {
          const itemProgress = progressBySlug.get(course.slug)
          const progressValue = itemProgress?.progressPercent ?? 0

          return {
            id: course.slug,
            title: course.title,
            description: course.description,
            difficulty: normalizeCourseDifficulty(course.difficulty),
            duration: `${course.durationMinutes} min`,
            category: course.category || 'General',
            progress: progressValue,
            totalLessons: course.totalLessons,
            completedLessons: itemProgress?.completedLessons ?? 0,
            xpReward: course.xpReward,
            color: course.colorHex || 'var(--color-accent)',
            icon: course.icon || '•',
            tags: (course.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
            chapters: [],
          }
        })

        if (mappedCourses.length > 0) {
          setCourses(mappedCourses)
        }
      }

      if (exercisesResult.status === 'fulfilled') {
        const mappedExercises: Exercise[] = exercisesResult.value.map((exercise) => ({
          id: exercise.slug,
          title: exercise.title,
          description: exercise.description,
          difficulty: normalizeExerciseDifficulty(exercise.difficulty),
          category: exercise.category,
          xp: exercise.xpReward,
          completed: false,
          attempts: 0,
          starterCode: '',
          solution: '',
        }))

        if (mappedExercises.length > 0) {
          setRecommendedExercises(mappedExercises.slice(0, 2))
        }
      }
    })

    return () => {
      active = false
    }
  }, [user.name, hydrateStatsFromBackend])

  useEffect(() => {
    setAllTimeHighStreak((prev) => {
      const next = Math.max(prev, profileUser.streak)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`dashboard:high-streak:${user.name}`, String(next))
      }
      return next
    })
  }, [profileUser.streak, user.name])

  const primaryCourse = inProgress[0] ?? courses[0] ?? MOCK_COURSES[0]
  const primaryExercise = recommended[0] ?? MOCK_EXERCISES[0]
  const myEntry = leaderboard.find((entry) => entry.isCurrentUser)
  const myRank = myEntry?.rank ?? '-'
  const selectedCaracter = DASHBOARD_CARACTERS.find((item) => item.id === selectedCaracterId)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.rank - b.rank)
  const myIndex = sortedLeaderboard.findIndex((entry) => entry.isCurrentUser)
  const entryAbove = myIndex > 0 ? sortedLeaderboard[myIndex - 1] : null
  const gapToAboveXp = entryAbove && myEntry ? Math.max(0, entryAbove.xp - myEntry.xp) : 0

  const xpToNext = 60
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mx-auto max-w-[1120px] space-y-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] items-stretch">
          <div className="space-y-5 h-full">
            <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('dashboard.goodMorning')} • {profileUser.joinedAt}
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{t('dashboard.levelXp')}</div>
                <div className="mt-2 px-1 py-1 sm:px-2 sm:py-2">
                  {selectedCaracter ? (
                    <div className="rounded-2xl border border-emerald-400/45 px-4 py-3 sm:px-5 sm:py-4" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.08) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 24px rgba(0,0,0,0.25)' }}>
                      <div className="text-[11px] uppercase tracking-[0.08em] text-center" style={{ color: 'rgba(220,255,239,0.92)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        Selected caracter
                      </div>
                      {selectedCaracter.lottieSrc ? (
                        <div className="h-[18rem] w-[18rem] sm:h-[24rem] sm:w-[24rem] mx-auto bg-transparent" style={{ background: 'transparent', filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.38))' }}>
                          <DotLottieReact
                            src={selectedCaracter.lottieSrc}
                            autoplay
                            loop
                            style={{ width: '100%', height: '100%', background: 'transparent' }}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-6xl sm:text-7xl" style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))' }}>{selectedCaracter.icon}</div>
                      )}
                      <div className="mt-2 text-center text-base sm:text-lg" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 1px 0 rgba(0,0,0,0.28)' }}>
                        {t(selectedCaracter.nameKey)}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/8 px-4 py-3 sm:px-5 sm:py-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="text-sm sm:text-base" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {profileUser.xp.toLocaleString()} XP
                      </div>
                      <div className="text-[11px] mt-1" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {Math.max(0, xpToNext - (profileUser.xp % xpToNext))} XP to next checkpoint
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="max-w-2xl text-[14.5px] leading-7" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('dashboard.subGreeting', { streak: profileUser.streak })} Your focus is built on short sessions, fast feedback, and visible progress.
            </p>
          </div>

          <div className="grid h-full gap-3 content-start rounded-3xl border border-white/8 px-5 py-5 sm:px-6 sm:py-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <MetricLine label={t('dashboard.level', { level: profileUser.level })} value={profileUser.rank} />
            <MetricLine
              label="Current streak"
              value={
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span>{`${profileUser.streak} days`}</span>
                  {profileUser.streak > 0 && (
                    <span className="h-5 w-5 overflow-hidden rounded-full shrink-0" aria-hidden>
                      <DotLottieReact
                        src="https://lottie.host/6cfd2eb0-4e8e-45fd-8566-b1c3dd0f02b4/kAtpzRfxyK.lottie"
                        autoplay
                        loop
                      />
                    </span>
                  )}
                </span>
              }
            />
            <MetricLine label="XP to next" value={`${Math.max(0, xpToNext - (profileUser.xp % xpToNext))}`} muted />
            <MetricLine label="All-time high streak" value={`${allTimeHighStreak} days`} />
            <MetricLine label="Gap to player above" value={entryAbove ? `${gapToAboveXp} XP` : 'Top position'} muted />
            <MetricLine label="Exercises solved" value={`${profileUser.totalSolved}`} />
          </div>
        </section>

        <section>
          <ActivityBars weeklyActivity={weeklyActivity} recentActivity={recentActivity} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] items-stretch">
          {inProgress.length > 0 ? <CourseLeadCard course={primaryCourse} /> : <EmptyState title="courses" body="Your course queue is empty. Start one course to bring this section to life." />}
          <div className="space-y-5 h-full">
            {recommended.length > 0 ? <MiniChallengeCard exercise={primaryExercise} /> : <EmptyState title="challenge" body="No exercises are waiting yet. Pick one when you want a quick win." />}
            <BadgeStripCard count={earnedBadgeCount} />
          </div>
        </section>

        <section className="grid gap-4 items-stretch">
          <div className="h-full rounded-3xl border border-white/8 px-5 py-5 sm:px-6 sm:py-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>Leaderboard</div>
                <div className="mt-1 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}>You are currently #{myRank}</div>
              </div>
              <Link to="/profile" className="text-sm" style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}>View profile</Link>
            </div>
            <div className="mt-4 space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.rank} className="flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3" style={{ background: entry.isCurrentUser ? 'rgba(109,255,26,0.05)' : 'rgba(255,255,255,0.02)' }}>
                  <div className="w-6 text-center text-[12px] font-semibold" style={{ color: index === 0 ? 'var(--color-accent)' : 'var(--color-text-mid)', fontFamily: 'Space Grotesk, sans-serif' }}>{entry.rank}</div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>{entry.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm" style={{ color: entry.isCurrentUser ? 'var(--color-text)' : 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>{entry.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{entry.xp.toLocaleString()} XP</div>
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--color-xp)', fontFamily: 'IBM Plex Mono, monospace' }}>{entry.streak}d</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
