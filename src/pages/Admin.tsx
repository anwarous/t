import { FormEvent, useEffect, useState } from 'react'
import {
  adminApi,
  type AdminBadge,
  type AdminCourse,
  type AdminExercise,
  type AdminOverview,
  type AdminUser,
} from '@/lib/api'

const ADMIN_EMAIL = 'admin@admin.admin'

export default function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [exercises, setExercises] = useState<AdminExercise[]>([])
  const [badges, setBadges] = useState<AdminBadge[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', displayName: '', roles: 'USER' })
  const [newCourse, setNewCourse] = useState({ slug: '', title: '', difficulty: 'BEGINNER' })
  const [newExercise, setNewExercise] = useState({ slug: '', title: '', difficulty: 'EASY' })
  const [newBadge, setNewBadge] = useState({ slug: '', name: '', rarity: 'COMMON' })

  async function loadAll() {
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
  }

  useEffect(() => {
    void loadAll()
  }, [])

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
      difficulty: newCourse.difficulty,
      totalLessons: 1,
      durationMinutes: 60,
      xpReward: 100,
      colorHex: '#3B82F6',
      icon: 'array',
      tags: 'admin-created',
      category: 'General',
      description: '',
    })
    setNewCourse({ slug: '', title: '', difficulty: 'BEGINNER' })
    await loadAll()
  }

  async function createExercise(e: FormEvent) {
    e.preventDefault()
    await adminApi.createExercise({
      slug: newExercise.slug,
      title: newExercise.title,
      difficulty: newExercise.difficulty,
      category: 'General',
      description: '',
      xpReward: 50,
      starterCode: '',
      solutionCode: '',
      hints: '',
    })
    setNewExercise({ slug: '', title: '', difficulty: 'EASY' })
    await loadAll()
  }

  async function createBadge(e: FormEvent) {
    e.preventDefault()
    await adminApi.createBadge({
      slug: newBadge.slug,
      name: newBadge.name,
      rarity: newBadge.rarity,
      description: '',
      icon: '🏅',
    })
    setNewBadge({ slug: '', name: '', rarity: 'COMMON' })
    await loadAll()
  }

  if (loading) return <div className="p-6">Loading admin panel...</div>

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-surface-400">Signed in as {ADMIN_EMAIL}</p>
        </div>
        <button className="btn-ghost" onClick={() => void loadAll()}>Refresh</button>
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      {overview && (
        <div className="grid md:grid-cols-4 gap-3">
          <StatCard title="Users" value={overview.users} />
          <StatCard title="Courses" value={overview.courses} />
          <StatCard title="Exercises" value={overview.exercises} />
          <StatCard title="Badges" value={overview.badges} />
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <form onSubmit={createUser} className="grid md:grid-cols-5 gap-2">
          <input className="input-field" placeholder="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
          <input className="input-field" placeholder="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <input className="input-field" placeholder="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <input className="input-field" placeholder="display name" value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} />
          <button className="btn-primary" type="submit">Add User</button>
        </form>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="p-3 rounded border border-white/10 flex items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{u.username} ({u.email})</div>
                <div className="text-surface-400">roles: {u.roles.join(', ')}</div>
              </div>
              <button className="btn-ghost" onClick={() => void adminApi.deleteUser(u.id).then(loadAll)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Courses</h2>
        <form onSubmit={createCourse} className="grid md:grid-cols-4 gap-2">
          <input className="input-field" placeholder="slug" value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })} required />
          <input className="input-field" placeholder="title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
          <select className="input-field" value={newCourse.difficulty} onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}>
            <option>BEGINNER</option>
            <option>INTERMEDIATE</option>
            <option>ADVANCED</option>
          </select>
          <button className="btn-primary" type="submit">Add Course</button>
        </form>
        <div className="space-y-2">
          {courses.map((c) => (
            <CourseRow key={c.id} course={c} onSaved={loadAll} onDeleted={loadAll} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Exercises</h2>
        <form onSubmit={createExercise} className="grid md:grid-cols-4 gap-2">
          <input className="input-field" placeholder="slug" value={newExercise.slug} onChange={(e) => setNewExercise({ ...newExercise, slug: e.target.value })} required />
          <input className="input-field" placeholder="title" value={newExercise.title} onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })} required />
          <select className="input-field" value={newExercise.difficulty} onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}>
            <option>EASY</option>
            <option>MEDIUM</option>
            <option>HARD</option>
          </select>
          <button className="btn-primary" type="submit">Add Exercise</button>
        </form>
        <div className="space-y-2">
          {exercises.map((x) => (
            <ExerciseRow key={x.id} exercise={x} onSaved={loadAll} onDeleted={loadAll} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Badges</h2>
        <form onSubmit={createBadge} className="grid md:grid-cols-4 gap-2">
          <input className="input-field" placeholder="slug" value={newBadge.slug} onChange={(e) => setNewBadge({ ...newBadge, slug: e.target.value })} required />
          <input className="input-field" placeholder="name" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} required />
          <select className="input-field" value={newBadge.rarity} onChange={(e) => setNewBadge({ ...newBadge, rarity: e.target.value })}>
            <option>COMMON</option>
            <option>RARE</option>
            <option>EPIC</option>
            <option>LEGENDARY</option>
          </select>
          <button className="btn-primary" type="submit">Add Badge</button>
        </form>
        <div className="space-y-2">
          {badges.map((b) => (
            <BadgeRow key={b.id} badge={b} onSaved={loadAll} onDeleted={loadAll} />
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-white/10 p-4">
      <p className="text-surface-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function CourseRow({ course, onSaved, onDeleted }: { course: AdminCourse; onSaved: () => void; onDeleted: () => void }) {
  const [title, setTitle] = useState(course.title)
  const [difficulty, setDifficulty] = useState(course.difficulty)

  return (
    <div className="p-3 rounded border border-white/10 grid md:grid-cols-5 gap-2 items-center">
      <div className="text-xs text-surface-400">{course.slug}</div>
      <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option>BEGINNER</option>
        <option>INTERMEDIATE</option>
        <option>ADVANCED</option>
      </select>
      <button className="btn-ghost" onClick={() => void adminApi.updateCourse(course.id, { title, difficulty }).then(onSaved)}>Save</button>
      <button className="btn-ghost" onClick={() => void adminApi.deleteCourse(course.id).then(onDeleted)}>Delete</button>
    </div>
  )
}

function ExerciseRow({ exercise, onSaved, onDeleted }: { exercise: AdminExercise; onSaved: () => void; onDeleted: () => void }) {
  const [title, setTitle] = useState(exercise.title)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)

  return (
    <div className="p-3 rounded border border-white/10 grid md:grid-cols-5 gap-2 items-center">
      <div className="text-xs text-surface-400">{exercise.slug}</div>
      <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option>EASY</option>
        <option>MEDIUM</option>
        <option>HARD</option>
      </select>
      <button className="btn-ghost" onClick={() => void adminApi.updateExercise(exercise.id, { title, difficulty }).then(onSaved)}>Save</button>
      <button className="btn-ghost" onClick={() => void adminApi.deleteExercise(exercise.id).then(onDeleted)}>Delete</button>
    </div>
  )
}

function BadgeRow({ badge, onSaved, onDeleted }: { badge: AdminBadge; onSaved: () => void; onDeleted: () => void }) {
  const [name, setName] = useState(badge.name)
  const [rarity, setRarity] = useState(badge.rarity)

  return (
    <div className="p-3 rounded border border-white/10 grid md:grid-cols-5 gap-2 items-center">
      <div className="text-xs text-surface-400">{badge.slug}</div>
      <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
      <select className="input-field" value={rarity} onChange={(e) => setRarity(e.target.value)}>
        <option>COMMON</option>
        <option>RARE</option>
        <option>EPIC</option>
        <option>LEGENDARY</option>
      </select>
      <button className="btn-ghost" onClick={() => void adminApi.updateBadge(badge.id, { name, rarity }).then(onSaved)}>Save</button>
      <button className="btn-ghost" onClick={() => void adminApi.deleteBadge(badge.id).then(onDeleted)}>Delete</button>
    </div>
  )
}
