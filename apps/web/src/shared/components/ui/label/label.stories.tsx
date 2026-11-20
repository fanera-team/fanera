import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '../input/input'
import { Label } from './label'

function LabelStory(props: ComponentProps<typeof Label>) {
  const { t } = useTranslation('ui')

  return <Label {...props}>{t('stories.field.emailLabel')}</Label>
}

function LabelWithInput({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation('ui')
  const id = disabled ? 'label-disabled' : 'label-with-input'

  return (
    <div className="flex flex-col">
      <Label htmlFor={id} disabled={disabled} className="mb-2">
        {t('stories.field.emailLabel')}
      </Label>
      <Input id={id} placeholder={t('stories.field.emailPlaceholder')} disabled={disabled} />
    </div>
  )
}

const meta = {
  title: 'Shared/UI/Label',
  component: Label,
  decorators: [
    (Story) => (
      <div className="max-w-100 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <LabelStory {...args} />,
}

export const WithInput: Story = {
  render: () => <LabelWithInput />,
}

export const Disabled: Story = {
  render: () => <LabelWithInput disabled />,
}

export const Required: Story = {
  render: (args) => <LabelStory {...args} required />,
}
