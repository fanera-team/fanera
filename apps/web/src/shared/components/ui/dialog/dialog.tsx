'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'

type DialogSize = 's' | 'm' | 'l'
type DialogFooterAction = {
  label: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  variant?: React.ComponentProps<typeof Button>['variant']
  disabled?: boolean
  loading?: boolean
}
type DialogContentProps = DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  size?: DialogSize
  /** False: Penpot's 380 px height. True: content height. Both scroll within the viewport. */
  autoHeight?: boolean
  draggable?: boolean
  footerActions?: readonly DialogFooterAction[]
}
type DialogProps = DialogPrimitive.Root.Props & {
  /** Keep the dialog open when the backdrop or page is pressed. */
  closeOnOutsideClick?: boolean
}

const DialogModeContext = React.createContext(true)
const DialogSizeContext = React.createContext<DialogSize>('m')
type DragHandlers = Pick<
  React.ComponentProps<'div'>,
  'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel'
>
const DialogDragContext = React.createContext<DragHandlers | null>(null)

function Dialog({
  modal = true,
  closeOnOutsideClick = true,
  disablePointerDismissal,
  children,
  ...props
}: DialogProps) {
  return (
    <DialogModeContext.Provider value={modal !== false}>
      <DialogPrimitive.Root
        data-slot="dialog"
        modal={modal}
        disablePointerDismissal={!closeOnOutsideClick || disablePointerDismissal}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogModeContext.Provider>
  )
}
function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}
function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'inset-0 bg-foreground/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed isolate z-50 duration-100',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = 'm',
  autoHeight = false,
  draggable = false,
  footerActions,
  style,
  ...props
}: DialogContentProps) {
  const { t } = useTranslation('ui')
  const modal = React.useContext(DialogModeContext)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{
    id: number
    x: number
    y: number
    startX: number
    startY: number
    left: number
    top: number
    right: number
    bottom: number
  } | null>(null)
  const offset = React.useRef({ x: 0, y: 0 })
  const previousCursor = React.useRef<string | null>(null)
  const position = (x: number, y: number) => `translate(${x}px, ${y}px)`
  React.useLayoutEffect(() => {
    if (popupRef.current)
      popupRef.current.style.transform = position(offset.current.x, offset.current.y)
  })
  const restoreCursor = () => {
    if (previousCursor.current !== null) {
      document.documentElement.style.cursor = previousCursor.current
      previousCursor.current = null
    }
  }
  React.useEffect(
    () => () => {
      restoreCursor()
    },
    [],
  )
  const handlers: DragHandlers = {
    onPointerDown: (event) => {
      if (
        !draggable ||
        event.button !== 0 ||
        (event.target instanceof Element &&
          event.target.closest(
            'button, a, input, textarea, select, [role="button"], [contenteditable="true"]',
          ))
      )
        return
      const bounds = popupRef.current?.getBoundingClientRect()
      if (!bounds) return
      drag.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: offset.current.x,
        startY: offset.current.y,
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = 'true'
      previousCursor.current = document.documentElement.style.cursor
      document.documentElement.style.cursor = 'grabbing'
    },
    onPointerMove: (event) => {
      const active = drag.current
      const popup = popupRef.current
      if (!active || active.id !== event.pointerId || !popup) return
      offset.current = {
        x:
          active.startX +
          Math.min(
            Math.max(event.clientX - active.x, -active.left),
            window.innerWidth - active.right,
          ),
        y:
          active.startY +
          Math.min(
            Math.max(event.clientY - active.y, -active.top),
            window.innerHeight - active.bottom,
          ),
      }
      // Update the element in the pointer event itself; React rendering can lag behind rapid movement.
      popup.style.transform = position(offset.current.x, offset.current.y)
    },
    onPointerUp: (event) => {
      if (drag.current?.id !== event.pointerId) return
      drag.current = null
      delete event.currentTarget.dataset.dragging
      restoreCursor()
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId)
    },
    onPointerCancel: (event) => {
      if (drag.current?.id !== event.pointerId) return
      drag.current = null
      delete event.currentTarget.dataset.dragging
      restoreCursor()
    },
  }
  return (
    <DialogPortal>
      {modal && <DialogOverlay />}
      <DialogPrimitive.Popup
        ref={popupRef}
        data-slot="dialog-content"
        data-size={size}
        data-auto-height={autoHeight}
        className={cn(
          'gap-4 rounded-xl border-border bg-card p-7 font-sans text-sm text-card-foreground data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-y-auto border duration-100 outline-none',
          size === 's' && 'max-w-[400px]',
          size === 'm' && 'max-w-[536px]',
          size === 'l' && 'max-w-[720px]',
          !autoHeight && 'h-[380px]',
          className,
        )}
        style={{ ...style, translate: '-50% -50%', transform: 'translate(0px, 0px)' }}
        {...props}
      >
        <DialogSizeContext.Provider value={size}>
          <DialogDragContext.Provider value={draggable ? handlers : null}>
            {children}
            {footerActions && <DialogFooter actions={footerActions} />}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                render={<Button variant="ghost" className="top-5 right-5 absolute" size="icon-s" />}
              >
                <Icon name="x" />
                <span className="sr-only">{t('dialog.close')}</span>
              </DialogPrimitive.Close>
            )}
          </DialogDragContext.Provider>
        </DialogSizeContext.Provider>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: React.ComponentProps<'div'>) {
  const drag = React.useContext(DialogDragContext)
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'gap-3 pr-8 flex flex-col',
        drag &&
          'cursor-grab touch-none select-none data-[dragging]:cursor-grabbing [&_a]:cursor-pointer [&_button]:cursor-pointer',
        className,
      )}
      onPointerDown={(event) => {
        drag?.onPointerDown?.(event)
        onPointerDown?.(event)
      }}
      onPointerMove={(event) => {
        drag?.onPointerMove?.(event)
        onPointerMove?.(event)
      }}
      onPointerUp={(event) => {
        drag?.onPointerUp?.(event)
        onPointerUp?.(event)
      }}
      onPointerCancel={(event) => {
        drag?.onPointerCancel?.(event)
        onPointerCancel?.(event)
      }}
      {...props}
    />
  )
}
function DialogFooter({
  className,
  showCloseButton = false,
  actions,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
  actions?: readonly DialogFooterAction[]
}) {
  const { t } = useTranslation('ui')
  const size = React.useContext(DialogSizeContext)
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'gap-3 pt-4 pb-3 sm:flex-row sm:justify-end mt-auto flex flex-col-reverse',
        size === 's'
          ? '[&_[data-slot=button]]:min-w-[150px]'
          : '[&_[data-slot=button]]:min-w-[174px]',
        className,
      )}
      {...props}
    >
      {children}
      {actions?.map((action, index) => (
        <Button
          key={index}
          size="m"
          variant={action.variant}
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          {t('dialog.close')}
        </DialogPrimitive.Close>
      )}
    </div>
  )
}
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-heading font-bold text-[19px] leading-[1.25]', className)}
      {...props}
    />
  )
}
function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'font-medium text-muted-foreground *:[a]:hover:text-foreground text-[13px] leading-[1.25] *:[a]:underline *:[a]:underline-offset-3',
        className,
      )}
      {...props}
    />
  )
}

export type { DialogContentProps, DialogFooterAction, DialogProps, DialogSize }
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
