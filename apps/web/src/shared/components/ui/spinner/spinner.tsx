import { cn } from '@/shared/lib/utils'

const sizes = {
  16: { stroke: 2, radius: 6.5 },
  24: { stroke: 2.5, radius: 10.25 },
  32: { stroke: 3, radius: 14 },
  40: { stroke: 3.5, radius: 17.75 },
  48: { stroke: 4, radius: 21.5 },
} as const

interface SpinnerProps extends Omit<React.ComponentProps<'svg'>, 'size'> {
  size?: keyof typeof sizes
  label?: string
}

export function Spinner({ size = 24, label, className, ...props }: SpinnerProps) {
  const { stroke, radius } = sizes[size]

  return (
    <svg
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('animate-[spin_900ms_linear_infinite] motion-reduce:animate-none', className)}
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * radius * 0.72} ${2 * Math.PI * radius}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
