import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './logo'

const meta = {
  title: 'Shared/UI/Logo',
  component: Logo,
  args: { size: 48, variant: 'accent', kind: 'lockup' },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

export const Accent: Story = {}
export const Monochrome: Story = { args: { variant: 'monochrome' } }
export const Symbol: Story = { args: { kind: 'symbol', size: 24 } }
