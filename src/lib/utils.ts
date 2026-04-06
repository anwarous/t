import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return xp.toString()
}

export function getLevel(xp: number): number {
  return Math.floor(xp / 250) + 1
}

export function getLevelProgress(xp: number): number {
  return (xp % 250) / 250
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'text-accent-green'
    case 'Medium': return 'text-accent-amber'
    case 'Hard': return 'text-accent-rose'
    default: return 'text-surface-400'
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'Hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    default: return 'bg-surface-700 text-surface-300'
  }
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-surface-300'
    case 'rare': return 'text-brand-400'
    case 'epic': return 'text-purple-400'
    case 'legendary': return 'text-amber-400'
    default: return 'text-surface-400'
  }
}

export function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case 'rare': return 'shadow-glow-blue'
    case 'epic': return 'shadow-glow-purple'
    case 'legendary': return 'shadow-[0_0_20px_rgba(245,158,11,0.4)]'
    default: return ''
  }
}
