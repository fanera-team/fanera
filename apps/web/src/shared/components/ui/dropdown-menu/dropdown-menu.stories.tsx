import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from '../button/button'
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog'
import { Toaster } from '../sonner/sonner'
import { toast } from '../toast/toast'
import { useTranslation } from 'react-i18next'

const meta = {
  title: 'Shared/UI/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

function BoardActionsDemo() {
  const { t } = useTranslation('ui')
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {t('examples.actions')}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => toast.success(t('examples.boardRenamed'))}>
            {t('examples.rename')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => setConfirmOpen(true)}>
            {t('examples.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('confirmDialog.deleteBoardTitle')}
        description={t('confirmDialog.deleteBoardDescription')}
        onConfirm={() => {
          setConfirmOpen(false)
          toast.success(t('confirmDialog.deleteBoardSuccess'))
        }}
      />
    </>
  )
}

export const BoardActions: Story = {
  render: () => <BoardActionsDemo />,
}
