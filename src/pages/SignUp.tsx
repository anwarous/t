import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store'

export default function SignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.register({ username, email, password, displayName: displayName.trim() || undefined })
      setAuth(res.token, {
        username: res.username,
        email: res.email,
        displayName: res.displayName,
      })
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('signup.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ paddingTop: 'calc(56px + 2rem)', paddingBottom: '2rem' }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%', right: '10%',
          width: '35vw', height: '35vw',
          background: 'radial-gradient(ellipse, rgba(0,245,212,0.04) 0%, transparent 65%)',
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

          <div className="mb-8">
            <h1
              className="text-xl font-bold text-center mb-1"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              {t('signup.title')}
            </h1>
            <p
              className="text-xs text-center"
              style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {t('signup.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Display name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('signup.displayName')}{' '}
                <span style={{ color: 'var(--color-text-faint)' }}>{t('signup.optional')}</span>
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Chen"
                className="input-field"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('signup.username')}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alexchen"
                className="input-field"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {t('signup.email')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
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
                {t('signup.password')}{' '}
                <span style={{ color: 'var(--color-text-faint)' }}>{t('signup.minChars')}</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            {/* Perks */}
            <div
              className="space-y-1.5 py-3 px-3 rounded"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {[t('signup.perks.free'), t('signup.perks.access'), t('signup.perks.mentor')].map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-2 text-[11px]"
                  style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  <CheckCircle size={11} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                  {perk}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-label={t('signup.submit')}
              className="btn-primary w-full justify-center py-3 text-sm"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(10,18,14,0.3)', borderTopColor: '#0a120e' }} />
                  {t('signup.loading')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={15} />
                  {t('signup.submit')}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('signup.hasAccount')}
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <Link
            to="/signin"
            className="btn-ghost w-full justify-center py-2.5 text-xs"
          >
            {t('signup.signIn')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
