import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'

export interface BoardZoomControlProps {
  zoomPercent: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitAll: () => void
  canZoomIn?: boolean
  canZoomOut?: boolean
  disabled?: boolean
  className?: string
}

export function BoardZoomControl({
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onFitAll,
  canZoomIn = true,
  canZoomOut = true,
  disabled = false,
  className,
}: BoardZoomControlProps) {
  const { t } = useTranslation('ui')

  return (
    <div
      role="group"
      aria-label={t('board.zoom.label')}
      className={cn(
        'border-border bg-card gap-1 px-2 flex h-[58px] w-fit items-center rounded-[10px] border',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-board"
        aria-label={t('board.zoom.out')}
        disabled={disabled || !canZoomOut}
        onClick={onZoomOut}
      >
        <Icon name="zoom-out" />
      </Button>
      <output className="text-foreground text-sm font-semibold w-[66px] text-center">
        {zoomPercent}%
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon-board"
        aria-label={t('board.zoom.in')}
        disabled={disabled || !canZoomIn}
        onClick={onZoomIn}
      >
        <Icon name="zoom-in" />
      </Button>
      <span aria-hidden="true" className="bg-border mx-1 h-7 w-px" />
      <Button
        type="button"
        variant="ghost"
        size="icon-board"
        aria-label={t('board.zoom.fitAll')}
        disabled={disabled}
        onClick={onFitAll}
      >
        <Icon name="maximize" />
      </Button>
    </div>
  )
}
