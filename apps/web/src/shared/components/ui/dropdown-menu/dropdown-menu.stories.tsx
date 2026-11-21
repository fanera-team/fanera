import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
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
import { i18n } from '@/shared/lib/i18n'

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
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
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

function DesignSampleMenu() {
  const { t } = useTranslation('ui')
  return (
    <div className="p-4 min-h-[360px]">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {t('examples.actions')}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex min-h-[300px] flex-col justify-between">
          <DropdownMenuItem>{t('examples.rename')}</DropdownMenuItem>
          <DropdownMenuItem>{t('stories.overlays.duplicate')}</DropdownMenuItem>
          <DropdownMenuItem>{t('stories.overlays.share')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>{t('stories.overlays.export')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">{t('examples.delete')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const DesignSample: Story = {
  render: () => <DesignSampleMenu />,
  play: async () => {
    const duplicate = await within(document.body).findByRole('menuitem', {
      name: i18n.t('stories.overlays.duplicate', { ns: 'ui' }),
    })
    await userEvent.hover(duplicate)
  },
}
