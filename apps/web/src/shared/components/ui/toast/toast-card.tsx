import { cva } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from '../icon/icon'

export type ToastKind = 'info' | 'warning' | 'error' | 'success'

const iconNames: Record<ToastKind, IconName> = {
  info: 'info',
  warning: 'triangle-alert',
  error: 'alert',
  success: 'check',
}

const toastVariants = cva(
  'relative box-border min-h-32 w-full rounded-[10px] border px-[19px] py-[15px] font-sans text-foreground',
  {
    variants: {
      kind: {
        info: 'border-tip-info-border bg-tip-info-surface',
        warning: 'border-tip-warning-border bg-tip-warning-surface',
        error: 'border-tip-error-border bg-tip-error-surface',
        success: 'border-success bg-status-success-surface',
      },
    },
  },
)

const iconColors: Record<ToastKind, string> = {
  info: 'text-tip-info-icon',
  warning: 'text-tip-warning-icon',
  error: 'text-tip-error-icon',
  success: 'text-success',
}

type ToastCardProps = {
  kind: ToastKind
  title: string
  message: string
  onClose: () => void
}

export function ToastCard({ kind, title, message, onClose }: ToastCardProps) {
  const { t } = useTranslation('ui')

  return (
    <div className={toastVariants({ kind })} role={kind === 'error' ? 'alert' : 'status'}>
      <div className="min-h-7 gap-3.5 pr-5 flex items-start">
        <Icon
          name={iconNames[kind]}
          size="m"
          className={`mt-1 size-[18px] shrink-0 ${iconColors[kind]}`}
        />
        <span className="min-w-0 text-base font-semibold leading-[1.2] wrap-break-word">
          {title}
        </span>
      </div>
      <button
        type="button"
        aria-label={t('toast.close')}
        className="top-1 right-2 size-10 rounded-md text-muted-foreground hover:bg-foreground/10 focus-visible:ring-ring absolute flex items-center justify-center outline-none focus-visible:ring-2"
        onClick={onClose}
      >
        <Icon name="x" size="s" />
      </button>
      <p className="mt-4 text-sm leading-[1.45] wrap-break-word">{message}</p>
    </div>
  )
}
