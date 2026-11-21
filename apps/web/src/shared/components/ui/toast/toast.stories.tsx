import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { Button } from '../button/button'
import { Toaster } from '../sonner/sonner'
import { ToastCard, type ToastKind } from './toast-card'
import { toast } from './toast'

const kinds: ToastKind[] = ['info', 'warning', 'error', 'success']

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

export const AllVariants: Story = {
  render: () => <ToastSamples />,
}

export const Interactive: Story = {
  render: () => <ToastExamples />,
}

function ToastSamples() {
  const { t } = useTranslation('ui')

  return (
    <div className="gap-4 grid">
      {kinds.map((kind) => (
        <div key={kind} className="w-full max-w-[408px]">
          <ToastCard
            kind={kind}
            title={t(`toast.titles.${kind}`)}
            message={t(`toast.examples.${kind}`)}
            onClose={() => undefined}
          />
        </div>
      ))}
    </div>
  )
}

function ToastExamples() {
  const { t } = useTranslation('ui')

  return (
    <div className="gap-2 flex flex-wrap">
      {kinds.map((kind) => (
        <Button key={kind} onClick={() => toast[kind](t(`toast.examples.${kind}`))}>
          {t(`toast.titles.${kind}`)}
        </Button>
      ))}
    </div>
  )
}
