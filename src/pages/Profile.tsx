import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Trophy, Settings, Bell, Save, Camera,
  Zap, Flame, CheckCircle, Target, Edit3, Code2,
  BookOpen, Star, Shield, Globe, Lock, ChevronRight,
  ToggleLeft, ToggleRight, AlertCircle, Check
} from 'lucide-react'
import { useUserStore } from '@/store'
import { MOCK_BADGES, RECENT_ACTIVITY, LEADERBOARD } from '@/data/mockData'
import { cn, getRarityColor } from '@/lib/utils'

// ── Reusable toggle ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-brand-500' : 'bg-surface-700 border border-white/10'
      )}
      style={{ height: '22px' }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: checked ? 'calc(100% - 18px)' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

// ── Save feedback ──────────────────────────────────────────────────────────────
function SaveToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
        >
          <Check size={15} /> Saved!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'badges',        label: 'Achievements',  icon: Trophy },
  { id: 'settings',      label: 'Settings',      icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, updateProfile } = useUserStore()
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio, language: user.language })
  const [saved, setSaved] = useState(false)

  function save() {
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const stats = [
    { icon: Zap,         label: 'Total XP',      value: user.xp.toLocaleString(), color: 'text-brand-400',   bg: 'bg-brand-500/10'   },
    { icon: Flame,       label: 'Day Streak',     value: `${user.streak}`,         color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
    { icon: CheckCircle, label: 'Solved',         value: `${user.totalSolved}`,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Target,      label: 'Level',          value: `${user.level}`,          color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  ]

  return (
    <div className="space-y-6">

      {/* Avatar + hero card */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-2xl font-bold shadow-glow-blue">
              {user.avatar}
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </button>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-surface-900" />
          </div>

          {/* Name + rank */}
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold">{user.name}</h2>
            <p className="text-surface-400 text-sm mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/25 text-xs font-semibold text-brand-300">
                Level {user.level} · {user.rank}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-800 border border-white/8 text-xs text-surface-400">
                Member since Jan 2024
              </span>
            </div>
          </div>

          {/* Leaderboard rank */}
          <div className="text-center p-4 rounded-xl glass border border-white/8">
            <div className="text-3xl font-display font-bold gradient-text">#4</div>
            <div className="text-xs text-surface-400 mt-1">Global rank</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={cn('flex flex-col items-center py-3 rounded-xl border border-white/5', bg)}>
              <Icon size={16} className={cn(color, 'mb-1')} />
              <div className={cn('text-xl font-display font-bold', color)}>{value}</div>
              <div className="text-xs text-surface-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit form */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold flex items-center gap-2">
            <Edit3 size={16} className="text-brand-400" />
            Edit Profile
          </h3>
          <SaveToast show={saved} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Display Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Email</label>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Bio</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Preferred Language</label>
            <select
              className="input-field cursor-pointer"
              value={form.language}
              onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            >
              {['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={save} className="btn-primary">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-sm flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-surface-400">{item.action} </span>
                <span className="text-sm font-medium">{item.target}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.xp > 0 && (
                  <span className="text-xs font-semibold text-brand-400">+{item.xp} XP</span>
                )}
                <span className="text-xs text-surface-500">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Badges tab ────────────────────────────────────────────────────────────────
const RARITY_ORDER = ['legendary', 'epic', 'rare', 'common']

function BadgesTab() {
  const { badges } = useUserStore()
  const [filter, setFilter] = useState<string>('all')

  const earned = badges.filter(b => b.earned)
  const visible = filter === 'all'
    ? badges
    : filter === 'earned'
    ? earned
    : badges.filter(b => b.rarity === filter)

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Earned',    value: earned.length,            color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total',     value: badges.length,            color: 'text-surface-300', bg: 'bg-surface-800'    },
          { label: 'Legendary', value: badges.filter(b => b.rarity === 'legendary' && b.earned).length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Epic',      value: badges.filter(b => b.rarity === 'epic'      && b.earned).length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('p-4 rounded-xl border border-white/5 text-center', bg)}>
            <div className={cn('text-2xl font-display font-bold', color)}>{value}</div>
            <div className="text-xs text-surface-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'earned', ...RARITY_ORDER].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all',
              filter === f
                ? 'bg-brand-500/15 border border-brand-500/30 text-white'
                : 'text-surface-400 bg-surface-800/60 border border-white/5 hover:border-white/15 hover:text-white'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {visible.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              'relative p-5 rounded-2xl border text-center transition-all',
              badge.earned
                ? 'glass border-white/10 hover:border-white/20'
                : 'border-dashed border-white/8 bg-surface-900/50 opacity-50'
            )}
          >
            {/* Rarity glow */}
            {badge.earned && badge.rarity !== 'common' && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: badge.rarity === 'legendary'
                    ? 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)'
                    : badge.rarity === 'epic'
                    ? 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)'
                    : 'radial-gradient(circle at 50% 0%, rgba(26,92,255,0.1) 0%, transparent 70%)'
                }}
              />
            )}

            <div className="relative">
              <div className={cn(
                'text-4xl mb-3 inline-block',
                !badge.earned && 'grayscale'
              )}>
                {badge.earned ? badge.icon : '🔒'}
              </div>
              <div className="font-semibold text-sm mb-1">{badge.name}</div>
              <div className={cn('text-xs font-medium capitalize mb-2', getRarityColor(badge.rarity))}>
                {badge.rarity}
              </div>
              <p className="text-xs text-surface-500 leading-relaxed">{badge.description}</p>
              {badge.earned && badge.earnedAt && (
                <p className="text-xs text-surface-600 mt-2">Earned {badge.earnedAt}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const { user, updateTheme } = useUserStore()
  const [saved, setSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError]                 = useState('')

  function savePassword() {
    if (!currentPassword) { setPwError('Current password is required'); return }
    if (newPassword.length < 8) { setPwError('New password must be at least 8 characters'); return }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
    setPwError('')
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Appearance */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Globe size={16} className="text-brand-400" />
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => updateTheme(t)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all capitalize',
                    user.theme === t
                      ? 'border-brand-500/40 bg-brand-500/10 text-white'
                      : 'border-white/8 text-surface-400 hover:border-white/15 hover:text-white'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    t === 'dark' ? 'bg-surface-900 border border-white/10' : 'bg-white/90 border border-black/10'
                  )}>
                    <div className={cn('w-3 h-3 rounded-full', t === 'dark' ? 'bg-white/20' : 'bg-black/20')} />
                  </div>
                  {t} mode
                  {user.theme === t && (
                    <Check size={14} className="ml-auto text-brand-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Editor font size</label>
            <select className="input-field w-48 cursor-pointer">
              {[12, 13, 14, 15, 16, 18].map(s => (
                <option key={s} value={s}>{s}px {s === 14 && '(default)'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Lock size={16} className="text-brand-400" />
          Password & Security
        </h3>
        <div className="space-y-4 max-w-md">
          {[
            { label: 'Current Password', value: currentPassword, set: setCurrentPassword, placeholder: '••••••••' },
            { label: 'New Password',     value: newPassword,     set: setNewPassword,     placeholder: 'Min. 8 characters' },
            { label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword, placeholder: 'Repeat new password' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">{label}</label>
              <input
                type="password"
                className="input-field"
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}

          {pwError && (
            <div className="flex items-center gap-2 text-rose-400 text-sm">
              <AlertCircle size={14} /> {pwError}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button onClick={savePassword} className="btn-primary">
              <Shield size={15} /> Update Password
            </button>
            <SaveToast show={saved} />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
        <h3 className="font-bold text-rose-400 mb-1">Danger Zone</h3>
        <p className="text-sm text-surface-400 mb-4">
          These actions are permanent and cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/10 transition-colors">
            Reset Progress
          </button>
          <button className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/10 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Notifications tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const { user, updateNotifications } = useUserStore()
  const notifs = user.notifications
  const [saved, setSaved] = useState(false)

  function toggle(key: keyof typeof notifs) {
    updateNotifications({ [key]: !notifs[key] })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const items = [
    {
      key: 'streakReminders' as const,
      icon: Flame,
      title: 'Streak Reminders',
      desc: 'Daily nudge to keep your streak alive',
      color: 'text-amber-400',
    },
    {
      key: 'newChallenges' as const,
      icon: Target,
      title: 'New Challenges',
      desc: 'Get notified when new exercises are added',
      color: 'text-brand-400',
    },
    {
      key: 'mentorReplies' as const,
      icon: Code2,
      title: 'AI Mentor Replies',
      desc: 'When your AI Mentor has something to say',
      color: 'text-cyan-400',
    },
    {
      key: 'weeklyReport' as const,
      icon: BookOpen,
      title: 'Weekly Progress Report',
      desc: 'Summary of your week sent every Sunday',
      color: 'text-emerald-400',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="p-6 rounded-2xl glass border border-white/8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold flex items-center gap-2">
            <Bell size={16} className="text-brand-400" />
            Notification Preferences
          </h3>
          <SaveToast show={saved} />
        </div>

        <div className="space-y-1">
          {items.map(({ key, icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/3 transition-colors"
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                notifs[key] ? 'bg-brand-500/15 border border-brand-500/20' : 'bg-surface-800 border border-white/5'
              )}>
                <Icon size={18} className={notifs[key] ? color : 'text-surface-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{title}</div>
                <div className="text-xs text-surface-400 mt-0.5">{desc}</div>
              </div>
              <Toggle checked={notifs[key]} onChange={() => toggle(key)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unread inbox */}
      <div className="p-6 rounded-2xl glass border border-white/8">
        <h3 className="font-bold mb-4">Recent Notifications</h3>
        <div className="space-y-2">
          {[
            { icon: '🔥', title: 'Streak milestone!', body: 'You\'ve reached a 7-day streak. Keep it up!', time: '2h ago', unread: true },
            { icon: '🏅', title: 'Badge earned',       body: 'You earned the "Week Warrior" badge.',          time: '2d ago', unread: true },
            { icon: '⚡', title: 'New challenge',      body: 'Try the new "Linked List Reversal" problem.',   time: '3d ago', unread: true },
            { icon: '📊', title: 'Weekly report',      body: 'You solved 8 problems this week. Great work!',  time: '7d ago', unread: false },
          ].map((n, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-3.5 rounded-xl transition-colors',
                n.unread ? 'bg-brand-500/8 border border-brand-500/15' : 'hover:bg-white/3'
              )}
            >
              <div className="text-2xl flex-shrink-0 mt-0.5">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{n.title}</span>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-surface-400 mt-0.5">{n.body}</p>
                <p className="text-xs text-surface-600 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'profile'

  function setTab(t: string) {
    setSearchParams({ tab: t })
  }

  const tabContent: Record<string, React.ReactNode> = {
    profile:       <ProfileTab />,
    badges:        <BadgesTab />,
    settings:      <SettingsTab />,
    notifications: <NotificationsTab />,
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <h1 className="text-3xl font-display font-bold">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-surface-400 mt-1">Manage your account, track achievements, and customize preferences</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar tabs */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-52 flex-shrink-0"
          >
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all text-left w-full',
                    tab === id
                      ? 'bg-brand-500/15 border border-brand-500/25 text-white'
                      : 'text-surface-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={16} />
                  {label}
                  {id === 'notifications' && (
                    <span className="ml-auto text-xs bg-brand-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      3
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tabContent[tab] ?? <ProfileTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
