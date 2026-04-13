import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, PawPrint } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useUserStore } from '@/store'

type Pet = {
  id: string
  icon?: string
  lottieSrc?: string
  nameKey: string
  requirementKey: string
  isUnlocked: (ctx: { level: number; streak: number; solved: number; earnedBadges: number }) => boolean
}

const PETS: Pet[] = [
  {
    id: 'pet-caracter',
    lottieSrc: 'https://lottie.host/c62b0afb-22ca-48be-974f-b061e671f5a2/P4fNzo7YQL.lottie',
    nameKey: 'collection.pets.caracter.name',
    requirementKey: 'collection.pets.caracter.requirement',
    isUnlocked: ({ streak }) => streak >= 1,
  },
  {
    id: 'pet-caracter-2',
    lottieSrc: 'https://lottie.host/d5f5b742-750a-43b8-a339-6e80059a344b/UfFf4hIllR.lottie',
    nameKey: 'collection.pets.caracter2.name',
    requirementKey: 'collection.pets.caracter2.requirement',
    isUnlocked: ({ streak }) => streak >= 1,
  },
  {
    id: 'pet-caracter-3',
    lottieSrc: 'https://lottie.host/bdcdb140-851b-4545-b69b-ea076668764c/2Nekh5M3Sr.lottie',
    nameKey: 'collection.pets.caracter3.name',
    requirementKey: 'collection.pets.caracter3.requirement',
    isUnlocked: ({ streak }) => streak >= 1,
  },
  {
    id: 'pet-caracter-4',
    lottieSrc: 'https://lottie.host/7ad5bf32-c32a-4b64-837d-70a668bd7d7b/6a7DoBKL93.lottie',
    nameKey: 'collection.pets.caracter4.name',
    requirementKey: 'collection.pets.caracter4.requirement',
    isUnlocked: ({ streak }) => streak >= 1,
  },
  {
    id: 'pet-caracter-5',
    lottieSrc: 'https://lottie.host/7456a036-cd8a-498f-80d0-1874467ec611/Mrs62RRPcC.lottie',
    nameKey: 'collection.pets.caracter5.name',
    requirementKey: 'collection.pets.caracter5.requirement',
    isUnlocked: ({ streak }) => streak >= 1,
  },
  {
    id: 'pet-fox',
    icon: '🦊',
    nameKey: 'collection.pets.fox.name',
    requirementKey: 'collection.pets.fox.requirement',
    isUnlocked: ({ level }) => level >= 5,
  },
  {
    id: 'pet-owl',
    icon: '🦉',
    nameKey: 'collection.pets.owl.name',
    requirementKey: 'collection.pets.owl.requirement',
    isUnlocked: ({ earnedBadges }) => earnedBadges >= 3,
  },
  {
    id: 'pet-dragon',
    icon: '🐉',
    nameKey: 'collection.pets.dragon.name',
    requirementKey: 'collection.pets.dragon.requirement',
    isUnlocked: ({ solved }) => solved >= 25,
  },
  {
    id: 'pet-phoenix',
    icon: '🔥',
    nameKey: 'collection.pets.phoenix.name',
    requirementKey: 'collection.pets.phoenix.requirement',
    isUnlocked: ({ streak }) => streak >= 14,
  },
]

export default function CollectionPage() {
  const { t } = useTranslation()
  const { user, badges } = useUserStore()
  const [selectedPetId, setSelectedPetId] = useLocalStorage<string | null>(
    `collection:selected-caracter:${user.name}`,
    null
  )

  const earnedBadges = useMemo(() => badges.filter((b) => b.earned), [badges])
  const unlockedPets = useMemo(() => {
    const ctx = {
      level: user.level,
      streak: user.streak,
      solved: user.totalSolved,
      earnedBadges: earnedBadges.length,
    }
    return PETS.filter((pet) => pet.isUnlocked(ctx))
  }, [earnedBadges.length, user.level, user.streak, user.totalSolved])

  useEffect(() => {
    if (!selectedPetId) return
    const stillUnlocked = unlockedPets.some((pet) => pet.id === selectedPetId)
    if (!stillUnlocked) {
      setSelectedPetId(null)
    }
  }, [selectedPetId, setSelectedPetId, unlockedPets])

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold">{t('collection.title')}</h1>
          <p className="text-surface-400 mt-2">{t('collection.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-surface-900/40 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-surface-200">
                <Trophy size={16} />
                <h2 className="font-semibold">{t('collection.badgesTitle')}</h2>
              </div>
              <span className="text-xs text-surface-500">{earnedBadges.length} / {badges.length}</span>
            </div>

            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-sm font-medium text-surface-100">{badge.name}</div>
                    <div className="text-[11px] text-surface-500 capitalize">{badge.rarity}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-500">{t('collection.emptyBadges')}</p>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-surface-900/40 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-surface-200">
                <PawPrint size={16} />
                <h2 className="font-semibold">{t('collection.petsTitle')}</h2>
              </div>
              <span className="text-xs text-surface-500">{unlockedPets.length} / {PETS.length}</span>
            </div>

            {unlockedPets.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {unlockedPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="rounded-xl border p-3 transition-colors"
                    style={{
                      borderColor: selectedPetId === pet.id ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.25)',
                      background: selectedPetId === pet.id ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)',
                    }}
                  >
                    {pet.lottieSrc ? (
                      <div className="h-32 w-32 mx-auto mb-2 bg-transparent" style={{ background: 'transparent' }}>
                        <DotLottieReact
                          src={pet.lottieSrc}
                          autoplay
                          loop
                          style={{ width: '100%', height: '100%', background: 'transparent' }}
                        />
                      </div>
                    ) : (
                      <div className="text-2xl mb-1">{pet.icon}</div>
                    )}
                    <div className="text-sm font-medium text-surface-100">{t(pet.nameKey)}</div>
                    <div className="text-[11px] text-surface-500">{t(pet.requirementKey)}</div>
                    <button
                      type="button"
                      className="mt-2 rounded-md border border-white/15 px-2 py-1 text-[11px] text-surface-200 hover:border-white/30"
                      onClick={() => setSelectedPetId((prev) => (prev === pet.id ? null : pet.id))}
                    >
                      {selectedPetId === pet.id ? t('collection.unselectPet') : t('collection.selectPet')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-500">{t('collection.emptyPets')}</p>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  )
}
