import { useTranslation } from 'react-i18next'

interface Props {
  compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')

  if (compact) {
    return (
      <button
        onClick={() => i18n.changeLanguage(isEn ? 'fr' : 'en')}
        aria-label={isEn ? 'Switch to French' : 'Switch to English'}
        className="flex items-center justify-center w-7 h-7 rounded text-xs hover:bg-white/8 transition-all"
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--color-text-mid)',
          fontFamily: 'IBM Plex Mono, monospace',
        }}
      >
        {isEn ? '🇫🇷' : '🇬🇧'}
      </button>
    )
  }

  return (
    <button
      onClick={() => i18n.changeLanguage(isEn ? 'fr' : 'en')}
      aria-label={isEn ? 'Switch to French' : 'Switch to English'}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-all text-xs font-semibold select-none"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'var(--color-text-mid)',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      <span className="text-sm">{isEn ? '🇫🇷' : '🇬🇧'}</span>
      <span>{isEn ? 'FR' : 'EN'}</span>
    </button>
  )
}
