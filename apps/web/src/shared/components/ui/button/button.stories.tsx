import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps, ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'

type ButtonStoryProps = Omit<ComponentProps<typeof Button>, 'children'> & {
  labelKey: string
  icon?: ReactNode
}

function ButtonStory({ labelKey, icon, ...props }: ButtonStoryProps) {
  const { t } = useTranslation('ui')

  return (
    <Button {...props}>
      {icon}
      {t(labelKey)}
    </Button>
  )
}

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => <ButtonStory labelKey="stories.button.createBoard" {...args} />,
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) => <ButtonStory labelKey="stories.button.add" {...args} />,
}

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => <ButtonStory labelKey="stories.button.cancel" {...args} />,
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => <ButtonStory labelKey="stories.button.delete" icon={<Trash2 />} {...args} />,
}

export const WithIcon: Story = {
  render: (args) => <ButtonStory labelKey="stories.button.createBoard" icon={<Plus />} {...args} />,
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => <ButtonStory labelKey="stories.button.createBoard" {...args} />,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonStory labelKey="stories.button.unavailable" {...args} />,
}

export const Sizes: Story = {
  render: () => (
    <div className="gap-3 flex flex-col items-start">
      <ButtonStory labelKey="stories.button.signIn" size="lg" />
      <ButtonStory labelKey="stories.button.createBoard" />
    </div>
  ),
}
