import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '../button/button'

export interface SegmentedToggleOption<Value extends string> {
  value: Value
  label: string
  content: ReactNode
}

interface SegmentedToggleProps<Value extends string> {
  value: Value
  options: readonly SegmentedToggleOption<Value>[]
  onValueChange: (value: Value) => void
  label?: string
  className?: string
}

export function SegmentedToggle<Value extends string>({
  value,
  options,
  onValueChange,
  label,
  className,
}: SegmentedToggleProps<Value>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      data-theme-transition
      role={label ? 'group' : undefined}
      aria-label={label}
      className={cn(
        'h-12 gap-3 border-border bg-card px-1 relative inline-flex w-fit shrink-0 items-center rounded-full border',
        className,
      )}
    >
      <span
        data-segmented-indicator
        aria-hidden="true"
        className="bg-muted top-1 left-1 size-10 ease-out pointer-events-none absolute rounded-full transition-[transform,background-color] duration-200 motion-reduce:transition-none"
        style={{ transform: `translateX(${selectedIndex * 52}px)` }}
      />
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          size="icon-m"
          className={cn('size-10 p-0 text-primary relative z-10 rounded-full')}
          aria-label={option.label}
          aria-pressed={value === option.value}
          onClick={() => onValueChange(option.value)}
        >
          {option.content}
        </Button>
      ))}
    </div>
  )
}
