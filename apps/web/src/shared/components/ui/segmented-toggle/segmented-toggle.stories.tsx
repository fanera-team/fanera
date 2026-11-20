import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { Icon } from '../icon/icon'
import { SegmentedToggle } from './segmented-toggle'

const meta = {
  title: 'Shared/UI/SegmentedToggle',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ThreeOptions: Story = { render: () => <ThreeOptionToggle /> }

function ThreeOptionToggle() {
  const { t } = useTranslation('ui')
  const [value, setValue] = useState('ru')
  return (
    <SegmentedToggle
      value={value}
      label={t('language.label')}
      options={[
        { value: 'ru', label: t('language.ru'), content: t('language.short.ru') },
        { value: 'en', label: t('language.en'), content: t('language.short.en') },
        { value: 'light', label: t('theme.light'), content: <Icon name="sun" size="m" /> },
      ]}
      onValueChange={setValue}
    />
  )
}
