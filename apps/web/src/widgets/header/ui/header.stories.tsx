import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/shared/lib/i18n'
import { Header } from './header'

const user = { name: 'Анна', email: 'user@example.com' }

function HeaderDemo({ initiallyOpen = false, width }: { initiallyOpen?: boolean; width: number }) {
  const [sidebarOpen, setSidebarOpen] = useState(initiallyOpen)

  return (
    <div className="bg-background min-h-48" style={{ width }}>
      <Header sidebarOpen={sidebarOpen} onOpenSidebar={() => setSidebarOpen(true)} user={user} />
    </div>
  )
}

const meta = {
  title: 'Widgets/Header',
  component: Header,
  args: {
    sidebarOpen: false,
    onOpenSidebar: () => undefined,
    user,
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const DesktopClosed: Story = {
  render: () => <HeaderDemo width={1440} />,
}

export const DesktopOpen: Story = {
  render: () => <HeaderDemo width={1440} initiallyOpen />,
}

export const TabletClosed: Story = {
  render: () => <HeaderDemo width={834} />,
}

export const TabletOpen: Story = {
  render: () => <HeaderDemo width={834} initiallyOpen />,
}
