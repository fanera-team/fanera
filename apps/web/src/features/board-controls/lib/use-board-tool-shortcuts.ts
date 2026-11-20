import { useEffect } from 'react'
import { BOARD_TOOLS, type BoardTool } from '@/shared/components/ui'

const toolByCode = new Map<string, BoardTool>(
  BOARD_TOOLS.map(({ id, shortcut }) => [`Key${shortcut}`, id] as const),
)
const noDisabledTools: readonly BoardTool[] = []

export interface BoardToolShortcutsOptions {
  activeTool: BoardTool
  onToolChange: (tool: BoardTool) => void
  enabled?: boolean
  disabledTools?: readonly BoardTool[]
}

export function useBoardToolShortcuts({
  activeTool,
  onToolChange,
  enabled = true,
  disabledTools = noDisabledTools,
}: BoardToolShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }

      const target = event.target
      if (
        target instanceof Element &&
        target.closest(
          'input, textarea, select, [role="textbox"], [contenteditable="true"], [contenteditable=""]',
        )
      ) {
        return
      }

      const tool = event.key === 'Escape' ? 'select' : toolByCode.get(event.code)
      if (!tool || tool === activeTool || disabledTools.includes(tool)) return

      event.preventDefault()
      onToolChange(tool)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTool, disabledTools, enabled, onToolChange])
}
