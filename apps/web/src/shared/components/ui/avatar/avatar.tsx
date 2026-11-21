import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from '@/shared/lib/utils'

const sizes = {
  s: 'size-6 text-[10px]',
  m: 'size-8 text-sm',
  l: 'size-10 text-[17px]',
  xl: 'size-12 text-[21px]',
} as const

interface AvatarProps extends Omit<AvatarPrimitive.Root.Props, 'children'> {
  name: string
  size?: keyof typeof sizes
}

export function Avatar({ name, size = 'm', className, ...props }: AvatarProps) {
  const label = name.trim()
  const initial = Array.from(label)[0]?.toLocaleUpperCase() ?? '?'

  return (
    <AvatarPrimitive.Root
      role="img"
      aria-label={label}
      className={cn(
        'bg-accent font-semibold text-accent-foreground inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none',
        sizes[size],
        className,
      )}
      {...props}
    >
      <AvatarPrimitive.Fallback>{initial}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
