import type { Meta, StoryObj } from '@storybook/react-vite'
import { StickyNote } from 'lucide-react'
import { Icon } from './icon'

const meta = {
  title: 'Shared/UI/Icon',
  component: Icon,
  args: { icon: StickyNote },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
