import icon0 from '../../assetss/icon/_.jpeg'
import icon1 from '../../assetss/icon/_ (1).jpeg'
import icon2 from '../../assetss/icon/_ (2).jpeg'
import icon3 from '../../assetss/icon/_ (3).jpeg'
import icon4 from '../../assetss/icon/_ (4).jpeg'
import icon5 from '../../assetss/icon/_ (5).jpeg'
import icon6 from '../../assetss/icon/_ (6).jpeg'
import icon7 from '../../assetss/icon/_ (7).jpeg'
import icon8 from '../../assetss/icon/_ (8).jpeg'

export type AvatarOption = {
  id: string
  src: string
  label: string
}

const ICON_MAP: Record<string, string> = {
  '0': icon0,
  '1': icon1,
  '2': icon2,
  '3': icon3,
  '4': icon4,
  '5': icon5,
  '6': icon6,
  '7': icon7,
  '8': icon8,
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: '0', src: icon0, label: 'Icon 1' },
  { id: '1', src: icon1, label: 'Icon 2' },
  { id: '2', src: icon2, label: 'Icon 3' },
  { id: '3', src: icon3, label: 'Icon 4' },
  { id: '4', src: icon4, label: 'Icon 5' },
  { id: '5', src: icon5, label: 'Icon 6' },
  { id: '6', src: icon6, label: 'Icon 7' },
  { id: '7', src: icon7, label: 'Icon 8' },
  { id: '8', src: icon8, label: 'Icon 9' },
]

export function isIconAvatar(avatar: string | null | undefined): avatar is string {
  return typeof avatar === 'string' && avatar.startsWith('icon:')
}

export function resolveAvatarImage(avatar: string | null | undefined): string | null {
  if (!isIconAvatar(avatar)) return null
  const id = avatar.slice('icon:'.length)
  return ICON_MAP[id] ?? null
}
