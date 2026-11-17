import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from '../button/button'
import { useTranslation } from 'react-i18next'

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
    await userEvent.hover(canvas.getByRole('button', { name: 'Hover over me' }))
    const tooltip = await within(document.body).findByText('Tooltip', undefined, { timeout: 3000 })
    await expect(tooltip).toBeInTheDocument()
  },
}

function BasicTooltip() {
  const { t } = useTranslation('ui')
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        {t('examples.hoverCursor')}
      </TooltipTrigger>
      <TooltipContent>{t('examples.tooltip')}</TooltipContent>
    </Tooltip>
  )
}
