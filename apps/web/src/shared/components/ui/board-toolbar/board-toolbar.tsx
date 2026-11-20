import { cva } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip/tooltip'
import { BOARD_TOOLS, type BoardTool } from './board-tools'

const toolButton = cva('p-0', {
  variants: {
    selected: {
      true: 'bg-accent text-accent-foreground hover:bg-accent',
      false: 'text-foreground hover:bg-tool-hover',
    },
  },
})

export interface BoardToolbarProps {
  activeTool: BoardTool
  onToolChange: (tool: BoardTool) => void
  disabled?: boolean
  disabledTools?: readonly BoardTool[]
  className?: string
}

export function BoardToolbar({
  activeTool,
  onToolChange,
  disabled = false,
  disabledTools = [],
  className,
}: BoardToolbarProps) {
  const { t } = useTranslation('ui')

  return (
    <TooltipProvider>
      <div
        role="toolbar"
        aria-label={t('board.toolbar')}
        className={cn(
          'border-border bg-card gap-2.5 flex h-[58px] w-fit items-center rounded-[10px] border px-[9px]',
          className,
        )}
      >
        {BOARD_TOOLS.map(({ id, icon, shortcut }) => {
          const label = t(`board.tools.${id}`)
          const unavailable = disabled || disabledTools.includes(id)

          return (
            <Tooltip key={id}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-board"
                    className={toolButton({ selected: activeTool === id })}
                    aria-label={label}
                    aria-keyshortcuts={shortcut}
                    aria-pressed={activeTool === id}
                    disabled={unavailable}
                    onClick={() => onToolChange(id)}
                  >
                    <Icon name={icon} />
                  </Button>
                }
              />
              <TooltipContent>{t('board.toolShortcut', { tool: label, shortcut })}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
