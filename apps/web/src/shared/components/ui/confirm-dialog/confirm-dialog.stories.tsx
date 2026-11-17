import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmDialog } from './confirm-dialog'
import { Button } from '../button/button'
import { Toaster } from '../sonner/sonner'
import { toast } from '../toast/toast'
import { useTranslation } from 'react-i18next'

const meta = {
  title: 'Shared/UI/ConfirmDialog',
  component: ConfirmDialog,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

function DeleteBoardDemo() {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        {t('confirmDialog.deleteBoardTrigger')}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('confirmDialog.deleteBoardTitle')}
        description={t('confirmDialog.deleteBoardDescription')}
        onConfirm={() => {
          setOpen(false)
          toast.success(t('confirmDialog.deleteBoardSuccess'))
        }}
      />
    </>
  )
}

export const DeleteBoard: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    title: 'Delete board?',
    onConfirm: () => {},
  },
  render: () => <DeleteBoardDemo />,
}
