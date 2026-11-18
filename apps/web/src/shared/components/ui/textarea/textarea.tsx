import * as React from 'react'
import { cn } from 'cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-16 rounded-md border-input bg-card px-3 py-3 field-sizing-content w-full border',
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

export { Textarea }
