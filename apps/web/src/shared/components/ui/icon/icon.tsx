import type { LucideIcon, LucideProps } from 'lucide-react'

const sizes = { sm: 16, md: 20, lg: 24 } as const

interface IconProps extends Omit<LucideProps, 'size'> {
  icon: LucideIcon
  size?: keyof typeof sizes
}

export function Icon({ icon: Glyph, size = 'md', strokeWidth = 2, ...props }: IconProps) {
  return <Glyph size={sizes[size]} strokeWidth={strokeWidth} aria-hidden="true" {...props} />
}
