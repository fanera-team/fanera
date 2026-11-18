import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckboxGroup } from '@base-ui/react/checkbox-group'
import { expect } from 'storybook/test'
import { Label } from '../label/label'
import { Checkbox } from './checkbox'

type CheckboxStoryProps = Omit<ComponentProps<typeof Checkbox>, 'aria-label'> & {
  withLabel?: boolean
}

function CheckboxStory({ withLabel, id, ...props }: CheckboxStoryProps) {
  const { t } = useTranslation('ui')
  const generatedId = useId()
  const checkboxId = id?.trim() ? id : generatedId
  const label = t('stories.field.boardSelect')

  if (!withLabel) {
    return <Checkbox id={checkboxId} aria-label={label} {...props} />
  }

  return (
    <div className="gap-2 flex items-center">
      <Checkbox id={checkboxId} aria-label={label} {...props} />
      <Label htmlFor={checkboxId}>{label}</Label>
    </div>
  )
}

function visibleIndicatorIcon(checkbox: Element) {
  const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]')
  if (!indicator) return null

  return [...indicator.querySelectorAll('svg')].find(
    (icon) => getComputedStyle(icon).display !== 'none',
  )
}

function MixedGroupStory() {
  const { t } = useTranslation('ui')

  return (
    <CheckboxGroup
      className="gap-2 flex flex-col"
      defaultValue={['board-one']}
      allValues={['board-one', 'board-two']}
    >
      <Checkbox parent aria-label={t('stories.field.selectAll')} />
      <Checkbox value="board-one" aria-label={t('stories.field.boardOne')} />
      <Checkbox value="board-two" aria-label={t('stories.field.boardTwo')} />
    </CheckboxGroup>
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

export const MixedGroup: Story = {
  render: () => <MixedGroupStory />,
  play: async ({ canvasElement }) => {
    const [parent, firstChild] = canvasElement.querySelectorAll('[role="checkbox"]')

    expect(parent.getAttribute('aria-checked')).toBe('mixed')

    const mixedIcon = visibleIndicatorIcon(parent)
    const checkedIcon = visibleIndicatorIcon(firstChild)

    expect(mixedIcon).not.toBeNull()
    expect(checkedIcon).not.toBeNull()
    expect(mixedIcon?.outerHTML).not.toEqual(checkedIcon?.outerHTML)
  },
}
