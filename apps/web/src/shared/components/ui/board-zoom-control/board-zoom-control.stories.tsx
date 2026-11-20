import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoardZoomControl } from './board-zoom-control'

function ZoomDemo({ disabled = false }: { disabled?: boolean }) {
  const [zoomPercent, setZoomPercent] = useState(100)
  return (
    <BoardZoomControl
      zoomPercent={zoomPercent}
      onZoomIn={() => setZoomPercent((value) => Math.min(value + 25, 200))}
      onZoomOut={() => setZoomPercent((value) => Math.max(value - 25, 25))}
      onFitAll={() => setZoomPercent(75)}
      canZoomIn={zoomPercent < 200}
      canZoomOut={zoomPercent > 25}
      disabled={disabled}
    />
  )
}

const meta = {
  title: 'Shared/UI/BoardZoomControl',
  component: BoardZoomControl,
  args: {
    zoomPercent: 100,
    onZoomIn: () => undefined,
    onZoomOut: () => undefined,
    onFitAll: () => undefined,
  },
} satisfies Meta<typeof BoardZoomControl>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = { render: () => <ZoomDemo /> }
export const Disabled: Story = { render: () => <ZoomDemo disabled /> }
