import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore, useAuthStore, applyTheme } from '@/store'
import Navbar from './Navbar'
import DashboardTopNav from './DashboardTopNav'
import PlatformFooter from './PlatformFooter'

const PUBLIC_PATHS = ['/', '/signin', '/signup']
const ADMIN_EMAIL = 'admin@admin.admin'

export default function Layout() {
  const location = useLocation()
  const isPublic = PUBLIC_PATHS.includes(location.pathname)
  const authUser = useAuthStore(s => s.authUser)
  const isAdmin = authUser?.email === ADMIN_EMAIL
  const { user } = useUserStore()

  useEffect(() => {
    applyTheme(user.theme)
  }, [user.theme])

  if (isAdmin) {
    if (location.pathname !== '/admin') {
      return <Navigate to="/admin" replace />
    }

    return (
      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <main className="min-h-screen overflow-x-hidden">
          <Outlet />
        </main>
        <PlatformFooter />
      </div>
    )
  }

  if (isPublic) {
    return (
      <div className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
        {/* Subtle grid */}
        <div
          className="fixed inset-0 pointer-events-none bg-grid-pattern"
          style={{ opacity: 0.4 }}
        />
        {/* Ambient glow */}
        <div
          className="fixed top-0 left-1/3 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)' }}
        />

        <Navbar />
        <main>
          <Outlet />
        </main>
        <PlatformFooter />
      </div>
    )
  }

  // ── App layout: dashboard-style top nav for all authenticated pages ──────
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern" style={{ opacity: 0.18 }} />
      <DashboardTopNav />
      <main className="min-h-screen pt-[60px] overflow-x-hidden">
        <div className="relative">
          <Outlet />
        </div>
      </main>
      <PlatformFooter />
    </div>
  )
}
