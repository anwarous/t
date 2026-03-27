import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore, applyTheme } from '@/store'
import { motion } from 'framer-motion'
import Navbar from './Navbar'

export default function Layout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const { user } = useUserStore()

  // Apply theme class on <html> whenever user.theme changes
  useEffect(() => {
    applyTheme(user.theme)
  }, [user.theme])


  return (
    <div className="min-h-screen bg-surface-950 relative">
      {/* Global background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow spots */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(26,92,255,0.08) 0%, transparent 70%)' }} />
      <div className="fixed top-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />

      <Navbar />

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={isLanding ? '' : 'pt-16'}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
