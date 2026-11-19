import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../label/label'
import { Switch } from './switch'

function Example({
  disabled,
  defaultChecked,
}: Pick<ComponentProps<typeof Switch>, 'disabled' | 'defaultChecked'>) {
  const { t } = useTranslation('ui')
  const id = useId()

  return (
    <div className="gap-2 flex items-center">
      <Switch id={id} disabled={disabled} defaultChecked={defaultChecked} />
      <Label htmlFor={id} disabled={disabled}>
        {t('theme.dark')}
      </Label>
    </div>
  )
}

const meta = {
  title: 'Shared/UI/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = { render: () => <Example /> }
export const Checked: Story = { render: () => <Example defaultChecked /> }
export const Focus: Story = {
  render: () => <Example defaultChecked />,
  play: async ({ canvasElement, userEvent }) => {
    canvasElement.querySelector<HTMLElement>('[role="switch"]')?.focus()
    await userEvent.tab({ shift: true })
    await userEvent.tab()
  },
}
export const Disabled: Story = { render: () => <Example disabled /> }
export const DisabledChecked: Story = { render: () => <Example disabled defaultChecked /> }
