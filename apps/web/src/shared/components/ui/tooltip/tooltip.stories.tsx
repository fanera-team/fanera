import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import { useTranslation } from 'react-i18next'
import { i18n } from '@/shared/lib/i18n'

const meta = {
  title: 'Shared/UI/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <BasicTooltip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(
      canvas.getByRole('button', { name: i18n.t('stories.overlays.boardSettings', { ns: 'ui' }) }),
    )
    const tooltip = await within(document.body).findByText(
      i18n.t('stories.overlays.boardSettings', { ns: 'ui' }),
      undefined,
      { timeout: 3000 },
    )
    await expect(tooltip).toBeInTheDocument()
  },
}

function BasicTooltip() {
  const { t } = useTranslation('ui')
  return (
    <div className="p-24">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-m"
              aria-label={t('stories.overlays.boardSettings')}
            />
          }
        >
          <Icon name="settings" />
        </TooltipTrigger>
        <TooltipContent className="w-[190px] justify-center">
          {t('stories.overlays.boardSettings')}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
