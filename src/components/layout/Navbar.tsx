import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

// ── Public-only top navbar (landing, sign-in, sign-up) ────────────────────
export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: 'rgba(13,15,20,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div
          className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(109,255,26,0.22)',
            boxShadow: '0 0 12px var(--color-accent-glow)',
          }}
        >
          <img
            src="/logo.png"
            alt="Learning++ logo"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            style={{ transform: 'scale(1.85)' }}
          />
        </div>
        <span
          className="font-bold text-base"
          style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
        >
          Learning<span className="gradient-text">++</span>
        </span>
      </Link>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <LanguageSwitcher />
        <Link
          to="/signin"
          className="btn-ghost text-xs py-2 px-4 hidden sm:flex"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {t('nav.signIn')}
        </Link>
        <Link
          to="/signup"
          className="btn-primary text-xs py-2 px-4"
        >
          {t('nav.startLearning')}
        </Link>
      </div>
    </header>
  )
}
