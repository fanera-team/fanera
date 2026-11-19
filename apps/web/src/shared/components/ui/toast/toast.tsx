import { toast as sonnerToast } from 'sonner'
import { i18n } from '@/shared/lib/i18n'
import { ToastCard, type ToastKind } from './toast-card'

type ToastOptions = {
  title?: string
  onDismiss?: () => void
}

function showToast(kind: ToastKind, message: string, options: ToastOptions = {}) {
  const title = options.title ?? i18n.t(`toast.titles.${kind}`)

  return sonnerToast.custom(
    (id) => (
      <ToastCard
        kind={kind}
        title={title}
        message={message}
        onClose={() => sonnerToast.dismiss(id)}
      />
    ),
    { onDismiss: options.onDismiss ? () => options.onDismiss?.() : undefined },
  )
}

export const toast = {
  info: (message: string, options?: ToastOptions) => showToast('info', message, options),
  warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
  error: (message: string, options?: ToastOptions) => showToast('error', message, options),
  success: (message: string, options?: ToastOptions) => showToast('success', message, options),
}
