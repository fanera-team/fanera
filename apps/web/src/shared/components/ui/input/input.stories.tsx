import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from './input'

type InputStoryProps = Omit<ComponentProps<typeof Input>, 'aria-label'>

function InputStory(props: InputStoryProps) {
  const { t } = useTranslation('ui')

  return <Input aria-label={t('stories.field.emailLabel')} {...props} />
}

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
  render: (args) => <InputStory {...args} />,
}

export const Filled: Story = {
  args: { defaultValue: 'name@example.com' },
  render: (args) => <InputStory {...args} />,
}

export const Focus: Story = {
  args: { defaultValue: 'name@example.com', autoFocus: true },
  render: (args) => <InputStory {...args} />,
}

export const Invalid: Story = {
  args: { defaultValue: 'name@example', 'aria-invalid': true },
  render: (args) => <InputStory {...args} />,
}

export const Disabled: Story = {
  args: { defaultValue: 'name@example.com', disabled: true },
  render: (args) => <InputStory {...args} />,
}
