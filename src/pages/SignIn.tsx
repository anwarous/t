import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store'

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
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('signin.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(26,92,255,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-strong rounded-2xl border border-white/10 p-8 shadow-card-hover">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-glow-blue">
              <span className="font-display font-bold text-white text-sm select-none">MQ</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              MQ<span className="gradient-text">Academy</span>
            </span>
          </div>

          <h1 className="text-2xl font-display font-bold text-center mb-1">{t('signin.title')}</h1>
          <p className="text-surface-400 text-sm text-center mb-8">{t('signin.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username or email */}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-surface-300 mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl bg-surface-900/60 border border-white/10 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-surface-300">
                  {t('signin.password')}
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-surface-900/60 border border-white/10 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                  aria-label={showPassword ? t('signin.hidePassword') : t('signin.showPassword')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signin.loading')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  {t('signin.submit')}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-surface-500">{t('signin.or')}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-surface-400">
            {t('signin.noAccount')}{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              {t('signin.createFree')}
            </Link>
          </p>
        </div>

        {/* Feature hint */}
        <div className="flex items-center justify-center gap-5 mt-6 text-xs text-surface-500">
          {[t('signin.features.algorithms'), t('signin.features.mentor'), t('signin.features.free')].map((item) => (
            <span key={item} className="flex items-center gap-1">
              <Zap size={10} className="text-brand-400" />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
