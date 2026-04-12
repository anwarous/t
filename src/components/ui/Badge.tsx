import { motion } from 'framer-motion'
import { type Badge } from '@/data/mockData'
import { cn, getRarityColor } from '@/lib/utils'

interface BadgeCardProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

// Hexagonal clip-path for badge shapes
const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)'

function getRarityAccent(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '#f0a030'
    case 'epic':      return '#a855f7'
    case 'rare':      return 'var(--color-accent)'
    default:          return 'rgba(255,255,255,0.3)'
  }
}

function getRarityGlowVar(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '0 0 16px rgba(240,160,48,0.45)'
    case 'epic':      return '0 0 16px rgba(168,85,247,0.4)'
    case 'rare':      return '0 0 16px rgba(0,245,212,0.35)'
    default:          return 'none'
  }
}

export function BadgeCard({ badge, size = 'md', showDetails = true }: BadgeCardProps) {
  const dims = {
    sm: { w: 40, h: 40, fontSize: 'text-lg', pad: 'p-3' },
    md: { w: 56, h: 56, fontSize: 'text-3xl', pad: 'p-4' },
    lg: { w: 76, h: 76, fontSize: 'text-4xl', pad: 'p-5' },
  }

  const { w, h, fontSize, pad } = dims[size]
  const accent = badge.earned ? getRarityAccent(badge.rarity) : 'rgba(255,255,255,0.1)'
  const glow   = badge.earned ? getRarityGlowVar(badge.rarity) : 'none'

  return (
    <motion.div
      whileHover={badge.earned ? { scale: 1.06 } : {}}
      transition={{ duration: 0.15 }}
      className={cn('relative flex flex-col items-center gap-2.5', pad)}
    >
      {/* Hexagonal badge shape */}
      <div
        style={{
          width: w,
          height: h,
          clipPath: HEX_CLIP,
          background: badge.earned
            ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)`
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${accent}`,
          boxShadow: glow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity: badge.earned ? 1 : 0.4,
        }}
      >
        {badge.earned ? (
          <span className={fontSize}>{badge.icon}</span>
        ) : (
          <span
            style={{
              color: 'var(--color-text-faint)',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: size === 'sm' ? '12px' : size === 'md' ? '15px' : '18px',
              lineHeight: 1,
            }}
          >
            ▣
          </span>
        )}
      </div>

      {/* Rarity dot for earned badges */}
      {badge.earned && (
        <div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
        />
      )}

      {showDetails && (
        <div className="text-center">
          <div
            className={cn('text-xs font-semibold', badge.earned ? 'text-white' : 'text-surface-600')}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {badge.name}
          </div>
          <div
            className={cn('text-[10px] capitalize mt-0.5', getRarityColor(badge.rarity))}
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
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
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
          title={`${badge.name}: ${badge.description}${badge.earned && badge.earnedAt ? ` (earned ${badge.earnedAt})` : ''}`}
          className="group relative"
        >
          <BadgeCard badge={badge} size="sm" showDetails={false} />

          {/* Tooltip */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs text-center whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 min-w-max"
            style={{
              background: 'rgba(13,15,20,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{badge.name}</div>
            <div className="mt-0.5" style={{ color: 'var(--color-text-mid)', fontFamily: 'IBM Plex Mono, monospace' }}>{badge.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
