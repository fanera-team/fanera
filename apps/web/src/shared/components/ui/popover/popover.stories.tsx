import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from '../button/button'
import { useTranslation } from 'react-i18next'

const meta = {
  title: 'Shared/UI/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <BasicPopover />,
}

function BasicPopover() {
  const { t } = useTranslation('ui')
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        {t('examples.settings')}
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">{t('examples.popoverText')}</p>
      </PopoverContent>
    </Popover>
  )
}
