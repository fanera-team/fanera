import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'min-w-0 rounded-md border-input bg-card px-3 h-10.5 w-full border',
        'text-sm text-foreground placeholder:text-muted-foreground',
        'transition-colors outline-none',
        'focus-visible:border-ring focus-visible:border-2',
        'disabled:cursor-not-allowed disabled:opacity-[0.45]',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
