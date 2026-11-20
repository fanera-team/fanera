import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/shared/lib/i18n'
import { Sidebar } from './sidebar'

function SidebarDemo({ initiallyPinned, width }: { initiallyPinned: boolean; width: number }) {
  const [open, setOpen] = useState(true)
  const [pinned, setPinned] = useState(initiallyPinned)

  return (
    <div className="bg-background relative flex min-h-[640px]" style={{ width }}>
      <Sidebar
        open={open}
        pinned={pinned}
        onClose={() => setOpen(false)}
        onPinnedChange={setPinned}
        spaces={[{ id: 'one', name: 'Команда' }]}
        className={pinned ? undefined : 'inset-y-0 left-0 absolute z-10'}
      />
      <div className="flex-1" />
    </div>
  )
}

const meta = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  args: {
    open: true,
    pinned: true,
    onClose: () => undefined,
    onPinnedChange: () => undefined,
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const DesktopPinned: Story = {
  render: () => <SidebarDemo width={1440} initiallyPinned />,
}

export const TabletPinned: Story = {
  render: () => <SidebarDemo width={834} initiallyPinned />,
}

export const TabletOverlay: Story = {
  render: () => <SidebarDemo width={834} initiallyPinned={false} />,
}
