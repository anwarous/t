import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Code2, GitBranch, BookOpen, Brain, Terminal,
  User, LogOut, Settings, Trophy, Bell, Flame, Zap, Menu, X, ChevronDown
} from 'lucide-react'
import { useUserStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

// ── XP Progress ring (SVG) ─────────────────────────────────────────────────
function XPRing({ progress }: { progress: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      {/* Track */}
      <circle
        cx="22" cy="22" r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="3"
      />
      {/* Fill */}
      <circle
        cx="22" cy="22" r={r}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
        style={{
          filter: 'drop-shadow(0 0 4px var(--color-accent))',
          transition: 'stroke-dashoffset 0.8s ease-out',
        }}
      />
    </svg>
  )
}

// ── User footer card ────────────────────────────────────────────────────────
function SidebarFooter({ onAvatarClick }: { onAvatarClick: () => void }) {
  const { user } = useUserStore()
  const xpToNext = 60
  const xpProgress = Math.min(100, (user.xp / xpToNext) * 100)

  return (
    <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* XP bar row */}
      <div className="mb-3 px-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
            LVL {user.level}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {user.xp.toLocaleString()} <span style={{ color: 'var(--color-text-faint)' }}>/ {xpToNext.toLocaleString()}</span>
          </span>
        </div>
        <div className="progress-bar h-1">
          <div
            className="progress-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Avatar row */}
      <button
        onClick={onAvatarClick}
        aria-label="Open user menu"
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-150 hover:bg-white/5 group"
      >
        <div className="relative flex-shrink-0">
          <XPRing progress={xpProgress} />
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-bold select-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {user.avatar}
          </div>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs font-semibold truncate" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)' }}>
            {user.name}
          </div>
          <div className="text-[10px] truncate" style={{ color: 'var(--color-text-faint)' }}>
            {user.rank}
          </div>
        </div>
        <ChevronDown size={13} className="flex-shrink-0 text-surface-500 group-hover:text-surface-300 transition-colors" />
      </button>
    </div>
  )
}

// ── Avatar dropdown ─────────────────────────────────────────────────────────
function AvatarDropdown({ onClose }: { onClose: () => void }) {
  const { user } = useUserStore()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const go = (path: string) => { navigate(path); onClose() }
  const handleSignOut = () => { clearAuth(); navigate('/'); onClose() }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute bottom-full left-3 right-3 mb-2 rounded-xl glass-strong border overflow-hidden z-50"
      style={{ borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 -8px 30px rgba(0,0,0,0.4)' }}
    >
      {/* Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {user.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-mid)' }}>{user.email}</p>
          </div>
        </div>
        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { val: user.xp.toLocaleString(), lbl: t('nav.xp'), accent: 'var(--color-accent)' },
            { val: user.streak,              lbl: 'Streak',    accent: 'var(--color-xp)' },
            { val: user.totalSolved,         lbl: 'Solved',    accent: '#4ade80' },
          ].map(({ val, lbl, accent }) => (
            <div
              key={lbl}
              className="flex flex-col items-center py-1.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-sm font-bold" style={{ color: accent, fontFamily: 'Space Grotesk, sans-serif' }}>{val}</span>
              <span className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="p-1.5">
        {[
          { icon: User,     label: t('nav.myProfile'),     path: '/profile' },
          { icon: Trophy,   label: t('nav.achievements'),  path: '/profile?tab=badges' },
          { icon: Settings, label: t('nav.settings'),      path: '/profile?tab=settings' },
          { icon: Bell,     label: t('nav.notifications'), path: '/profile?tab=notifications' },
        ].map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => go(path)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            <Icon size={14} style={{ color: 'var(--color-text-mid)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace' }}>{label}</span>
          </button>
        ))}
      </div>

      <div className="p-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors text-left group"
        >
          <LogOut size={14} className="group-hover:text-rose-400 transition-colors" style={{ color: 'var(--color-text-mid)' }} />
          <span className="text-xs group-hover:text-rose-400 transition-colors" style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {t('nav.signOut')}
          </span>
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Sidebar ────────────────────────────────────────────────────────────
export default function Sidebar() {
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const { user } = useUserStore()
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/learn',     label: t('nav.learn'),     icon: BookOpen },
    { to: '/editor',    label: t('nav.code'),      icon: Code2 },
    { to: '/sandbox',   label: t('nav.sandbox'),   icon: Terminal },
    { to: '/visualize', label: t('nav.visualize'), icon: GitBranch },
    { to: '/mentor',    label: t('nav.aiMentor'),  icon: Brain },
    { to: '/profile',   label: t('nav.profile'),   icon: User },
  ]

  const isActive = (to: string) =>
    to === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col"
        style={{
          width: '220px',
          background: 'var(--color-surface)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 select-none"
              style={{
                background: 'var(--color-accent)',
                color: '#0a120e',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 0 12px var(--color-accent-glow)',
              }}
            >
              L+
            </div>
            <span
              className="font-bold text-base leading-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              Learning<span className="gradient-text">++</span>
            </span>
          </Link>
        </div>

        {/* Stats pills */}
        <div className="px-3 py-3 flex gap-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium flex-1 justify-center"
            style={{ background: 'var(--color-accent-dim)', border: '1px solid rgba(0,245,212,0.15)', color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <Zap size={10} />
            {user.xp.toLocaleString()}
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium flex-1 justify-center"
            style={{ background: 'var(--color-xp-dim)', border: '1px solid rgba(240,160,48,0.15)', color: 'var(--color-xp)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <Flame size={10} />
            {user.streak}d
          </div>
          <div className="flex-shrink-0">
            <LanguageSwitcher compact />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 relative group',
                  active
                    ? 'text-white'
                    : 'hover:text-white'
                )}
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: active ? '#fff' : 'var(--color-text-mid)',
                  background: active ? 'var(--color-accent-dim)' : 'transparent',
                  borderLeft: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                  boxShadow: active ? 'inset 0 0 12px rgba(0,245,212,0.05)' : 'none',
                }}
              >
                <Icon
                  size={15}
                  style={{ color: active ? 'var(--color-accent)' : 'currentColor', flexShrink: 0 }}
                />
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px var(--color-accent)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="relative">
          <AnimatePresence>
            {dropdownOpen && <AvatarDropdown onClose={() => setDropdownOpen(false)} />}
          </AnimatePresence>
          <SidebarFooter onAvatarClick={() => setDropdownOpen(v => !v)} />
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold select-none"
            style={{ background: 'var(--color-accent)', color: '#0a120e', fontFamily: 'Space Grotesk, sans-serif', boxShadow: '0 0 8px var(--color-accent-glow)' }}
          >
            L+
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
            Learning<span className="gradient-text">++</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px]"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <Flame size={9} /> {user.streak}d
          </div>
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: 'var(--color-text-mid)' }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}><X size={18} /></motion.span>
                : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}><Menu size={18} /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden fixed top-14 left-0 bottom-0 z-30 flex flex-col overflow-y-auto"
            style={{ width: '220px', background: 'var(--color-surface)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-2 py-3 space-y-0.5 flex-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const active = isActive(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150"
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      color: active ? '#fff' : 'var(--color-text-mid)',
                      background: active ? 'var(--color-accent-dim)' : 'transparent',
                      borderLeft: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                    }}
                  >
                    <Icon size={15} style={{ color: active ? 'var(--color-accent)' : 'currentColor', flexShrink: 0 }} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-20 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
