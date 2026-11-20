import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface TabsOption<Value extends string> {
  value: Value
  label: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps<Value extends string> {
  value: Value
  options: readonly TabsOption<Value>[]
  onValueChange: (value: Value) => void
  label: string
  className?: string
}

export function Tabs<Value extends string>({
  value,
  options,
  onValueChange,
  label,
  className,
}: TabsProps<Value>) {
  const id = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = options.findIndex((option) => option.value === value)
  const firstEnabledIndex = options.findIndex((option) => !option.disabled)

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabled = options.flatMap((option, optionIndex) => (option.disabled ? [] : [optionIndex]))
    if (enabled.length === 0) return

    const position = enabled.indexOf(index)
    let nextIndex: number

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = enabled[(position + 1) % enabled.length]
        break
      case 'ArrowLeft':
        nextIndex = enabled[(position - 1 + enabled.length) % enabled.length]
        break
      case 'Home':
        nextIndex = enabled[0]
        break
      case 'End':
        nextIndex = enabled[enabled.length - 1]
        break
      default:
        return
    }

    event.preventDefault()
    tabs.current[nextIndex]?.focus()
    if (nextIndex !== selectedIndex) onValueChange(options[nextIndex].value)
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        data-theme-transition
        className="bg-card flex h-[52px] w-full max-w-[560px] gap-[6px] rounded-[10px] p-[6px]"
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex

          return (
            <button
              key={option.value}
              ref={(element) => {
                tabs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              aria-selected={selected}
              disabled={option.disabled}
              tabIndex={selected || (selectedIndex === -1 && index === firstEnabledIndex) ? 0 : -1}
              onClick={() => {
                if (!selected) onValueChange(option.value)
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'text-foreground h-10 min-w-0 rounded-md text-sm font-medium flex-1 text-center',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                'disabled:text-muted-foreground disabled:cursor-not-allowed',
                selected && 'bg-accent font-semibold',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {options.map((option, index) => (
        <div
          key={option.value}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          tabIndex={index === selectedIndex ? 0 : -1}
          hidden={index !== selectedIndex}
        >
          {option.content}
        </div>
      ))}
    </div>
  )
}
