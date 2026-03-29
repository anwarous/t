import { useState, useEffect } from 'react'
import {
  DEMO_MODE,
  coursesApi,
  exercisesApi,
  progressApi,
  leaderboardApi,
  apiCourseToFrontend,
  apiCourseDetailToFrontend,
  apiExerciseToFrontend,
  apiExerciseDetailToFrontend,
} from '@/lib/api'
import {
  MOCK_COURSES,
  MOCK_EXERCISES,
  LEADERBOARD_OTHERS,
  type Course,
  type Exercise,
  type LeaderboardEntry,
} from '@/data/mockData'
import { useUserStore } from '@/store'

export function useCourses(): { courses: Course[]; loading: boolean; error: string | null } {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (DEMO_MODE) {
      setCourses(MOCK_COURSES)
      return
    }
    setLoading(true)
    Promise.all([coursesApi.list(), progressApi.get()])
      .then(([dtos, progressList]) => {
        const progressMap = new Map(progressList.map(p => [p.courseSlug, p]))
        setCourses(dtos.map(dto => apiCourseToFrontend(dto, progressMap.get(dto.slug))))
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  return { courses, loading, error }
}

export function useCourse(slug: string | undefined): { course: Course | null; loading: boolean; error: string | null } {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(!!slug && !DEMO_MODE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    if (DEMO_MODE) {
      setCourse(MOCK_COURSES.find(c => c.id === slug) ?? null)
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([coursesApi.getBySlug(slug), progressApi.get()])
      .then(([dto, progressList]) => {
        const progress = progressList.find(p => p.courseSlug === slug)
        setCourse(apiCourseDetailToFrontend(dto, progress))
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [slug])

  return { course, loading, error }
}

export function useExercises(): { exercises: Exercise[]; loading: boolean; error: string | null } {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (DEMO_MODE) {
      setExercises(MOCK_EXERCISES)
      return
    }
    setLoading(true)
    exercisesApi
      .list()
      .then(dtos => setExercises(dtos.map(apiExerciseToFrontend)))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  return { exercises, loading, error }
}

export function useExercise(slug: string | undefined): { exercise: Exercise | null; loading: boolean; error: string | null } {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(!!slug && !DEMO_MODE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    if (DEMO_MODE) {
      setExercise(MOCK_EXERCISES.find(e => e.id === slug) ?? null)
      setLoading(false)
      return
    }
    setLoading(true)
    exercisesApi
      .getBySlug(slug)
      .then(dto => setExercise(apiExerciseDetailToFrontend(dto)))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [slug])

  return { exercise, loading, error }
}

export function useLeaderboard(): { entries: (LeaderboardEntry & { rank: number })[]; loading: boolean } {
  const [entries, setEntries] = useState<(LeaderboardEntry & { rank: number })[]>([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const { user } = useUserStore()

  useEffect(() => {
    if (DEMO_MODE) {
      const all: LeaderboardEntry[] = [
        ...LEADERBOARD_OTHERS,
        { name: user.name, xp: user.xp, streak: user.streak, avatar: user.avatar, isCurrentUser: true },
      ]
      setEntries(all.sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 })))
      return
    }
    setLoading(true)
    leaderboardApi
      .get()
      .then(dtos => {
        setEntries(
          dtos.map(dto => ({
            name: dto.displayName || dto.username,
            xp: dto.xp,
            streak: 0,
            avatar: dto.avatarInitials || dto.username.slice(0, 2).toUpperCase(),
            rank: dto.position,
          })),
        )
      })
      .catch(() => {
        // fallback to mock on error
        const all: LeaderboardEntry[] = [
          ...LEADERBOARD_OTHERS,
          { name: user.name, xp: user.xp, streak: user.streak, avatar: user.avatar, isCurrentUser: true },
        ]
        setEntries(all.sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 })))
      })
      .finally(() => setLoading(false))
  }, [user.name, user.xp, user.streak, user.avatar])

  return { entries, loading }
}
