import * as React from 'react'
import { cn } from 'cn'

type LabelProps = React.ComponentProps<'label'> & { required?: boolean; disabled?: boolean }

function Label({ className, required, disabled, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        'gap-1 text-sm leading-5 font-medium text-foreground flex items-center select-none',
        'group-data-[disabled=true]:text-disabled-foreground peer-disabled:text-disabled-foreground',
        disabled && 'text-disabled-foreground cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span aria-hidden="true">*</span>}
    </label>
  )
}

export { Label }
