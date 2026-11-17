import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageToggle } from './language-toggle'

const meta = {
  title: 'Shared/UI/LanguageToggle',
  component: LanguageToggle,
} satisfies Meta<typeof LanguageToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
