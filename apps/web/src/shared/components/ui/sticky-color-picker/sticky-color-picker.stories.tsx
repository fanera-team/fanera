import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StickyColorPicker, type StickyColor } from './sticky-color-picker'

function ColorDemo({ disabled = false }: { disabled?: boolean }) {
  const [color, setColor] = useState<StickyColor>('yellow')
  return <StickyColorPicker selectedColor={color} onColorChange={setColor} disabled={disabled} />
}

const meta = {
  title: 'Shared/UI/StickyColorPicker',
  component: StickyColorPicker,
  args: { selectedColor: 'yellow', onColorChange: () => undefined },
} satisfies Meta<typeof StickyColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = { render: () => <ColorDemo /> }
export const Disabled: Story = { render: () => <ColorDemo disabled /> }
