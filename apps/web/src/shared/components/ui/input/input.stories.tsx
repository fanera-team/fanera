import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

const meta = {
  title: 'Shared/UI/Input',
  component: Input,
  decorators: [
    (Story) => (
      <div className="max-w-100 flex w-full flex-col">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'name@example.com',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { 'aria-label': 'Email' },
}

export const Filled: Story = {
  args: { 'aria-label': 'Email', defaultValue: 'name@example.com' },
}

export const Focus: Story = {
  args: { 'aria-label': 'Email', defaultValue: 'name@example.com', autoFocus: true },
}

export const Invalid: Story = {
  args: { 'aria-label': 'Email', defaultValue: 'name@example', 'aria-invalid': true },
}

export const Disabled: Story = {
  args: { 'aria-label': 'Email', defaultValue: 'name@example.com', disabled: true },
}
