import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { type Badge } from '@/data/mockData'
import { cn, getRarityColor, getRarityGlow } from '@/lib/utils'

interface BadgeCardProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export function BadgeCard({ badge, size = 'md', showDetails = true }: BadgeCardProps) {
  const sizes = {
    sm: { outer: 'w-10 h-10', icon: 'text-xl', container: 'p-3' },
    md: { outer: 'w-14 h-14', icon: 'text-3xl', container: 'p-4' },
    lg: { outer: 'w-20 h-20', icon: 'text-4xl', container: 'p-5' },
  }

  const { outer, icon, container } = sizes[size]

  return (
    <motion.div
      whileHover={badge.earned ? { scale: 1.05 } : {}}
      className={cn(
        'relative flex flex-col items-center gap-3',
        container
      )}
    >
      <div className={cn(
        'relative rounded-2xl flex items-center justify-center transition-all duration-200',
        outer,
        badge.earned
          ? 'bg-surface-800 border border-white/10 ' + getRarityGlow(badge.rarity)
          : 'bg-surface-900 border border-dashed border-white/8 opacity-50'
      )}>
        {badge.earned ? (
          <span className={icon}>{badge.icon}</span>
        ) : (
          <Lock size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} className="text-surface-600" />
        )}

        {badge.earned && (
          <div
            className={cn(
              'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-900 flex items-center justify-center text-[9px]',
              badge.rarity === 'legendary' ? 'bg-amber-500' :
              badge.rarity === 'epic' ? 'bg-purple-500' :
              badge.rarity === 'rare' ? 'bg-brand-500' : 'bg-surface-600'
            )}
          />
        )}
      </div>

      {showDetails && (
        <div className="text-center">
          <div className={cn(
            'text-xs font-semibold',
            badge.earned ? 'text-white' : 'text-surface-600'
          )}>
            {badge.name}
          </div>
          <div className={cn(
            'text-xs capitalize mt-0.5',
            getRarityColor(badge.rarity)
          )}>
            {badge.rarity}
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface BadgeGridProps {
  badges: Badge[]
  columns?: number
}

export function BadgeGrid({ badges, columns = 4 }: BadgeGridProps) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
          title={`${badge.name}: ${badge.description}${badge.earned && badge.earnedAt ? ` (earned ${badge.earnedAt})` : ''}`}
          className="group relative"
        >
          <BadgeCard badge={badge} size="sm" showDetails={false} />

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl glass-strong border border-white/10 text-xs text-center whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 min-w-max">
            <div className="font-semibold text-white">{badge.name}</div>
            <div className="text-surface-400 mt-0.5">{badge.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
