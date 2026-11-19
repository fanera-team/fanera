import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from './popover'
import { Button } from '../button/button'
import { Input } from '../input/input'
import { Switch } from '../switch/switch'
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

function ViewSettingsPopover() {
  const { t } = useTranslation('ui')
  const [showGrid, setShowGrid] = useState(true)
  return (
    <div className="p-4 min-h-[450px]">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" />}>
          {t('stories.overlays.viewSettings')}
        </PopoverTrigger>
        <PopoverContent align="start" initialFocus={false} className="min-h-[370px]">
          <PopoverTitle>{t('stories.overlays.viewSettings')}</PopoverTitle>
          <PopoverDescription className="mt-1">
            {t('stories.overlays.viewDescription')}
          </PopoverDescription>
          <div className="mt-3 bg-border h-px" />
          <div className="mt-4 min-h-10 flex items-center justify-between">
            <label htmlFor="story-grid" className="font-medium text-[13px]">
              {t('stories.overlays.showGrid')}
            </label>
            <Switch
              id="story-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
              aria-label={t('stories.overlays.showGrid')}
            />
          </div>
          <label htmlFor="story-zoom" className="mt-4 font-semibold text-[13px]">
            {t('stories.overlays.zoom')}
          </label>
          <Input id="story-zoom" defaultValue="100%" className="mt-2" />
          <div className="pt-5 mt-auto flex justify-end">
            <Button className="w-[158px]">{t('stories.overlays.apply')}</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const ViewSettings: Story = {
  render: () => <ViewSettingsPopover />,
}
