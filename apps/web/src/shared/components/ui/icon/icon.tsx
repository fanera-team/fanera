import type { LucideProps } from 'lucide-react'
import { iconMap, type IconName } from './icon-map'

export type { IconName } from './icon-map'

const sizes = { s: 16, m: 20, l: 24 } as const

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName
  size?: keyof typeof sizes
}

export function Icon({ name, size = 'm', strokeWidth = 2, ...props }: IconProps) {
  const Glyph = iconMap[name]
  return <Glyph size={sizes[size]} strokeWidth={strokeWidth} aria-hidden="true" {...props} />
}
