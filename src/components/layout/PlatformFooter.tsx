import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { useTranslation } from 'react-i18next'

type FooterLink = {
  to: string
  labelKey: string
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

const LINKS: FooterLink[] = [
  { to: '/', labelKey: 'platformFooter.links.home' },
  { to: '/dashboard', labelKey: 'platformFooter.links.dashboard', requiresAuth: true },
  { to: '/learn', labelKey: 'platformFooter.links.learn', requiresAuth: true },
  { to: '/editor', labelKey: 'platformFooter.links.codeEditor', requiresAuth: true },
  { to: '/visualize', labelKey: 'platformFooter.links.visualization', requiresAuth: true },
  { to: '/mentor', labelKey: 'platformFooter.links.mentor', requiresAuth: true },
  { to: '/collection', labelKey: 'platformFooter.links.collection', requiresAuth: true },
  { to: '/profile', labelKey: 'platformFooter.links.profile', requiresAuth: true },
  { to: '/sandbox', labelKey: 'platformFooter.links.sandbox', requiresAuth: true },
  { to: '/admin', labelKey: 'platformFooter.links.admin', requiresAuth: true, requiresAdmin: true },
]

export default function PlatformFooter() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authUser = useAuthStore((s) => s.authUser)
  const isAdmin = authUser?.email === 'admin@admin.admin'

  const visibleLinks = LINKS.filter((link) => {
    if (link.requiresAuth && !isAuthenticated) return false
    if (link.requiresAdmin && !isAdmin) return false
    return true
  })

  return (
    <footer className="mt-12 border-t border-white/10 bg-gradient-to-b from-surface-900/40 to-surface-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-5 text-sm">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-6 py-3 text-center rounded-2xl border border-white/10 bg-white/[0.03] text-surface-300 hover:text-white hover:border-brand-400/35 hover:bg-brand-500/10 transition-all duration-200"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-surface-500">© {new Date().getFullYear()} {t('platformFooter.brand')}</p>
      </div>
    </footer>
  )
}
