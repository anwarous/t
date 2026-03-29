const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

// When no API base URL is configured, use demo mode (mock auth backed by localStorage).
export const DEMO_MODE = BASE_URL === ''

export interface AuthResponse {
  token: string
  tokenType: string
  username: string
  email: string
  displayName: string
}

export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  displayName?: string
}

// ---------------------------------------------------------------------------
// Demo / offline auth
// Stores registered users in localStorage so sign-up/sign-in round-trips work
// without a real backend. Not suitable for production security.
// ---------------------------------------------------------------------------
const DEMO_USERS_KEY = 'mqa_demo_users'

interface DemoUser {
  username: string
  email: string
  passwordHash: string
  displayName: string
}

function demoHash(password: string): string {
  // ⚠️ NON-CRYPTOGRAPHIC — for demo / localStorage use only.
  // NEVER adapt this for production; it provides no real security.
  let h = 0
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0
  }
  return h.toString(16)
}

function demoLoadUsers(): DemoUser[] {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) ?? '[]') as DemoUser[]
  } catch {
    return []
  }
}

function demoSaveUsers(users: DemoUser[]): void {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function demoMakeToken(username: string): string {
  return btoa(`demo:${username}:${Date.now()}`)
}

function demoRegister(payload: RegisterPayload): AuthResponse {
  const users = demoLoadUsers()
  const lower = payload.username.toLowerCase()
  if (users.some((u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('Username or email already taken.')
  }
  const user: DemoUser = {
    username: payload.username,
    email: payload.email,
    passwordHash: demoHash(payload.password),
    displayName: payload.displayName ?? payload.username,
  }
  demoSaveUsers([...users, user])
  return {
    token: demoMakeToken(user.username),
    tokenType: 'Bearer',
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  }
}

function demoLogin(payload: LoginPayload): AuthResponse {
  const users = demoLoadUsers()
  const lq = payload.usernameOrEmail.toLowerCase()
  const user = users.find(
    (u) => u.username.toLowerCase() === lq || u.email.toLowerCase() === lq,
  )
  if (!user || user.passwordHash !== demoHash(payload.password)) {
    throw new Error('Invalid username/email or password.')
  }
  return {
    token: demoMakeToken(user.username),
    tokenType: 'Bearer',
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  }
}

// ---------------------------------------------------------------------------
// Real HTTP request helper
// ---------------------------------------------------------------------------
async function request<T>(path: string, options: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  } catch (err) {
    console.error('[api] Network error:', err)
    throw new Error('Unable to reach the server. Please check your connection or try again later.')
  }

  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      message = body?.message ?? body?.error ?? message
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

export const authApi = {
  login: (payload: LoginPayload): Promise<AuthResponse> => {
    if (DEMO_MODE) return Promise.resolve().then(() => demoLogin(payload))
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  register: (payload: RegisterPayload): Promise<AuthResponse> => {
    if (DEMO_MODE) return Promise.resolve().then(() => demoRegister(payload))
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

// ---------------------------------------------------------------------------
// Auth header helper
// ---------------------------------------------------------------------------
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('mqa_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function mapCourseDifficulty(d: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (d === 'INTERMEDIATE') return 'Intermediate'
  if (d === 'ADVANCED') return 'Advanced'
  return 'Beginner'
}

function mapExerciseDifficulty(d: string): 'Easy' | 'Medium' | 'Hard' {
  if (d === 'MEDIUM') return 'Medium'
  if (d === 'HARD') return 'Hard'
  return 'Easy'
}

function mapLessonType(t: string): 'video' | 'reading' | 'practice' | 'quiz' {
  const lower = t.toLowerCase()
  if (lower === 'video') return 'video'
  if (lower === 'reading') return 'reading'
  if (lower === 'practice') return 'practice'
  if (lower === 'quiz') return 'quiz'
  return 'reading'
}

function safeParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback
  try { return JSON.parse(json) as T } catch { return fallback }
}

// ---------------------------------------------------------------------------
// API DTO interfaces
// ---------------------------------------------------------------------------
export interface ApiCourseDto {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: string
  totalLessons: number
  durationMinutes: number
  xpReward: number
  colorHex: string
  icon: string
  tags: string
}

export interface ApiLessonDto {
  id: string
  title: string
  type: string
  durationMinutes: number
  xpReward: number
  videoUrl: string | null
  locked: boolean
}

export interface ApiChapterDto {
  id: string
  title: string
  lessons: ApiLessonDto[]
}

export interface ApiCourseDetailDto extends ApiCourseDto {
  chapters: ApiChapterDto[]
}

export interface ApiExerciseDto {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  category: string
  xpReward: number
}

export interface ApiExerciseDetailDto extends ApiExerciseDto {
  starterCode: string
  hints: string | null
  examples: string | null
  constraints: string | null
  testCases: string | null
}

export interface ApiProgressDto {
  id: string
  courseId: string
  courseSlug: string
  courseTitle: string
  completedLessons: number
  totalLessons: number
  progressPercent: number
  lastActivityAt: string
}

export interface ApiLeaderboardEntryDto {
  position: number
  userId: string
  username: string
  displayName: string
  avatarInitials: string
  xp: number
  level: number
  rank: string
  totalSolved: number
}

export interface ApiSubmissionDto {
  id: string
  exerciseId: string
  exerciseSlug: string
  exerciseTitle: string
  code: string
  passed: boolean
  xpEarned: number
  submittedAt: string
}

// ---------------------------------------------------------------------------
// Converter: backend DTOs → frontend Course/Exercise types
// ---------------------------------------------------------------------------
import type { Course, Exercise } from '@/data/mockData'

export function apiCourseToFrontend(dto: ApiCourseDto, progress?: ApiProgressDto): Course {
  return {
    id: dto.slug,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    difficulty: mapCourseDifficulty(dto.difficulty),
    progress: progress?.progressPercent ?? 0,
    totalLessons: dto.totalLessons,
    completedLessons: progress?.completedLessons ?? 0,
    duration: formatDuration(dto.durationMinutes),
    xpReward: dto.xpReward,
    color: dto.colorHex,
    icon: dto.icon,
    tags: dto.tags ? dto.tags.split(',').map(t => t.trim()) : [],
    chapters: [],
  }
}

export function apiCourseDetailToFrontend(dto: ApiCourseDetailDto, progress?: ApiProgressDto): Course {
  const completedLessonIds = new Set<string>()
  return {
    id: dto.slug,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    difficulty: mapCourseDifficulty(dto.difficulty),
    progress: progress?.progressPercent ?? 0,
    totalLessons: dto.totalLessons,
    completedLessons: progress?.completedLessons ?? 0,
    duration: formatDuration(dto.durationMinutes),
    xpReward: dto.xpReward,
    color: dto.colorHex,
    icon: dto.icon,
    tags: dto.tags ? dto.tags.split(',').map(t => t.trim()) : [],
    chapters: dto.chapters.map(ch => ({
      id: ch.id,
      title: ch.title,
      lessons: ch.lessons.map(l => ({
        id: l.id,
        title: l.title,
        type: mapLessonType(l.type),
        duration: formatDuration(l.durationMinutes),
        completed: completedLessonIds.has(l.id),
        locked: l.locked,
        xp: l.xpReward,
      })),
    })),
  }
}

export function apiExerciseToFrontend(dto: ApiExerciseDto): Exercise {
  return {
    id: dto.slug,
    title: dto.title,
    difficulty: mapExerciseDifficulty(dto.difficulty),
    category: dto.category,
    completed: false,
    attempts: 0,
    xp: dto.xpReward,
    description: dto.description,
    starterCode: '',
    solution: '',
  }
}

export function apiExerciseDetailToFrontend(dto: ApiExerciseDetailDto): Exercise {
  const examples = safeParse<{ input: string; output: string; explanation?: string }[]>(dto.examples, [])
  const constraints = safeParse<string[]>(dto.constraints, [])
  return {
    id: dto.slug,
    title: dto.title,
    difficulty: mapExerciseDifficulty(dto.difficulty),
    category: dto.category,
    completed: false,
    attempts: 0,
    xp: dto.xpReward,
    description: dto.description,
    starterCode: dto.starterCode ?? '',
    solution: '',
    hint: dto.hints ?? undefined,
    examples: examples.map(e => ({ input: e.input, output: e.output, note: e.explanation })),
    constraints,
  }
}

// ---------------------------------------------------------------------------
// Courses API
// ---------------------------------------------------------------------------
export const coursesApi = {
  list: (): Promise<ApiCourseDto[]> =>
    request<ApiCourseDto[]>('/courses', { method: 'GET' }),

  getBySlug: (slug: string): Promise<ApiCourseDetailDto> =>
    request<ApiCourseDetailDto>(`/courses/${slug}`, { method: 'GET' }),
}

// ---------------------------------------------------------------------------
// Exercises API
// ---------------------------------------------------------------------------
export const exercisesApi = {
  list: (): Promise<ApiExerciseDto[]> =>
    request<ApiExerciseDto[]>('/exercises', { method: 'GET' }),

  getBySlug: (slug: string): Promise<ApiExerciseDetailDto> =>
    request<ApiExerciseDetailDto>(`/exercises/${slug}`, { method: 'GET' }),

  submit: (slug: string, code: string): Promise<ApiSubmissionDto> => {
    if (DEMO_MODE) {
      return Promise.resolve({
        id: 'demo-sub',
        exerciseId: slug,
        exerciseSlug: slug,
        exerciseTitle: slug,
        code,
        passed: code.trim().length > 20,
        xpEarned: code.trim().length > 20 ? 50 : 0,
        submittedAt: new Date().toISOString(),
      })
    }
    return request<ApiSubmissionDto>(`/exercises/${slug}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, language: 'javascript' }),
    })
  },
}

// ---------------------------------------------------------------------------
// Progress API
// ---------------------------------------------------------------------------
export const progressApi = {
  get: (): Promise<ApiProgressDto[]> => {
    if (DEMO_MODE) return Promise.resolve([])
    return request<ApiProgressDto[]>('/progress', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
  },

  markLessonComplete: (courseSlug: string, lessonId: string): Promise<ApiProgressDto> => {
    if (DEMO_MODE) {
      return Promise.resolve({
        id: 'demo',
        courseId: '',
        courseSlug,
        courseTitle: '',
        completedLessons: 1,
        totalLessons: 1,
        progressPercent: 100,
        lastActivityAt: new Date().toISOString(),
      })
    }
    return request<ApiProgressDto>(`/progress/${courseSlug}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  },
}

// ---------------------------------------------------------------------------
// Leaderboard API
// ---------------------------------------------------------------------------
export const leaderboardApi = {
  get: (): Promise<ApiLeaderboardEntryDto[]> => {
    if (DEMO_MODE) return Promise.resolve([])
    return request<ApiLeaderboardEntryDto[]>('/leaderboard', { method: 'GET' })
  },
}
