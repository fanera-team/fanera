import type { IconName } from '../icon/icon'

export type BoardTool = 'select' | 'sticky' | 'text' | 'shape' | 'arrow'

interface ToolDefinition {
  id: BoardTool
  icon: IconName
  shortcut: string
}

export const BOARD_TOOLS: readonly ToolDefinition[] = [
  { id: 'select', icon: 'mouse-pointer-2', shortcut: 'V' },
  { id: 'sticky', icon: 'sticky-note', shortcut: 'S' },
  { id: 'shape', icon: 'square', shortcut: 'R' },
  { id: 'arrow', icon: 'arrow-right', shortcut: 'A' },
  { id: 'text', icon: 'type', shortcut: 'T' },
]
