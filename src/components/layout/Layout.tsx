import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore, applyTheme } from '@/store'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import CodeModeNav from './CodeModeNav'

const PUBLIC_PATHS = ['/', '/signin', '/signup']
const CODE_PATHS   = ['/editor']

export default function Layout() {
  const location = useLocation()
  const isPublic = PUBLIC_PATHS.includes(location.pathname)
  const isCode   = CODE_PATHS.some(p => location.pathname.startsWith(p))
  const { user } = useUserStore()

  useEffect(() => {
    applyTheme(user.theme)
  }, [user.theme])

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
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    )
  }

  // ── Code mode: no sidebar, compact 3-item top nav ───────────────────────
  if (isCode) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div
          className="fixed inset-0 pointer-events-none bg-grid-pattern"
          style={{ opacity: 0.3 }}
        />
        <CodeModeNav />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="pt-14 min-h-screen overflow-x-hidden"
        >
          <div className="relative">
            <Outlet />
          </div>
        </motion.main>
      </div>
    )
  }

  // ── App layout: fixed sidebar + scrollable main ─────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />

      {/* Main content area: offset by sidebar width on md+ */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex-1 min-h-screen md:ml-[220px] pt-14 md:pt-0 overflow-x-hidden"
      >
        {/* Subtle background grid for app pages */}
        <div
          className="fixed inset-0 pointer-events-none bg-grid-pattern"
          style={{ opacity: 0.3 }}
        />
        <div className="relative">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
