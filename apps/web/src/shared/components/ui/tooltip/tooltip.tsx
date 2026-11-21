import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/shared/lib/utils'

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          role="tooltip"
          data-slot="tooltip-content"
          className={cn(
            'bg-foreground px-3 py-1 text-xs font-semibold text-background data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 z-50 inline-flex min-h-[42px] w-fit max-w-[min(190px,calc(100vw-16px))] origin-(--transform-origin) items-center rounded-[7px]',
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="w-3 bg-foreground top-full h-[7px] [clip-path:polygon(0_0,100%_0,50%_100%)] data-[side=bottom]:top-auto data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180 data-[side=left]:top-1/2 data-[side=left]:left-full data-[side=left]:-translate-y-1/2 data-[side=left]:-rotate-90 data-[side=right]:top-1/2 data-[side=right]:right-full data-[side=right]:-translate-y-1/2 data-[side=right]:rotate-90" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
