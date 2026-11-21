import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoardToolbar } from './board-toolbar'
import type { BoardTool } from './board-tools'

function ToolbarDemo({
  disabled = false,
  disabledTools = [],
}: {
  disabled?: boolean
  disabledTools?: BoardTool[]
}) {
  const [activeTool, setActiveTool] = useState<BoardTool>('select')
  return (
    <BoardToolbar
      activeTool={activeTool}
      onToolChange={setActiveTool}
      disabled={disabled}
      disabledTools={disabledTools}
    />
  )
}

const meta = {
  title: 'Shared/UI/BoardToolbar',
  component: BoardToolbar,
  args: { activeTool: 'select', onToolChange: () => undefined },
} satisfies Meta<typeof BoardToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = { render: () => <ToolbarDemo /> }
export const SomeToolsDisabled: Story = {
  render: () => <ToolbarDemo disabledTools={['sticky', 'arrow']} />,
}
export const Disabled: Story = { render: () => <ToolbarDemo disabled /> }
