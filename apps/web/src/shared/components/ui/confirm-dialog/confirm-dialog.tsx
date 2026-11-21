import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../dialog/dialog'
import { useTranslation } from 'react-i18next'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation('ui')
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading || nextOpen) onOpenChange(nextOpen)
      }}
    >
      <DialogContent
        size="m"
        footerActions={[
          {
            label: cancelText ?? t('confirmDialog.cancel'),
            variant: 'outline',
            disabled: loading,
            onClick: () => onOpenChange(false),
          },
          {
            label: confirmText ?? t('confirmDialog.confirm'),
            variant: 'destructive',
            loading,
            onClick: onConfirm,
          },
        ]}
      >
        <DialogHeader className="gap-9">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
