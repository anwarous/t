import { useMemo, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useUserStore } from '@/store'
import LanguageSwitcher from './LanguageSwitcher'
import { resolveAvatarImage } from '@/lib/profileAvatar'

export default function DashboardTopNav() {
  const location = useLocation()
  const { t } = useTranslation()
  const { user } = useUserStore()
  const authUser = useAuthStore((s) => s.authUser)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const activePath = location.pathname
  const initials = useMemo(() => user.avatar || (authUser?.username?.slice(0, 2).toUpperCase() ?? 'ME'), [authUser?.username, user.avatar])
  const avatarImage = useMemo(() => resolveAvatarImage(user.avatar), [user.avatar])
  const signOut = useCallback(() => {
    clearAuth()
    setMobileOpen(false)
    setProfileMenuOpen(false)
    window.location.replace('/')
  }, [clearAuth])
  const navItems = useMemo(() => [
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/editor', label: t('nav.code') },
    { to: '/sandbox', label: t('nav.sandbox') },
    { to: '/visualize', label: t('nav.visualize') },
    { to: '/mentor', label: t('nav.aiMentor') },
    { to: '/collection', label: t('nav.collection') },
    { to: '/profile', label: t('nav.profile') },
  ], [t])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-white/5"
      style={{
        backgroundColor: 'rgba(10, 12, 16, 0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 24px, rgba(255,255,255,0.03) 24px 25px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(109,255,26,0.22)', boxShadow: '0 0 12px var(--color-accent-glow)' }}>
            <img src="/logo.png" alt={t('nav.dashboard')} width={32} height={32} className="w-full h-full object-contain" style={{ transform: 'scale(1.85)' }} />
          </div>
          <div className="leading-none">
            <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>Learning<span className="gradient-text">++</span></div>
            <div className="text-[10px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>{t('dashboard.goodMorning')}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label }) => {
            const active = activePath === to || (to !== '/dashboard' && activePath.startsWith(to + '/'))
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className="px-3 py-2 rounded-full text-[12px] transition-colors"
                style={{
                  color: active ? 'var(--color-text)' : 'var(--color-text-mid)',
                  background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                  boxShadow: active ? 'inset 0 -2px 0 var(--color-accent)' : 'none',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((value) => !value)}
              className="flex items-center justify-center w-8 h-8 rounded-full border transition-transform"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', transform: 'rotate(-4deg)' }}
              aria-label={t('nav.profile')}
              aria-expanded={profileMenuOpen}
            >
              {avatarImage ? (
                <img src={avatarImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>{initials}</span>
              )}
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-white/8 bg-[rgba(10,12,16,0.98)] p-1 shadow-xl" style={{ boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
                <Link
                  to="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs hover:bg-white/5"
                  style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t('nav.profile')}
                </Link>
                <Link
                  to="/profile?tab=badges"
                  onClick={() => setProfileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs hover:bg-white/5"
                  style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t('nav.achievements')}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-xs hover:bg-rose-500/10"
                  style={{ color: 'var(--color-text)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {t('nav.signOut')}
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
            aria-label="Toggle dashboard menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="relative block w-4 h-3">
              <span className={`absolute left-0 top-0 w-4 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} style={{ color: 'var(--color-text-mid)' }} />
              <span className={`absolute left-0 top-1.5 w-4 h-0.5 bg-current transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} style={{ color: 'var(--color-text-mid)' }} />
              <span className={`absolute left-0 top-3 w-4 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`} style={{ color: 'var(--color-text-mid)' }} />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute inset-x-0 top-[60px] border-b border-white/5 transition-all duration-200 ${mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        style={{ background: 'rgba(10,12,16,0.96)', backdropFilter: 'blur(14px)' }}
      >
        <div className="mx-auto max-w-[1120px] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm"
                style={{
                  background: activePath === to || activePath.startsWith(to + '/') ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--color-text)',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
            <LanguageSwitcher compact />
            <button type="button" onClick={signOut} style={{ color: 'var(--color-text)' }}>{t('nav.signOut')}</button>
          </div>
        </div>
      </div>
    </header>
  )
}