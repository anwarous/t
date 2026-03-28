const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

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
