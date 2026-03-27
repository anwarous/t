import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trophy, Flame } from 'lucide-react'

interface Toast {
  id: string
  type: 'xp' | 'badge' | 'streak'
  message: string
  value?: number
}

let toastQueue: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

export function showToast(toast: Omit<Toast, 'id'>) {
  const newToast = { ...toast, id: Date.now().toString() }
  toastQueue = [...toastQueue, newToast]
  listeners.forEach(l => l([...toastQueue]))
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== newToast.id)
    listeners.forEach(l => l([...toastQueue]))
  }, 3500)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast[]) => setToasts(t)
    listeners.push(listener)
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  const icons = { xp: Zap, badge: Trophy, streak: Flame }
  const colors = {
    xp: 'from-brand-500/20 to-brand-600/10 border-brand-500/30',
    badge: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    streak: 'from-orange-500/20 to-red-500/10 border-orange-500/30',
  }
  const iconColors = { xp: 'text-brand-400', badge: 'text-amber-400', streak: 'text-orange-400' }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r glass border backdrop-blur-xl shadow-card ${colors[toast.type]}`}
            >
              <div className={`${iconColors[toast.type]}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{toast.message}</div>
                {toast.value && (
                  <div className={`text-xs ${iconColors[toast.type]}`}>
                    +{toast.value} {toast.type === 'xp' ? 'XP' : ''}
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
