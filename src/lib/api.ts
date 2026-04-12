const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
const TOKEN_KEY = 'mqa_token'
const USER_KEY = 'mqa_user'

// When no API base URL is configured, use demo mode (mock auth backed by localStorage).
const DEMO_MODE = BASE_URL === ''

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

export interface CourseSummaryDto {
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

export interface CourseDetailDto extends CourseSummaryDto {
  chapters: string[]
}

export interface LeaderboardEntryDto {
  position: number
  userId: string
  username: string
  displayName: string | null
  avatarInitials: string | null
  xp: number
  level: number
  rank: string
  streak: number
  totalSolved: number
}

export interface UserProfileDto {
  id: string
  username: string
  email: string
  displayName: string
  avatarInitials: string
  xp: number
  level: number
  streak: number
  totalSolved: number
  rank: string
  createdAt: string
}

export interface UserBadgeDto {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  rarity: string
  earnedAt: string
}

export interface SubmissionDto {
  id: string
  exerciseId: string
  exerciseSlug: string
  exerciseTitle: string
  code: string
  passed: boolean
  xpEarned: number
  submittedAt: string
}

export interface ProgressDto {
  id: string
  courseId: string
  courseSlug: string
  courseTitle: string
  completedLessons: number
  totalLessons: number
  progressPercent: number
  lastActivityAt: string
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
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = new Headers(options.headers ?? {})
  headers.set('Content-Type', 'application/json')
  const isAuthEndpoint = path.startsWith('/auth/')
  if (token && !headers.has('Authorization') && !isAuthEndpoint) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch (err) {
    console.error('[api] Network error:', err)
    throw new Error('Unable to reach the server. Please check your connection or try again later.')
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      const isAuthPage = window.location.pathname === '/signin' || window.location.pathname === '/signup'
      if (!isAuthPage) {
        window.location.replace('/')
      }
    }

    let message = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      message = body?.message ?? body?.error ?? message
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  // Some successful endpoints (e.g. DELETE) return 204 with no body.
  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return undefined as T
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

export const courseApi = {
  list: (difficulty?: string): Promise<CourseSummaryDto[]> => {
    const params = difficulty ? `?difficulty=${encodeURIComponent(difficulty)}` : ''
    return request<CourseSummaryDto[]>(`/courses${params}`, { method: 'GET' })
  },

  getBySlug: (slug: string): Promise<CourseDetailDto> => {
    return request<CourseDetailDto>(`/courses/${encodeURIComponent(slug)}`, { method: 'GET' })
  },
}

export interface ExerciseSummaryDto {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  category: string
  xpReward: number
}

export interface ExerciseSubmissionDto {
  id: string
  exerciseId: string
  exerciseSlug: string
  exerciseTitle: string
  code: string
  passed: boolean
  xpEarned: number
  submittedAt: string
}

export const exerciseApi = {
  list: (category?: string): Promise<ExerciseSummaryDto[]> => {
    const params = category ? `?category=${encodeURIComponent(category)}` : ''
    return request<ExerciseSummaryDto[]>(`/exercises${params}`, { method: 'GET' })
  },
  submit: (slug: string, code: string): Promise<ExerciseSubmissionDto> => {
    return request<ExerciseSubmissionDto>(`/exercises/${encodeURIComponent(slug)}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  },
}

export const leaderboardApi = {
  list: (): Promise<LeaderboardEntryDto[]> => request<LeaderboardEntryDto[]>('/leaderboard', { method: 'GET' }),
}

export const userApi = {
  me: (): Promise<UserProfileDto> => request<UserProfileDto>('/users/me', { method: 'GET' }),
  myBadges: (): Promise<UserBadgeDto[]> => request<UserBadgeDto[]>('/users/me/badges', { method: 'GET' }),
  mySubmissions: (): Promise<SubmissionDto[]> => request<SubmissionDto[]>('/users/me/submissions', { method: 'GET' }),
}

export const progressApi = {
  list: (): Promise<ProgressDto[]> => request<ProgressDto[]>('/progress', { method: 'GET' }),
}

export interface AdminOverview {
  users: number
  courses: number
  exercises: number
  badges: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  displayName: string | null
  avatarInitials: string | null
  xp: number
  level: number
  streak: number
  totalSolved: number
  rank: string
  roles: string[]
  createdAt: string
}

export interface AdminCourse {
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

export interface AdminExercise {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  category: string
  xpReward: number
  starterCode: string
  solutionCode: string
  hints: string
  testCases: string
}

export interface AdminBadge {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  rarity: string
}

export const adminApi = {
  overview: (): Promise<AdminOverview> => request<AdminOverview>('/admin/overview', { method: 'GET' }),

  listUsers: (): Promise<AdminUser[]> => request<AdminUser[]>('/admin/users', { method: 'GET' }),
  createUser: (payload: Record<string, unknown>): Promise<AdminUser> =>
    request<AdminUser>('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id: string, payload: Record<string, unknown>): Promise<AdminUser> =>
    request<AdminUser>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id: string): Promise<void> => request<void>(`/admin/users/${id}`, { method: 'DELETE' }),

  listCourses: (): Promise<AdminCourse[]> => request<AdminCourse[]>('/admin/courses', { method: 'GET' }),
  createCourse: (payload: Record<string, unknown>): Promise<AdminCourse> =>
    request<AdminCourse>('/admin/courses', { method: 'POST', body: JSON.stringify(payload) }),
  updateCourse: (id: string, payload: Record<string, unknown>): Promise<AdminCourse> =>
    request<AdminCourse>(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCourse: (id: string): Promise<void> => request<void>(`/admin/courses/${id}`, { method: 'DELETE' }),

  listExercises: (): Promise<AdminExercise[]> => request<AdminExercise[]>('/admin/exercises', { method: 'GET' }),
  createExercise: (payload: Record<string, unknown>): Promise<AdminExercise> =>
    request<AdminExercise>('/admin/exercises', { method: 'POST', body: JSON.stringify(payload) }),
  updateExercise: (id: string, payload: Record<string, unknown>): Promise<AdminExercise> =>
    request<AdminExercise>(`/admin/exercises/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteExercise: (id: string): Promise<void> => request<void>(`/admin/exercises/${id}`, { method: 'DELETE' }),

  listBadges: (): Promise<AdminBadge[]> => request<AdminBadge[]>('/admin/badges', { method: 'GET' }),
  createBadge: (payload: Record<string, unknown>): Promise<AdminBadge> =>
    request<AdminBadge>('/admin/badges', { method: 'POST', body: JSON.stringify(payload) }),
  updateBadge: (id: string, payload: Record<string, unknown>): Promise<AdminBadge> =>
    request<AdminBadge>(`/admin/badges/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteBadge: (id: string): Promise<void> => request<void>(`/admin/badges/${id}`, { method: 'DELETE' }),
}
