import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './avatar'

const meta = {
  title: 'Shared/UI/Avatar',
  component: Avatar,
  args: { name: 'User' },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 's' } }
export const Medium: Story = { args: { size: 'm' } }
export const Large: Story = { args: { size: 'l' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }
