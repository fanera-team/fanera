import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../Label/label'
import { Checkbox } from './checkbox'

type CheckboxStoryProps = Omit<ComponentProps<typeof Checkbox>, 'aria-label'> & {
  withLabel?: boolean
}

function CheckboxStory({ withLabel, ...props }: CheckboxStoryProps) {
  const { t } = useTranslation('ui')
  const label = t('stories.field.boardSelect')

  if (!withLabel) {
    return <Checkbox aria-label={label} {...props} />
  }

  return (
    <div className="gap-2 flex items-center">
      <Checkbox id="checkbox-with-label" aria-label={label} {...props} />
      <Label htmlFor="checkbox-with-label">{label}</Label>
    </div>
  )
}

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <CheckboxStory {...args} />,
}

export const Checked: Story = {
  args: { defaultChecked: true },
  render: (args) => <CheckboxStory {...args} />,
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
  render: (args) => <CheckboxStory {...args} />,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <CheckboxStory {...args} />,
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
  render: (args) => <CheckboxStory {...args} />,
}

export const WithLabel: Story = {
  render: (args) => <CheckboxStory withLabel {...args} />,
}
