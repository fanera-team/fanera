import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cn } from 'cn'
import { CheckIcon, Minus } from 'lucide-react'

function Checkbox({ className, indeterminate, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(
        'peer size-4 border-input group-has-focus-visible/field-label:not-data-checked:border-input after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-focus-visible/field-label:data-checked:border-primary dark:data-checked:bg-primary relative flex shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none group-has-focus-visible/field-label:ring-0 group-has-disabled/field:opacity-50 after:absolute focus-visible:ring-3 aria-invalid:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        {indeterminate ? <Minus /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
