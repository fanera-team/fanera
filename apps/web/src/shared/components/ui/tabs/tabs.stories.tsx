import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from './tabs'

function TabsStory({
  initialValue,
  disableThird = false,
}: {
  initialValue: string
  disableThird?: boolean
}) {
  const { t } = useTranslation('ui')
  const [value, setValue] = useState(initialValue)

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      label={t('stories.field.boardSelect')}
      options={[
        { value: 'first', label: t('stories.field.boardOne'), content: null },
        { value: 'second', label: t('stories.field.boardTwo'), content: null },
        {
          value: 'third',
          label: t('stories.button.unavailable'),
          content: null,
          disabled: disableThird,
        },
      ]}
    />
  )
}

const meta = {
  title: 'Shared/UI/Tabs',
  component: TabsStory,
} satisfies Meta<typeof TabsStory>

export default meta
type Story = StoryObj<typeof meta>

export const Selected: Story = {
  args: { initialValue: 'first' },
}

export const Focused: Story = {
  args: { initialValue: 'second' },
  play: async ({ canvas }) => {
    canvas.getByRole('tab', { selected: true }).focus()
  },
}

export const Disabled: Story = {
  args: { initialValue: 'second', disableThird: true },
}
