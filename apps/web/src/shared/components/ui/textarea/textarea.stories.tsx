import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from './textarea'

type TextareaStoryProps = Omit<ComponentProps<typeof Textarea>, 'placeholder' | 'aria-label'>

function TextareaStory(props: TextareaStoryProps) {
  const { t } = useTranslation('ui')
  const label = t('stories.field.boardDescription')

  return <Textarea placeholder={label} aria-label={label} {...props} />
}

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
  argTypes: { disabled: { control: 'boolean' }, 'aria-invalid': { control: 'boolean' } },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <TextareaStory {...args} />,
}

export const Filled: Story = {
  args: { defaultValue: 'Спринт 12 · подготовка к демо' },
  render: (args) => <TextareaStory {...args} />,
}

export const Focus: Story = {
  args: { defaultValue: 'Спринт 12 · подготовка к демо', autoFocus: true },
  render: (args) => <TextareaStory {...args} />,
}

export const Invalid: Story = {
  args: { defaultValue: '', 'aria-invalid': true },
  render: (args) => <TextareaStory {...args} />,
}

export const Disabled: Story = {
  args: { defaultValue: 'Спринт 12', disabled: true },
  render: (args) => <TextareaStory {...args} />,
}

export const Long: Story = {
  args: { defaultValue: 'Первая строка\nВторая строка\nТретья строка\nЧетвёртая строка' },
  render: (args) => <TextareaStory {...args} />,
}
