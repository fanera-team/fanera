import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Icon } from '../icon/icon'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color] motion-reduce:transition-none outline-none select-none focus-visible:border-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-accent-foreground',
        secondary: 'bg-accent text-accent-ink hover:border-primary',
        outline: 'border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        destructive:
          'border-destructive bg-destructive-subtle text-destructive hover:bg-destructive hover:text-destructive-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        s: "h-8 gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-4",
        m: "h-10 gap-2 px-4 [&_svg:not([class*='size-'])]:size-5",
        l: "h-12 gap-2 px-4 [&_svg:not([class*='size-'])]:size-6",
        'icon-s': "size-8 [&_svg:not([class*='size-'])]:size-4",
        'icon-m': "size-10 [&_svg:not([class*='size-'])]:size-5",
        'icon-l': "size-12 [&_svg:not([class*='size-'])]:size-6",
        // Keep existing public names for callers that have not migrated yet.
        default: "h-10 gap-2 px-4 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-8 gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-4 [&_svg:not([class*='size-'])]:size-6",
        xs: "h-8 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-4",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        'icon-sm': "size-8 [&_svg:not([class*='size-'])]:size-4",
        'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-12 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'm',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

function Button({
  className,
  variant = 'primary',
  size = 'm',
  loading = false,
  disabled,
  onClick,
  'aria-busy': ariaBusy,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading ? true : undefined}
      aria-disabled={disabled || loading ? true : undefined}
      disabled={disabled || loading}
      onClick={loading ? (event) => event.preventDefault() : onClick}
      className={cn(buttonVariants({ variant, size, className }), loading && 'pointer-events-none')}
      {...props}
      aria-busy={loading ? true : ariaBusy}
    >
      {loading && <Icon name="loader-circle" className="animate-spin" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button }
