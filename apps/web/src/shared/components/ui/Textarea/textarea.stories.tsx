import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'

const meta = {
  title: 'Shared/UI/Textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div className="max-w-100 w-full">
        <Story />
      </div>
    ),
  ],
  args: { placeholder: 'Описание доски', 'aria-label': 'Описание доски' },
  argTypes: { disabled: { control: 'boolean' }, 'aria-invalid': { control: 'boolean' } },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Filled: Story = { args: { defaultValue: 'Спринт 12 · подготовка к демо' } }
export const Focus: Story = {
  args: { defaultValue: 'Спринт 12 · подготовка к демо', autoFocus: true },
}
export const Invalid: Story = { args: { defaultValue: '', 'aria-invalid': true } }
export const Disabled: Story = { args: { defaultValue: 'Спринт 12', disabled: true } }
export const Long: Story = {
  args: { defaultValue: 'Первая строка\nВторая строка\nТретья строка\nЧетвёртая строка' },
}
