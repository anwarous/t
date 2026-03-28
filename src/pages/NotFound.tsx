import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">{t('notFound.title')}</h1>
        <p className="text-surface-400 mb-8 max-w-sm">
          {t('notFound.desc')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-ghost">
            <ArrowLeft size={16} /> {t('notFound.goBack')}
          </Link>
          <Link to="/dashboard" className="btn-primary">
            <Home size={16} /> {t('nav.dashboard')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
