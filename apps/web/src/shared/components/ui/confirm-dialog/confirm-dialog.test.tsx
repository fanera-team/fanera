import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './confirm-dialog'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'

function Harness({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>{t('confirmDialog.deleteBoardTrigger')}</button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('confirmDialog.deleteBoardTitle')}
        onConfirm={onConfirm}
      />
    </>
  )
}

describe('ConfirmDialog', () => {
  it('подтверждение вызывает onConfirm', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Delete board' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('Отмена закрывает без подтверждения', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Delete board' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('Esc закрывает и возвращает фокус', async () => {
    const user = userEvent.setup()
    render(<Harness onConfirm={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: 'Delete board' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
