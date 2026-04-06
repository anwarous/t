import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Code2, Terminal, Flame, Zap } from 'lucide-react'
import { useUserStore } from '@/store'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/editor',     label: 'Challenges',  icon: Code2 },
  { to: '/sandbox',    label: 'Sandbox',     icon: Terminal },
]

export default function CodeModeNav() {
  const location = useLocation()
  const { user } = useUserStore()

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-5 border-b border-white/5"
      style={{ background: 'rgba(13,15,20,0.90)', backdropFilter: 'blur(14px)' }}
    >
      {/* Brand */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 select-none"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
          Learning++
        </span>
      </Link>

      {/* 3 navigation items */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'text-white bg-white/8 border border-white/10'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User stats */}
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-amber-400">
          <Flame size={13} /> {user.streak}
        </span>
        <span className="flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
          <Zap size={13} /> {user.xp} XP
        </span>
      </div>
    </header>
  )
}
