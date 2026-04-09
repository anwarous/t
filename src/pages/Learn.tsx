import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, ChevronRight, Play, CheckCircle2,
  Lock, Video, FileText, Code2, HelpCircle, Zap,
  ArrowLeft, Star, Users, BarChart2
} from 'lucide-react'
import { courseApi, type CourseDetailDto, type CourseSummaryDto } from '@/lib/api'
import type { Course, Lesson } from '@/data/mockData'
import { cn, getDifficultyBg } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const LESSON_TYPE_ICONS = {
  video: Video,
  reading: FileText,
  practice: Code2,
  quiz: HelpCircle,
}

const LESSON_TYPE_COLORS = {
  video: 'text-brand-400',
  reading: 'text-emerald-400',
  practice: 'text-amber-400',
  quiz: 'text-purple-400',
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function mapDifficulty(input: string): Course['difficulty'] {
  const normalized = input.toUpperCase()
  if (normalized === 'BEGINNER') return 'Beginner'
  if (normalized === 'INTERMEDIATE') return 'Intermediate'
  return 'Advanced'
}

function mapIcon(input: string): string {
  const key = input.toLowerCase()
  const iconMap: Record<string, string> = {
    array: '↕',
    search: '◈',
    dp: '⟳',
  }
  return iconMap[key] ?? '◳'
}

function splitTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function chapterLinesToLessons(lines: string[]): Course['chapters'] {
  return lines.map((title, i) => ({
    id: `ch-${i + 1}`,
    title,
    lessons: [
      {
        id: `lesson-${i + 1}`,
        title,
        type: 'reading',
        duration: '10m',
        completed: false,
        locked: i > 0,
        xp: 20,
      },
    ],
  }))
}

function mapCourseSummary(dto: CourseSummaryDto): Course {
  return {
    id: dto.slug,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    difficulty: mapDifficulty(dto.difficulty),
    progress: 0,
    totalLessons: dto.totalLessons,
    completedLessons: 0,
    duration: formatDuration(dto.durationMinutes),
    xpReward: dto.xpReward,
    color: dto.colorHex,
    icon: mapIcon(dto.icon),
    tags: splitTags(dto.tags),
    chapters: [],
  }
}

function mapCourseDetail(dto: CourseDetailDto): Course {
  const base = mapCourseSummary(dto)
  return {
    ...base,
    chapters: chapterLinesToLessons(dto.chapters),
  }
}

function LessonRow({ lesson, courseId }: { lesson: Lesson; courseId: string }) {
  const Icon = LESSON_TYPE_ICONS[lesson.type]
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-4 p-3.5 rounded-xl transition-all group',
        lesson.locked
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-white/4 cursor-pointer'
      )}
    >
      {/* Status */}
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
        {lesson.locked ? (
          <Lock size={15} className="text-surface-600" />
        ) : lesson.completed ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-surface-600 group-hover:border-brand-500 transition-colors" />
        )}
      </div>

      {/* Type icon */}
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        'bg-surface-800 border border-white/5'
      )}>
        <Icon size={15} className={LESSON_TYPE_COLORS[lesson.type]} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          'text-sm font-medium',
          lesson.completed ? 'text-surface-400 line-through' : 'text-surface-200'
        )}>
          {lesson.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-surface-500 capitalize">{t(`learn.${lesson.type}`)}</span>
          <span className="text-surface-700">·</span>
          <span className="text-xs text-surface-500 flex items-center gap-1">
            <Clock size={10} />
            {lesson.duration}
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1 text-xs text-brand-400 font-semibold flex-shrink-0">
        <Zap size={11} />
        +{lesson.xp}
      </div>

      {/* Arrow on hover */}
      {!lesson.locked && (
        <ChevronRight
          size={15}
          className="text-surface-600 group-hover:text-surface-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        />
      )}
    </motion.div>
  )
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/learn/${course.id}`}
        className="block p-6 rounded-2xl glass border border-white/8 hover:border-white/15 transition-all group"
      >
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${course.color}20`, border: `1px solid ${course.color}30` }}
          >
            {course.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-white transition-colors">{course.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('tag border text-xs', getDifficultyBg(course.difficulty))}>
                {t(`learn.difficulty.${course.difficulty}`)}
              </span>
              <span className="text-xs text-surface-500">{course.category}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-surface-400 leading-relaxed mb-5">{course.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {course.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-surface-800 border border-white/5 text-xs text-surface-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-surface-500 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {course.totalLessons} {t('learn.lessons', { count: course.totalLessons })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 text-brand-400 font-semibold">
            <Zap size={12} />
            {course.xpReward} XP
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-surface-500 mb-1.5">
            <span>{course.completedLessons}/{course.totalLessons} {t('learn.chapters').toLowerCase()}</span>
            <span>{course.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-surface-500">
            {course.progress === 0 ? t('learn.notStarted') : course.progress === 100 ? `✅ ${t('learn.completed')}` : t('learn.inProgress')}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-brand-400 group-hover:text-brand-300 transition-colors">
            {course.progress === 0 ? t('learn.start') : course.progress === 100 ? t('learn.review') : t('learn.continue')}
            <ChevronRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Course Detail Page ────────────────────────────────────────────────────────

function CourseDetail({ course }: { course: Course }) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(course.chapters[0]?.id ?? null)
  const { t } = useTranslation()

  const totalCompleted = course.chapters.flatMap(c => c.lessons).filter(l => l.completed).length
  const totalLessons = course.chapters.flatMap(c => c.lessons).length

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={15} />
          {t('learn.allCourses')}
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-2xl overflow-hidden mb-8"
          style={{
            background: `linear-gradient(135deg, ${course.color}15 0%, rgba(9,14,31,0.8) 100%)`,
            border: `1px solid ${course.color}25`,
          }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-40 opacity-5 flex items-center justify-center text-[120px]">
            {course.icon}
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${course.color}20`, border: `1px solid ${course.color}30` }}
              >
                {course.icon}
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">{course.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn('tag border text-xs', getDifficultyBg(course.difficulty))}>
                    {t(`learn.difficulty.${course.difficulty}`)}
                  </span>
                  <span className="text-xs text-surface-400">{course.category}</span>
                </div>
              </div>
            </div>
            <p className="text-surface-300 leading-relaxed mb-6 max-w-2xl">{course.description}</p>

            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: BookOpen, val: `${course.totalLessons} ${t('learn.chapters').toLowerCase()}`, color: 'text-surface-400' },
                { icon: Clock, val: course.duration, color: 'text-surface-400' },
                { icon: Zap, val: `${course.xpReward} XP`, color: 'text-brand-400' },
                { icon: Star, val: `4.9 ${t('learn.rating')}`, color: 'text-amber-400' },
                { icon: Users, val: `2.1k ${t('learn.students')}`, color: 'text-surface-400' },
              ].map(({ icon: Icon, val, color }) => (
                <span key={val} className={cn('flex items-center gap-1.5 text-sm', color)}>
                  <Icon size={14} />
                  {val}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chapters */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-brand-400" />
              {t('learn.courseContent')}
            </h2>
            {course.chapters.map((chapter, chIdx) => {
              const chCompleted = chapter.lessons.filter(l => l.completed).length
              const isExpanded = expandedChapter === chapter.id

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: chIdx * 0.08 }}
                  className="rounded-2xl glass border border-white/8 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                        chCompleted === chapter.lessons.length
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-surface-800 text-surface-400'
                      )}>
                        {chCompleted === chapter.lessons.length ? '✓' : chIdx + 1}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{chapter.title}</div>
                        <div className="text-xs text-surface-500 mt-0.5">
                          {chCompleted}/{chapter.lessons.length} {t('learn.completed').toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={17} className="text-surface-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="px-3 py-2">
                          {chapter.lessons.map((lesson) => (
                            <LessonRow key={lesson.id} lesson={lesson} courseId={course.id} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Progress card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl glass border border-white/8 sticky top-20"
            >
              <h3 className="font-bold mb-4">{t('learn.yourProgress')}</h3>

              <div className="relative w-28 h-28 mx-auto mb-5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - course.progress / 100) }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1a5cff" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-bold">{course.progress}%</span>
                  <span className="text-xs text-surface-500">{t('learn.complete')}</span>
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">{t('learn.chapters')}</span>
                  <span>{totalCompleted}/{totalLessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">{t('learn.xpEarned')}</span>
                  <span className="text-brand-400">{Math.round(course.xpReward * course.progress / 100)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">{t('learn.estimated')}</span>
                  <span>{course.duration}</span>
                </div>
              </div>

              <Link
                to="/editor"
                className="btn-primary w-full justify-center"
              >
                <Play size={15} />
                {course.progress === 0 ? t('learn.start') : t('learn.continue')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Courses Listing Page ──────────────────────────────────────────────────────

function CoursesListing() {
  const [filter, setFilter] = useState<string>('All')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const { t } = useTranslation()
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const difficultyLabels: Record<string, string> = {
    All: t('learn.all'),
    Beginner: t('learn.beginner'),
    Intermediate: t('learn.intermediate'),
    Advanced: t('learn.advanced'),
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    courseApi
      .list()
      .then((res) => {
        if (!active) return
        setCourses(res.map(mapCourseSummary))
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Failed to load courses')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    return filter === 'All'
      ? courses
      : courses.filter((c) => c.difficulty === filter)
  }, [filter, courses])

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-surface-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            {t('learn.learningModules').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{t('learn.learningModules').split(' ').slice(-1)}</span>
          </h1>
          <p className="text-surface-400">{t('learn.masterAlgo')}</p>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filter === d
                  ? 'bg-brand-500/15 border border-brand-500/30 text-white'
                  : 'text-surface-400 hover:text-white bg-surface-800/50 border border-white/5 hover:border-white/10'
              )}
            >
              {difficultyLabels[d]}
            </button>
          ))}
          <span className="ml-auto text-sm text-surface-500">{filtered.length} {t('learn.courses')}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Router entry point ────────────────────────────────────────────────────────

export default function LearnPage() {
  const { courseId } = useParams<{ courseId?: string }>()
  const { t } = useTranslation()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!courseId) return

    let active = true
    setLoading(true)
    setError('')

    courseApi
      .getBySlug(courseId)
      .then((res) => {
        if (!active) return
        setCourse(mapCourseDetail(res))
      })
      .catch((err: unknown) => {
        if (!active) return
        setCourse(null)
        setError(err instanceof Error ? err.message : 'Failed to load course')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [courseId])

  if (courseId) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-surface-300">{t('common.loading')}</p>
        </div>
      )
    }

    if (!course) return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold">{t('common.error')}</h2>
        {error && <p className="text-surface-400 text-sm">{error}</p>}
        <Link to="/learn" className="btn-primary">{t('learn.allCourses')}</Link>
      </div>
    )
    return <CourseDetail course={course} />
  }

  return <CoursesListing />
}
