import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from 'cn'
import { Icon } from '../icon/icon'

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'h-7 w-12 border-border bg-muted data-checked:border-primary data-checked:bg-primary focus-visible:ring-ring focus-visible:ring-offset-background data-disabled:border-disabled-border data-disabled:bg-disabled inline-flex shrink-0 items-center rounded-full border px-[3px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="group/thumb size-5 bg-card data-checked:translate-x-5 data-disabled:bg-disabled-foreground grid shrink-0 place-items-center rounded-full transition-transform"
      >
        <Icon
          name="check"
          size="s"
          className="text-primary hidden group-data-checked/thumb:block"
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
