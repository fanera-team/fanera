import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

export type StickyColor = 'yellow' | 'pink' | 'green' | 'blue'

const colors: readonly { id: StickyColor; background: string }[] = [
  { id: 'yellow', background: 'bg-sticky-yellow' },
  { id: 'pink', background: 'bg-sticky-pink' },
  { id: 'green', background: 'bg-sticky-green' },
  { id: 'blue', background: 'bg-sticky-blue' },
]

export interface StickyColorPickerProps {
  selectedColor: StickyColor
  onColorChange: (color: StickyColor) => void
  disabled?: boolean
  className?: string
}

export function StickyColorPicker({
  selectedColor,
  onColorChange,
  disabled = false,
  className,
}: StickyColorPickerProps) {
  const { t } = useTranslation('ui')
  const groupName = useId()
  const descriptionId = useId()

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={descriptionId}
      className={cn('border-border bg-card p-5 w-[310px] rounded-[10px] border', className)}
    >
      <legend className="sr-only">{t('board.sticky.title')}</legend>
      <p aria-hidden="true" className="text-foreground text-base font-semibold">
        {t('board.sticky.title')}
      </p>
      <p id={descriptionId} className="text-muted-foreground mt-7 text-xs">
        {t('board.sticky.colorLabel')}
      </p>
      <div className="mt-3 gap-3.5 flex">
        {colors.map(({ id, background }) => (
          <label
            key={id}
            className={cn(
              'size-8 relative block',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={id}
              checked={selectedColor === id}
              onChange={() => onColorChange(id)}
              aria-label={t(`board.colors.${id}`)}
              className="peer inset-0 absolute size-full opacity-0"
            />
            <span
              aria-hidden="true"
              className={cn(
                'size-8 block rounded-[4px] border border-transparent',
                background,
                selectedColor === id && 'ring-foreground ring-2',
                'peer-focus-visible:ring-ring peer-focus-visible:ring-offset-card peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                'peer-disabled:opacity-50',
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
