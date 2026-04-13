import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Compass, Layers3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { courseApi, progressApi, type CourseDetailDto, type ProgressDto } from '@/lib/api'
import { cn, getDifficultyBg } from '@/lib/utils'

type LearnView = 'hub' | 'roadmap-list' | 'roadmap-detail' | 'course-list' | 'course-detail'

type CourseCard = {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  progress: number
}

type RoadmapPack = {
  id: string
  title: string
  description: string
  courseIds: string[]
  topics?: string[]
  topicGroups?: Array<{ title: string; topics: string[] }>
}

type RoadmapNode = {
  id: string
  topic: string
  groupTitle: string
  groupIndex: number
  topicIndex: number
}

const ROADMAP_PACKS: RoadmapPack[] = [
  {
    id: 'bac-info-algorithm',
    title: 'Algorithm Tunisie',
    description: 'Core algorithm roadmap for Tunisia bac info preparation.',
    courseIds: [],
    topicGroups: [
      { title: 'Basics', topics: ['Introduction to algorithm', 'datatype', 'condition ( if else )', 'loop', 'function'] },
      { title: 'Data Handling', topics: ['table', 'string', 'fonction predefinie', 'matrix', 'files', 'enregistrement'] },
      { title: 'Problem Solving', topics: ['how to solve a problem', 'trie', 'approximation', 'integral'] },
    ],
    topics: [
      'Introduction to algorithm',
      'datatype',
      'condition ( if else )',
      'loop',
      'function',
      'table',
      'string',
      'fonction predefinie',
      'matrix',
      'files',
      'enregistrement',
      'how to solve a problem',
      'trie',
      'approximation',
      'integral',
    ],
  },
]

function mapDifficulty(input: string): CourseCard['difficulty'] {
  const value = input.toUpperCase()
  if (value === 'BEGINNER') return 'Beginner'
  if (value === 'INTERMEDIATE') return 'Intermediate'
  return 'Advanced'
}

function useCatalog() {
  const [courses, setCourses] = useState<CourseCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.allSettled([courseApi.list(), progressApi.list()])
      .then(([coursesRes, progressRes]) => {
        if (!active) return
        if (coursesRes.status !== 'fulfilled') throw new Error('Failed to load courses')

        const progressBySlug = new Map<string, ProgressDto>()
        if (progressRes.status === 'fulfilled') {
          for (const progress of progressRes.value) progressBySlug.set(progress.courseSlug, progress)
        }

        setCourses(
          coursesRes.value.map((dto) => ({
            id: dto.slug,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            difficulty: mapDifficulty(dto.difficulty),
            progress: progressBySlug.get(dto.slug)?.progressPercent ?? 0,
          }))
        )
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

  return { courses, loading, error }
}

function RoadmapGraph({
  pack,
  completedTopics,
  onToggleTopic,
}: {
  pack: RoadmapPack
  completedTopics: Record<string, boolean>
  onToggleTopic: (topic: string) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement | null>())
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [paths, setPaths] = useState<Array<{ id: string; d: string; completed: boolean }>>([])

  const nodes = useMemo<RoadmapNode[]>(() => {
    const groups = pack.topicGroups ?? [{ title: 'Roadmap', topics: pack.topics ?? [] }]
    return groups.flatMap((group, groupIndex) =>
      group.topics.map((topic, topicIndex) => ({
        id: `${groupIndex}:${topicIndex}:${topic}`,
        topic,
        groupTitle: group.title,
        groupIndex,
        topicIndex,
      }))
    )
  }, [pack])

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      setCanvasSize({ width: rect.width, height: rect.height })

      const points = nodes
        .map((node) => {
          const el = nodeRefs.current.get(node.id)
          if (!el) return null
          const box = el.getBoundingClientRect()
          return {
            id: node.id,
            x: box.left - rect.left + box.width / 2,
            y: box.top - rect.top + box.height / 2,
            completed: Boolean(completedTopics[node.topic]),
          }
        })
        .filter(Boolean) as Array<{ id: string; x: number; y: number; completed: boolean }>

      setPaths(
        points.slice(1).map((point, index) => {
          const previous = points[index]
          const midX = (previous.x + point.x) / 2
          return {
            id: `${previous.id}->${point.id}`,
            completed: previous.completed && point.completed,
            d: `M ${previous.x} ${previous.y} C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`,
          }
        })
      )
    }

    update()
    const resizeObserver = typeof ResizeObserver !== 'undefined' && containerRef.current ? new ResizeObserver(update) : null
    if (resizeObserver && containerRef.current) resizeObserver.observe(containerRef.current)
    window.addEventListener('resize', update)
    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [completedTopics, nodes])

  const completedCount = nodes.filter((node) => completedTopics[node.topic]).length

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-950 via-surface-900/90 to-brand-950/20 p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-6 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Roadmap Graph</h2>
          <p className="text-sm text-surface-400">A node map of the algorithm path.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-surface-400">
          {completedCount}/{nodes.length} completed
        </span>
      </div>

      <div className="relative">
        {canvasSize.width > 0 && canvasSize.height > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" width={canvasSize.width} height={canvasSize.height} viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`} fill="none" aria-hidden="true">
            <defs>
              <marker id="roadmap-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L8,4 z" fill="currentColor" />
              </marker>
            </defs>
            {paths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                stroke={path.completed ? 'rgba(16, 185, 129, 0.85)' : 'rgba(96, 165, 250, 0.35)'}
                strokeWidth={path.completed ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={path.completed ? undefined : '7 9'}
                markerEnd="url(#roadmap-arrow)"
              />
            ))}
          </svg>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => {
            const isDone = Boolean(completedTopics[node.topic])
            return (
              <button
                key={node.id}
                ref={(element) => {
                  nodeRefs.current.set(node.id, element)
                }}
                type="button"
                aria-pressed={isDone}
                onClick={() => onToggleTopic(node.topic)}
                className={cn(
                  'relative z-10 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5',
                  'bg-surface-950/80 backdrop-blur',
                  isDone
                    ? 'border-emerald-400/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_18px_45px_rgba(16,185,129,0.12)]'
                    : 'border-white/10 hover:border-brand-400/40 hover:shadow-[0_0_0_1px_rgba(96,165,250,0.12),0_18px_45px_rgba(2,6,23,0.45)]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold', isDone ? 'border-emerald-300/60 bg-emerald-400/20 text-emerald-100' : 'border-brand-400/40 bg-brand-500/10 text-brand-200')}>
                    {node.groupIndex + 1}.{node.topicIndex + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-surface-500">{node.groupTitle}</span>
                      <CheckCircle2 size={15} className={isDone ? 'text-emerald-300' : 'text-surface-600'} />
                    </div>
                    <p className={cn('text-sm font-medium leading-5', isDone ? 'text-emerald-50' : 'text-surface-100')}>{node.topic}</p>
                    <p className="mt-2 text-xs text-surface-500">{isDone ? 'Completed' : 'Click to mark as complete'}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LearnHub() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="mb-2 text-3xl font-display font-bold">{t('learn.entryTitle')}</h1>
        <p className="mb-8 text-surface-400">{t('learn.entrySubtitle')}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/learn/roadmap" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
            <div className="mb-3 flex items-center gap-3">
              <Compass size={18} className="text-brand-400" />
              <h2 className="text-xl font-semibold">{t('learn.roadmapChoiceTitle')}</h2>
            </div>
            <p className="mb-3 text-surface-400">{t('learn.roadmapChoiceDesc')}</p>
            <span className="inline-flex items-center gap-2 text-brand-400">{t('learn.openRoadmap')} <ArrowRight size={14} /></span>
          </Link>

          <Link to="/learn/course" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
            <div className="mb-3 flex items-center gap-3">
              <Layers3 size={18} className="text-brand-400" />
              <h2 className="text-xl font-semibold">{t('learn.courseChoiceTitle')}</h2>
            </div>
            <p className="mb-3 text-surface-400">{t('learn.courseChoiceDesc')}</p>
            <span className="inline-flex items-center gap-2 text-brand-400">{t('learn.courseTitle')} <ArrowRight size={14} /></span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function RoadmapList() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1120px]">
        <Link to="/learn" className="mb-6 inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white">
          <ArrowLeft size={14} /> {t('learn.backToLearn')}
        </Link>

        <h1 className="mb-2 text-3xl font-display font-bold">{t('learn.roadmapTitle')}</h1>
        <p className="mb-8 text-surface-400">{t('learn.roadmapSubtitle')}</p>

        <div className="grid gap-5 md:grid-cols-3">
          {ROADMAP_PACKS.map((pack) => (
            <Link key={pack.id} to={`/learn/roadmap/${pack.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
              <h2 className="mb-2 text-lg font-semibold">{pack.title}</h2>
              <p className="mb-4 text-sm text-surface-400">{pack.description}</p>
              <span className="inline-flex items-center gap-2 text-brand-400">{t('learn.openRoadmap')} <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoadmapDetail({ packId }: { packId: string }) {
  const { t } = useTranslation()
  const { courses, loading, error } = useCatalog()
  const pack = ROADMAP_PACKS.find((item) => item.id === packId)
  const completionKey = `roadmap:progress:${packId}`
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const raw = window.localStorage.getItem(completionKey)
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(completionKey, JSON.stringify(completedTopics))
    } catch {
      // ignore storage issues
    }
  }, [completionKey, completedTopics])

  if (!pack) return <div className="p-10 text-center text-surface-300">{t('learn.packNotFound')}</div>

  const allTopics = pack.topics ?? pack.topicGroups?.flatMap((group) => group.topics) ?? []
  const included = useMemo(() => {
    const byId = new Map(courses.map((course) => [course.id, course]))
    return pack.courseIds.map((id) => byId.get(id)).filter(Boolean) as CourseCard[]
  }, [courses, pack])

  const toggleTopic = (topic: string) => {
    setCompletedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }))
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1120px]">
        <Link to="/learn/roadmap" className="mb-6 inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white">
          <ArrowLeft size={14} /> {t('learn.backToRoadmaps')}
        </Link>

        <h1 className="mb-2 text-3xl font-display font-bold">{pack.title}</h1>
        <p className="mb-8 text-surface-400">{pack.description}</p>

        {!!allTopics.length && (
          <div className="mb-8">
            <RoadmapGraph pack={pack} completedTopics={completedTopics} onToggleTopic={toggleTopic} />
          </div>
        )}

        {loading && <p className="text-surface-400">{t('common.loading')}</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2">
            {included.map((course) => (
              <Link key={course.id} to={`/learn/course/${course.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
                <div className="font-semibold">{course.title}</div>
                <div className="text-sm text-surface-400">{course.category}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseList() {
  const { t } = useTranslation()
  const { courses, loading, error } = useCatalog()

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1120px]">
        <Link to="/learn" className="mb-6 inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white">
          <ArrowLeft size={14} /> {t('learn.backToLearn')}
        </Link>

        <h1 className="mb-2 text-3xl font-display font-bold">{t('learn.courseTitle')}</h1>
        <p className="mb-8 text-surface-400">{t('learn.courseSubtitle')}</p>

        {loading && <p className="text-surface-400">{t('common.loading')}</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2">
            {courses.map((course) => (
              <Link key={course.id} to={`/learn/course/${course.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <span className={cn('tag border text-xs', getDifficultyBg(course.difficulty))}>{t(`learn.difficulty.${course.difficulty}`)}</span>
                </div>
                <p className="mb-3 text-sm text-surface-400">{course.description}</p>
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <BookOpen size={12} /> {course.category} • {course.progress}%
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseDetail({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const [course, setCourse] = useState<CourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    courseApi
      .getBySlug(courseId)
      .then((data) => {
        if (!active) return
        setCourse(data)
      })
      .catch((err: unknown) => {
        if (!active) return
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

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1120px]">
        <Link to="/learn/course" className="mb-6 inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white">
          <ArrowLeft size={14} /> {t('learn.backToCourses')}
        </Link>

        {loading && <p className="text-surface-400">{t('common.loading')}</p>}
        {error && <p className="text-red-300">{error}</p>}

        {course && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h1 className="mb-2 text-3xl font-display font-bold">{course.title}</h1>
            <p className="mb-5 text-surface-400">{course.description}</p>
            <div className="mb-6 space-y-2">
              {course.chapters.map((chapter, index) => (
                <div key={`${chapter}-${index}`} className="text-sm text-surface-300">
                  {index + 1}. {chapter}
                </div>
              ))}
            </div>
            <Link to="/editor" className="btn-primary">
              {t('learn.continue')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LearnPage({ view = 'hub' }: { view?: LearnView }) {
  const { packId, courseId } = useParams<{ packId?: string; courseId?: string }>()

  if (view === 'roadmap-list') return <RoadmapList />
  if (view === 'roadmap-detail' && packId) return <RoadmapDetail packId={packId} />
  if (view === 'course-list') return <CourseList />
  if (view === 'course-detail' && courseId) return <CourseDetail courseId={courseId} />

  return <LearnHub />
}
