import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  type: 'xp' | 'badge' | 'streak'
  message: string
  value?: number
}

let toastQueue: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>()

export function showToast(toast: Omit<Toast, 'id'>) {
  const newToast = { ...toast, id: Date.now().toString() }
  toastQueue = [...toastQueue, newToast]
  listeners.forEach(l => l([...toastQueue]))

  const existing = toastTimers.get(newToast.id)
  if (existing) clearTimeout(existing)

  const timeoutId = setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== newToast.id)
    toastTimers.delete(newToast.id)
    listeners.forEach(l => l([...toastQueue]))
  }, 3000)
  toastTimers.set(newToast.id, timeoutId)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast[]) => setToasts(t)
    listeners.push(listener)
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  const config = {
    xp: {
      icon: '✦',
      color: 'var(--color-accent)',
      bg: 'rgba(0,245,212,0.08)',
      border: 'rgba(0,245,212,0.25)',
      glow: 'rgba(0,245,212,0.2)',
      label: 'XP EARNED',
    },
    badge: {
      icon: '◆',
      color: 'var(--color-xp)',
      bg: 'rgba(240,160,48,0.08)',
      border: 'rgba(240,160,48,0.25)',
      glow: 'rgba(240,160,48,0.2)',
      label: 'BADGE UNLOCKED',
    },
    streak: {
      icon: '⟡',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      border: 'rgba(249,115,22,0.25)',
      glow: 'rgba(249,115,22,0.2)',
      label: 'STREAK ACTIVE',
    },
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const c = config[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{  opacity: 0, y: 16, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              role="status"
              aria-atomic="true"
              className="flex items-center gap-3 px-4 py-3 rounded-lg reward-pop"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                boxShadow: `0 0 20px ${c.glow}, 0 8px 30px rgba(0,0,0,0.4)`,
                backdropFilter: 'blur(12px)',
                minWidth: '220px',
              }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}18`, border: `1px solid ${c.border}` }}
              >
                <span style={{ color: c.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', lineHeight: 1 }}>{c.icon}</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[9px] font-semibold tracking-widest mb-0.5"
                  style={{ color: c.color, fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {c.label}
                </div>
                <div
                  className="text-xs font-semibold truncate"
                  style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {toast.message}
                </div>
                {toast.value !== undefined && (
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: c.color, fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    +{toast.value}{toast.type === 'xp' ? ' XP' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
