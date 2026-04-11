import { FormEvent, memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminApi,
  type AdminBadge,
  type AdminCourse,
  type AdminExercise,
  type AdminOverview,
  type AdminUser,
} from '@/lib/api'
import { useAuthStore, useUserStore } from '@/store'

const ADMIN_EMAIL = 'admin@admin.admin'
const SECTION_OPTIONS = [
  { key: 'users', label: 'Users' },
  { key: 'courses', label: 'Courses' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'badges', label: 'Badges' },
] as const

export default function AdminPage() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const authUser = useAuthStore((s) => s.authUser)
  const token = useAuthStore((s) => s.token)
  const user = useUserStore((s) => s.user)
  const updateProfile = useUserStore((s) => s.updateProfile)
  const updateTheme = useUserStore((s) => s.updateTheme)

  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [exercises, setExercises] = useState<AdminExercise[]>([])
  const [badges, setBadges] = useState<AdminBadge[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState({ users: true, courses: true, exercises: true, badges: true })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [settingsForm, setSettingsForm] = useState({
    displayName: user.name,
    theme: user.theme,
  })

  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', displayName: '', roles: 'USER' })
  const [newCourse, setNewCourse] = useState({
    slug: '',
    title: '',
    description: '',
    category: 'General',
    difficulty: 'BEGINNER',
    totalLessons: 1,
    durationMinutes: 60,
    xpReward: 100,
    colorHex: '#3B82F6',
    icon: 'array',
    tags: 'admin-created',
  })
  const [showCourseAdvanced, setShowCourseAdvanced] = useState(false)
  const [newExercise, setNewExercise] = useState({
    slug: '',
    title: '',
    description: '',
    difficulty: 'EASY',
    category: 'General',
    xpReward: 50,
    starterCode: '',
    solutionCode: '',
    hints: '',
    testCases: '',
  })
  const [newBadge, setNewBadge] = useState({ slug: '', name: '', rarity: 'COMMON', description: '', icon: '🏅' })
  const [showBadgeAdvanced, setShowBadgeAdvanced] = useState(false)

  const loadAll = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const [o, u, c, e, b] = await Promise.all([
        adminApi.overview(),
        adminApi.listUsers(),
        adminApi.listCourses(),
        adminApi.listExercises(),
        adminApi.listBadges(),
      ])
      setOverview(o)
      setUsers(u)
      setCourses(c)
      setExercises(e)
      setBadges(b)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAll()
  }, [])

  useEffect(() => {
    setSettingsForm({
      displayName: user.name,
      theme: user.theme,
    })
  }, [user.name, user.theme])

  const saveSettings = useCallback((e: FormEvent) => {
    e.preventDefault()
    const displayName = settingsForm.displayName.trim()
    updateProfile({ name: displayName || user.name })
    updateTheme(settingsForm.theme)
    setSettingsMessage('Settings saved')
  }, [settingsForm.displayName, settingsForm.theme, updateProfile, updateTheme, user.name])

  const signOut = useCallback(() => {
    clearAuth()
    window.location.replace('/')
  }, [clearAuth])

  async function createUser(e: FormEvent) {
    e.preventDefault()
    await adminApi.createUser({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      displayName: newUser.displayName || null,
      roles: newUser.roles.split(',').map((r) => r.trim()).filter(Boolean),
    })
    setNewUser({ username: '', email: '', password: '', displayName: '', roles: 'USER' })
    await loadAll()
  }

  async function createCourse(e: FormEvent) {
    e.preventDefault()
    await adminApi.createCourse({
      slug: newCourse.slug,
      title: newCourse.title,
      description: newCourse.description,
      category: newCourse.category,
      difficulty: newCourse.difficulty,
      totalLessons: newCourse.totalLessons,
      durationMinutes: newCourse.durationMinutes,
      xpReward: newCourse.xpReward,
      colorHex: newCourse.colorHex,
      icon: newCourse.icon,
      tags: newCourse.tags,
    })
    setNewCourse({
      slug: '',
      title: '',
      description: '',
      category: 'General',
      difficulty: 'BEGINNER',
      totalLessons: 1,
      durationMinutes: 60,
      xpReward: 100,
      colorHex: '#3B82F6',
      icon: 'array',
      tags: 'admin-created',
    })
    await loadAll()
  }

  async function createExercise(e: FormEvent) {
    e.preventDefault()
    await adminApi.createExercise({
      slug: newExercise.slug,
      title: newExercise.title,
      description: newExercise.description,
      difficulty: newExercise.difficulty,
      category: newExercise.category,
      xpReward: newExercise.xpReward,
      starterCode: newExercise.starterCode,
      solutionCode: newExercise.solutionCode,
      hints: newExercise.hints,
      testCases: newExercise.testCases,
    })
    setNewExercise({
      slug: '',
      title: '',
      description: '',
      difficulty: 'EASY',
      category: 'General',
      xpReward: 50,
      starterCode: '',
      solutionCode: '',
      hints: '',
      testCases: '',
    })
    await loadAll()
  }

  async function createBadge(e: FormEvent) {
    e.preventDefault()
    await adminApi.createBadge({
      slug: newBadge.slug,
      name: newBadge.name,
      rarity: newBadge.rarity,
      description: newBadge.description,
      icon: newBadge.icon,
    })
    setNewBadge({ slug: '', name: '', rarity: 'COMMON', description: '', icon: '🏅' })
    await loadAll()
  }

  if (loading) return <div className="p-6">Loading admin panel...</div>

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-surface-400">Signed in as {authUser?.email ?? ADMIN_EMAIL}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => setSettingsOpen((v) => !v)}>
            {settingsOpen ? 'Close Settings' : 'Settings'}
          </button>
          <button className="btn-ghost" onClick={signOut}>Sign Out</button>
          <button className="btn-ghost" onClick={() => void loadAll()}>Refresh</button>
        </div>
      </div>

      {settingsOpen && (
        <section className="rounded border border-white/10 p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Admin Session Settings</h2>
            <p className="text-sm text-surface-400">Manage your admin session and preferences from one place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 items-stretch">
            <StatCard title="Session User" value={authUser?.username ?? 'admin'} />
            <StatCard title="Session Email" value={authUser?.email ?? ADMIN_EMAIL} />
            <StatCard title="Token" value={token ? 'Active' : 'Missing'} />
          </div>

          <form onSubmit={saveSettings} className="grid md:grid-cols-3 gap-2 items-end">
            <div className="space-y-1">
              <label className="text-xs text-surface-400">Display Name</label>
              <input
                className="input-field"
                value={settingsForm.displayName}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-surface-400">Theme</label>
              <select
                className="input-field"
                value={settingsForm.theme}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, theme: e.target.value }))}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <button className="btn-primary" type="submit">Save Settings</button>
          </form>

          {settingsMessage && <p className="text-green-300 text-sm">{settingsMessage}</p>}
        </section>
      )}

      {error && <p className="text-red-300 text-sm">{error}</p>}

      {overview && (
        <div className="grid md:grid-cols-4 gap-3">
          <StatCard title="Users" value={overview.users} />
          <StatCard title="Courses" value={overview.courses} />
          <StatCard title="Exercises" value={overview.exercises} />
          <StatCard title="Badges" value={overview.badges} />
        </div>
      )}

      <section className="rounded border border-white/10 p-3 space-y-2">
        <div className="text-sm text-surface-400">Choose what to show</div>
        <div className="flex flex-wrap gap-2">
          {SECTION_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="btn-ghost"
              onClick={() => setVisibleSections((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            >
              {(visibleSections[key as keyof typeof visibleSections] ? 'Hide' : 'Show') + ' ' + label}
            </button>
          ))}
        </div>
      </section>

      {visibleSections.users && <section className="space-y-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <form onSubmit={createUser} className="grid md:grid-cols-5 gap-2">
          <input className="input-field" placeholder="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
          <input className="input-field" placeholder="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <input className="input-field" placeholder="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <input className="input-field" placeholder="display name" value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} />
          <input className="input-field" placeholder="roles (comma separated)" value={newUser.roles} onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })} />
          <button className="btn-primary" type="submit">Add User</button>
        </form>
        <div className="space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}>
          {users.map((u) => (
            <UserRow key={u.id} user={u} onSaved={loadAll} onDeleted={loadAll} />
          ))}
          {users.length === 0 && (
            <div className="arcade-panel p-4">
              <div className="ascii-empty">{`[ USERS: EMPTY ]\n   .----.\n  / __  \\__\n / /  \\___/\n \\_\\  /_/\n    '--'`}</div>
            </div>
          )}
        </div>
      </section>}

      {visibleSections.courses && <section className="space-y-3">
        <h2 className="text-xl font-semibold">Courses</h2>
        <form onSubmit={createCourse} className="grid md:grid-cols-2 gap-2">
          <input className="input-field" placeholder="slug" value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })} required />
          <input className="input-field" placeholder="title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
          <input className="input-field" placeholder="category" value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} />
          <input className="input-field" placeholder="xp reward" type="number" min={0} value={newCourse.xpReward} onChange={(e) => setNewCourse({ ...newCourse, xpReward: Number(e.target.value) || 0 })} />
          <select className="input-field" value={newCourse.difficulty} onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}>
            <option>BEGINNER</option>
            <option>INTERMEDIATE</option>
            <option>ADVANCED</option>
          </select>
          <button type="button" className="btn-ghost" onClick={() => setShowCourseAdvanced((v) => !v)}>
            {showCourseAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          {showCourseAdvanced && <>
            <input className="input-field" placeholder="total lessons" type="number" min={0} value={newCourse.totalLessons} onChange={(e) => setNewCourse({ ...newCourse, totalLessons: Number(e.target.value) || 0 })} />
            <input className="input-field" placeholder="duration minutes" type="number" min={0} value={newCourse.durationMinutes} onChange={(e) => setNewCourse({ ...newCourse, durationMinutes: Number(e.target.value) || 0 })} />
            <input className="input-field" placeholder="color hex" value={newCourse.colorHex} onChange={(e) => setNewCourse({ ...newCourse, colorHex: e.target.value })} />
            <input className="input-field" placeholder="icon" value={newCourse.icon} onChange={(e) => setNewCourse({ ...newCourse, icon: e.target.value })} />
            <textarea className="input-field md:col-span-2 min-h-16" placeholder="tags (comma separated)" value={newCourse.tags} onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value })} />
            <textarea className="input-field md:col-span-2 min-h-20" placeholder="description / content" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
          </>}
          <button className="btn-primary" type="submit">Add Course</button>
        </form>
        <div className="space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}>
          {courses.map((c) => (
            <CourseRow key={c.id} course={c} onSaved={loadAll} onDeleted={loadAll} />
          ))}
          {courses.length === 0 && (
            <div className="arcade-panel p-4">
              <div className="ascii-empty">{`[ COURSES: EMPTY ]\n   __[]__\n  / ____ \\n /_/____\\_\\\n   ||  ||`}</div>
            </div>
          )}
        </div>
      </section>}

      {visibleSections.exercises && <section className="space-y-3">
        <h2 className="text-xl font-semibold">Exercises</h2>
        <form onSubmit={createExercise} className="grid md:grid-cols-2 gap-2">
          <input className="input-field" placeholder="slug" value={newExercise.slug} onChange={(e) => setNewExercise({ ...newExercise, slug: e.target.value })} required />
          <input className="input-field" placeholder="title" value={newExercise.title} onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })} required />
          <input className="input-field" placeholder="category" value={newExercise.category} onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })} required />
          <input className="input-field" placeholder="xp reward" type="number" min={0} value={newExercise.xpReward} onChange={(e) => setNewExercise({ ...newExercise, xpReward: Number(e.target.value) || 0 })} required />
          <select className="input-field" value={newExercise.difficulty} onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}>
            <option>EASY</option>
            <option>MEDIUM</option>
            <option>HARD</option>
          </select>
          <button className="btn-primary" type="submit">Add Exercise</button>
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="content / description" value={newExercise.description} onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="starter code" value={newExercise.starterCode} onChange={(e) => setNewExercise({ ...newExercise, starterCode: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="solution code" value={newExercise.solutionCode} onChange={(e) => setNewExercise({ ...newExercise, solutionCode: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-20" placeholder="hints" value={newExercise.hints} onChange={(e) => setNewExercise({ ...newExercise, hints: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="test cases (JSON or text)" value={newExercise.testCases} onChange={(e) => setNewExercise({ ...newExercise, testCases: e.target.value })} />
        </form>
        <div className="space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}>
          {exercises.map((x) => (
            <ExerciseRow key={x.id} exercise={x} onSaved={loadAll} onDeleted={loadAll} />
          ))}
          {exercises.length === 0 && (
            <div className="arcade-panel p-4">
              <div className="ascii-empty">{`[ EXERCISES: EMPTY ]\n  <>  <>\n [__][__]\n   /\\/\\\n  /_/  \\_\\`}</div>
            </div>
          )}
        </div>
      </section>}

      {visibleSections.badges && <section className="space-y-3">
        <h2 className="text-xl font-semibold">Badges</h2>
        <form onSubmit={createBadge} className="grid md:grid-cols-2 gap-2">
          <input className="input-field" placeholder="slug" value={newBadge.slug} onChange={(e) => setNewBadge({ ...newBadge, slug: e.target.value })} required />
          <input className="input-field" placeholder="name" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} required />
          <select className="input-field" value={newBadge.rarity} onChange={(e) => setNewBadge({ ...newBadge, rarity: e.target.value })}>
            <option>COMMON</option>
            <option>RARE</option>
            <option>EPIC</option>
            <option>LEGENDARY</option>
          </select>
          <button type="button" className="btn-ghost" onClick={() => setShowBadgeAdvanced((v) => !v)}>
            {showBadgeAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          {showBadgeAdvanced && <>
            <input className="input-field" placeholder="icon" value={newBadge.icon} onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })} />
            <div />
            <textarea className="input-field md:col-span-2 min-h-20" placeholder="description" value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} />
          </>}
          <button className="btn-primary" type="submit">Add Badge</button>
        </form>
        <div className="space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}>
          {badges.map((b) => (
            <BadgeRow key={b.id} badge={b} onSaved={loadAll} onDeleted={loadAll} />
          ))}
          {badges.length === 0 && (
            <div className="arcade-panel p-4">
              <div className="ascii-empty">{`[ BADGES: EMPTY ]\n   .:::.\n  :::::::\n  ':::::'\n    ':'`}</div>
            </div>
          )}
        </div>
      </section>}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="h-full rounded border border-white/10 p-4">
      <p className="text-surface-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

const UserRow = memo(function UserRow({ user, onSaved, onDeleted }: { user: AdminUser; onSaved: () => void; onDeleted: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [displayName, setDisplayName] = useState(user.displayName ?? '')
  const [rank, setRank] = useState(user.rank)
  const [xp, setXp] = useState(user.xp)
  const [level, setLevel] = useState(user.level)
  const [streak, setStreak] = useState(user.streak)
  const [totalSolved, setTotalSolved] = useState(user.totalSolved)
  const [roles, setRoles] = useState(user.roles.join(', '))

  return (
    <div className="p-3 rounded border border-white/10 space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <div className="font-semibold">{user.username} ({user.email})</div>
          <div className="text-surface-400">roles: {user.roles.join(', ')}</div>
        </div>
        <button className="btn-ghost" type="button" onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && <div className="grid md:grid-cols-3 gap-2 items-stretch">
        <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="display name" />
        <input className="input-field" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="rank" />
        <input className="input-field" type="number" min={0} value={xp} onChange={(e) => setXp(Number(e.target.value) || 0)} placeholder="xp" />
        <input className="input-field" type="number" min={1} value={level} onChange={(e) => setLevel(Number(e.target.value) || 1)} placeholder="level" />
        <input className="input-field" type="number" min={0} value={streak} onChange={(e) => setStreak(Number(e.target.value) || 0)} placeholder="streak" />
        <input className="input-field" type="number" min={0} value={totalSolved} onChange={(e) => setTotalSolved(Number(e.target.value) || 0)} placeholder="total solved" />
        <input className="input-field" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="roles (comma separated)" />
        <button className="btn-ghost" type="button" onClick={() => void adminApi.updateUser(user.id, {
          username,
          email,
          displayName,
          rank,
          xp,
          level,
          streak,
          totalSolved,
          roles: roles.split(',').map((r) => r.trim()).filter(Boolean),
        }).then(onSaved)}>Save</button>
        <button className="btn-ghost" type="button" onClick={() => void adminApi.deleteUser(user.id).then(onDeleted)}>Delete</button>
      </div>}
    </div>
  )
})

const CourseRow = memo(function CourseRow({ course, onSaved, onDeleted }: { course: AdminCourse; onSaved: () => void; onDeleted: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [slug, setSlug] = useState(course.slug)
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [category, setCategory] = useState(course.category)
  const [difficulty, setDifficulty] = useState(course.difficulty)
  const [totalLessons, setTotalLessons] = useState(course.totalLessons)
  const [durationMinutes, setDurationMinutes] = useState(course.durationMinutes)
  const [xpReward, setXpReward] = useState(course.xpReward)
  const [colorHex, setColorHex] = useState(course.colorHex)
  const [icon, setIcon] = useState(course.icon)
  const [tags, setTags] = useState(course.tags)

  return (
    <div className="p-3 rounded border border-white/10 space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-surface-400">{course.slug} • {course.title}</div>
        <button className="btn-ghost" type="button" onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && <div className="grid md:grid-cols-2 gap-2 items-stretch">
        <input className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <input className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="category" />
        <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>BEGINNER</option>
          <option>INTERMEDIATE</option>
          <option>ADVANCED</option>
        </select>
        <input className="input-field" type="number" min={0} value={totalLessons} onChange={(e) => setTotalLessons(Number(e.target.value) || 0)} placeholder="total lessons" />
        <input className="input-field" type="number" min={0} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value) || 0)} placeholder="duration minutes" />
        <input className="input-field" type="number" min={0} value={xpReward} onChange={(e) => setXpReward(Number(e.target.value) || 0)} placeholder="xp reward" />
        <input className="input-field" value={colorHex} onChange={(e) => setColorHex(e.target.value)} placeholder="color hex" />
        <input className="input-field" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="icon" />
        <input className="input-field" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags" />
        <textarea className="input-field md:col-span-2 min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description / content" />
        <button className="btn-ghost" type="button" onClick={() => void adminApi.updateCourse(course.id, {
          slug,
          title,
          category,
          difficulty,
          totalLessons,
          durationMinutes,
          xpReward,
          colorHex,
          icon,
          tags,
          description,
        }).then(onSaved)}>Save</button>
        <button className="btn-ghost" type="button" onClick={() => void adminApi.deleteCourse(course.id).then(onDeleted)}>Delete</button>
      </div>}
    </div>
  )
})

const ExerciseRow = memo(function ExerciseRow({ exercise, onSaved, onDeleted }: { exercise: AdminExercise; onSaved: () => void; onDeleted: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [slug, setSlug] = useState(exercise.slug)
  const [title, setTitle] = useState(exercise.title)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)
  const [category, setCategory] = useState(exercise.category)
  const [xpReward, setXpReward] = useState(exercise.xpReward)
  const [description, setDescription] = useState(exercise.description)
  const [starterCode, setStarterCode] = useState(exercise.starterCode)
  const [solutionCode, setSolutionCode] = useState(exercise.solutionCode)
  const [hints, setHints] = useState(exercise.hints)
  const [testCases, setTestCases] = useState(exercise.testCases ?? '')

  return (
    <div className="p-3 rounded border border-white/10 space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '140px' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-surface-400">{exercise.slug} • {exercise.title}</div>
        <button className="btn-ghost" type="button" onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && <div className="grid md:grid-cols-2 gap-2 items-stretch">
        <input className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>EASY</option>
          <option>MEDIUM</option>
          <option>HARD</option>
        </select>
        <input className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="category" />
        <input className="input-field" type="number" min={0} value={xpReward} onChange={(e) => setXpReward(Number(e.target.value) || 0)} placeholder="xp reward" />
        <div />
        <textarea className="input-field md:col-span-2 min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="content / description" />
        <textarea className="input-field md:col-span-2 min-h-20" value={starterCode} onChange={(e) => setStarterCode(e.target.value)} placeholder="starter code" />
        <textarea className="input-field md:col-span-2 min-h-20" value={solutionCode} onChange={(e) => setSolutionCode(e.target.value)} placeholder="solution code" />
        <textarea className="input-field md:col-span-2 min-h-16" value={hints} onChange={(e) => setHints(e.target.value)} placeholder="hints" />
        <textarea className="input-field md:col-span-2 min-h-20" value={testCases} onChange={(e) => setTestCases(e.target.value)} placeholder="test cases (JSON or text)" />
        <button className="btn-ghost" type="button" onClick={() => void adminApi.updateExercise(exercise.id, { slug, title, difficulty, category, xpReward, description, starterCode, solutionCode, hints, testCases }).then(onSaved)}>Save</button>
        <button className="btn-ghost" type="button" onClick={() => void adminApi.deleteExercise(exercise.id).then(onDeleted)}>Delete</button>
      </div>}
    </div>
  )
})

const BadgeRow = memo(function BadgeRow({ badge, onSaved, onDeleted }: { badge: AdminBadge; onSaved: () => void; onDeleted: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [slug, setSlug] = useState(badge.slug)
  const [name, setName] = useState(badge.name)
  const [description, setDescription] = useState(badge.description)
  const [icon, setIcon] = useState(badge.icon)
  const [rarity, setRarity] = useState(badge.rarity)

  return (
    <div className="p-3 rounded border border-white/10 space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-surface-400">{badge.slug} • {badge.name}</div>
        <button className="btn-ghost" type="button" onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && <div className="grid md:grid-cols-2 gap-2 items-stretch">
        <input className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
        <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
        <input className="input-field" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="icon" />
        <select className="input-field" value={rarity} onChange={(e) => setRarity(e.target.value)}>
          <option>COMMON</option>
          <option>RARE</option>
          <option>EPIC</option>
          <option>LEGENDARY</option>
        </select>
        <textarea className="input-field md:col-span-2 min-h-16" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
        <button className="btn-ghost" type="button" onClick={() => void adminApi.updateBadge(badge.id, { slug, name, icon, rarity, description }).then(onSaved)}>Save</button>
        <button className="btn-ghost" type="button" onClick={() => void adminApi.deleteBadge(badge.id).then(onDeleted)}>Delete</button>
      </div>}
    </div>
  )
})
