import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Terminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store'

const ADMIN_EMAIL = 'admin@admin.admin'

export default function SignIn() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/dashboard'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ usernameOrEmail, password })
      setAuth(res.token, {
        username: res.username,
        email: res.email,
        displayName: res.displayName,
      })
      navigate(res.email === ADMIN_EMAIL ? '/admin' : from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('signin.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 relative"
      style={{ paddingTop: 'calc(56px + 2rem)' }}
    >
      {/* Background accent glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(0,245,212,0.05) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="p-8"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold select-none"
              style={{
                background: 'var(--color-accent)',
                color: '#0a120e',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 0 14px var(--color-accent-glow)',
              }}
            >
              L+
            </div>
            <span
              className="font-bold text-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              Learning<span className="gradient-text">++</span>
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1
              className="text-xl font-bold text-center mb-1"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              {t('signin.title')}
            </h1>
            <p
              className="text-xs text-center"
              style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {t('signin.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / email */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('signin.usernameOrEmail')}
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                autoComplete="username"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('signin.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  style={{ fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('signin.hidePassword') : t('signin.showPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-text-faint)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-text)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-text-faint)')}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs px-3 py-2.5 rounded"
                style={{
                  color: '#fca5a5',
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-label={t('signin.submit')}
              className="btn-primary w-full justify-center py-3 text-sm"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(10,18,14,0.3)', borderTopColor: '#0a120e' }} />
                  {t('signin.loading')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={15} />
                  {t('signin.submit')}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('signin.or')}
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {t('signin.noAccount')}{' '}
            <Link
              to="/signup"
              className="font-medium transition-colors"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.8')}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
            >
              {t('signin.createFree')}
            </Link>
          </p>
        </div>

        {/* Feature hints */}
        <div className="flex items-center justify-center gap-4 mt-5">
          {[t('signin.features.algorithms'), t('signin.features.mentor'), t('signin.features.free')].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 text-[10px]"
              style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              <Terminal size={9} style={{ color: 'var(--color-accent)' }} />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
