import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cn } from 'cn'
import { Icon } from '../icon/icon'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-6 rounded-sm border-input bg-card text-primary-foreground data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-offset-background data-disabled:border-disabled-border data-disabled:bg-disabled data-disabled:text-disabled-foreground relative flex shrink-0 items-center justify-center border transition-colors outline-none focus-visible:border-2 focus-visible:ring-2 focus-visible:ring-offset-2 data-disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/indicator [&>svg]:size-4 grid place-content-center text-current transition-none"
      >
        <Icon name="minus" className="hidden group-data-indeterminate/indicator:block" />
        <Icon name="check" className="group-data-indeterminate/indicator:hidden" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
