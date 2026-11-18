import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { LoaderCircle } from 'lucide-react'
import { Icon } from '../icon/icon'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color] motion-reduce:transition-none outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-accent text-accent-ink hover:bg-accent/80',
        outline: 'border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        destructive: 'bg-destructive-subtle text-destructive hover:bg-destructive/15',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: "h-10 gap-2 px-4 [&_svg:not([class*='size-'])]:size-5",
        lg: "h-11 gap-2 px-4 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-9 gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-8 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-xs': 'size-8',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading ? true : undefined}
      aria-busy={loading ? true : undefined}
      aria-disabled={disabled || loading ? true : undefined}
      disabled={disabled}
      onClick={loading ? undefined : onClick}
      className={cn(buttonVariants({ variant, size, className }), loading && 'pointer-events-none')}
      {...props}
    >
      {loading && <Icon icon={LoaderCircle} className="animate-spin" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button }
