import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/button'
import { Toaster } from '../sonner/sonner'
import { toast } from './toast'
import { useTranslation } from 'react-i18next'

const meta = {
  title: 'Shared/UI/Toast',
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SuccessAndError: Story = {
  render: () => <ToastExamples />,
}

function ToastExamples() {
  const { t } = useTranslation('ui')
  return (
    <div className="gap-2 flex">
      <Button onClick={() => toast.success(t('examples.boardSaved'))}>
        {t('examples.success')}
      </Button>
      <Button variant="destructive" onClick={() => toast.error(t('examples.saveFailed'))}>
        {t('examples.error')}
      </Button>
    </div>
  )
}
