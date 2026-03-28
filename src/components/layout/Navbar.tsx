import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Code2, GitBranch, BookOpen, Brain, Terminal,
  Menu, X, Zap, Flame, User, Settings, LogOut,
  Trophy, ChevronDown, Bell
} from 'lucide-react'
import { useUserStore } from '@/store'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

// ── Language Switcher ──────────────────────────────────────────────────────────
function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')

  return (
    <button
      onClick={() => i18n.changeLanguage(isEn ? 'fr' : 'en')}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-semibold text-surface-300 select-none"
      title={isEn ? 'Switch to French' : 'Passer en anglais'}
    >
      <span className="text-sm">{isEn ? '🇫🇷' : '🇬🇧'}</span>
      <span>{isEn ? 'FR' : 'EN'}</span>
    </button>
  )
}

// ── Avatar dropdown ───────────────────────────────────────────────────────────
function AvatarDropdown({ onClose }: { onClose: () => void }) {
  const { user } = useUserStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const go = (path: string) => { navigate(path); onClose() }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl glass-strong border border-white/10 shadow-card-hover overflow-hidden z-50"
    >
      {/* User info header */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-surface-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 flex flex-col items-center py-2 rounded-xl bg-brand-500/10 border border-brand-500/15">
            <span className="text-base font-bold text-brand-300">{user.xp.toLocaleString()}</span>
            <span className="text-[10px] text-surface-500 mt-0.5">{t('nav.xp')}</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-2 rounded-xl bg-amber-500/10 border border-amber-500/15">
            <span className="text-base font-bold text-amber-300">{user.streak}</span>
            <span className="text-[10px] text-surface-500 mt-0.5">Streak</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
            <span className="text-base font-bold text-emerald-300">{user.totalSolved}</span>
            <span className="text-[10px] text-surface-500 mt-0.5">Solved</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2">
        {[
          { icon: User,     label: t('nav.myProfile'),    sub: t('nav.myProfileSub'),   path: '/profile' },
          { icon: Trophy,   label: t('nav.achievements'), sub: t('nav.achievementsSub'), path: '/profile?tab=badges' },
          { icon: Settings, label: t('nav.settings'),     sub: t('nav.settingsSub'),    path: '/profile?tab=settings' },
          { icon: Bell,     label: t('nav.notifications'), sub: t('nav.notificationsSub', { count: 3 }), path: '/profile?tab=notifications' },
        ].map(({ icon: Icon, label, sub, path }) => (
          <button
            key={label}
            onClick={() => go(path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/15 transition-colors">
              <Icon size={15} className="text-surface-400 group-hover:text-white transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-none mb-0.5">{label}</p>
              <p className="text-xs text-surface-500 truncate">{sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-white/8">
        <button
          onClick={() => go('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-rose-500/30 transition-colors">
            <LogOut size={15} className="text-surface-400 group-hover:text-rose-400 transition-colors" />
          </div>
          <p className="text-sm font-medium group-hover:text-rose-400 transition-colors">{t('nav.signOut')}</p>
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const location  = useLocation()
  const { user }  = useUserStore()
  const { t }     = useTranslation()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLanding = location.pathname === '/'

  const NAV_ITEMS = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/learn',     label: t('nav.learn'),     icon: BookOpen },
    { to: '/editor',    label: t('nav.code'),      icon: Code2 },
    { to: '/sandbox',   label: t('nav.sandbox'),   icon: Terminal },
    { to: '/visualize', label: t('nav.visualize'), icon: GitBranch },
    { to: '/mentor',    label: t('nav.aiMentor'),  icon: Brain },
  ]

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding ? 'bg-transparent' : 'glass-strong border-b border-white/5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-glow-blue">
              <span className="font-display font-bold text-white text-sm select-none">MQ</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              MQ<span className="gradient-text">Academy</span>
            </span>
          </Link>



          {/* ── Right side ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">

            {/* Language switcher (always visible) */}
            <LanguageSwitcher />

            {isLanding ? (
              /* Landing CTAs */
              <>
                <Link to="/dashboard" className="btn-ghost hidden sm:flex text-sm py-2 px-4">
                  {t('nav.signIn')}
                </Link>
                <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
                  {t('nav.startLearning')}
                </Link>
              </>
            ) : (
              /* App: XP + streak pills + avatar */
              <>
                <div className="hidden sm:flex items-center gap-2">
                  {/* XP pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 select-none">
                    <Zap size={12} className="text-accent-cyan" />
                    {user.xp.toLocaleString()} {t('nav.xp')}
                  </div>
                  {/* Streak pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 select-none">
                    <Flame size={12} className="text-amber-400" />
                    {user.streak} {t('nav.streak')}
                  </div>
                </div>

                {/* Avatar + dropdown trigger */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className={cn(
                      'flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 rounded-full border transition-all duration-200',
                      dropdownOpen
                        ? 'border-brand-500/50 bg-brand-500/10'
                        : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-xs font-bold shadow-glow-blue">
                      {user.avatar}
                    </div>
                    <ChevronDown
                      size={13}
                      className={cn(
                        'text-surface-400 transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <AvatarDropdown onClose={() => setDropdownOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Menu toggle (not on landing) */}
            {!isLanding && (
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen
                    ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X    size={20} /></motion.span>
                    : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
                  }
                </AnimatePresence>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && !isLanding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const active = to === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'text-white bg-brand-500/15 border border-brand-500/20'
                        : 'text-surface-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
                    )}
                  </Link>
                )
              })}

              {/* Profile row in mobile */}
              <Link
                to="/profile"
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                  location.pathname === '/profile'
                    ? 'text-white bg-brand-500/15 border border-brand-500/20'
                    : 'text-surface-400 hover:text-white hover:bg-white/5'
                )}
              >
                <User size={16} />
                {t('nav.profile')}
              </Link>

              {/* Mobile mini-stats */}
              <div className="flex gap-2 pt-2 pb-1">
                <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/15">
                  <Zap size={12} className="text-accent-cyan" />
                  <span className="text-xs font-semibold text-brand-300">{user.xp.toLocaleString()} {t('nav.xp')}</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/15">
                  <Flame size={12} className="text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">{user.streak} {t('nav.streak')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
