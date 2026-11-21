import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './confirm-dialog'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'

function Harness({ onConfirm, loading = false }: { onConfirm: () => void; loading?: boolean }) {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>{t('confirmDialog.deleteBoardTrigger')}</button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('confirmDialog.deleteBoardTitle')}
        description={t('confirmDialog.deleteBoardDescription')}
        loading={loading}
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
    expect(screen.getByRole('dialog', { name: 'Delete board?' })).toHaveAttribute('data-size', 'm')
    expect(screen.getByRole('dialog')).toHaveClass('h-[380px]')
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeInTheDocument()
    expect(
      screen.getByText('The board and all its elements will be permanently deleted.'),
    ).toBeInTheDocument()
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

  it('кнопка закрытия закрывает без подтверждения', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Delete board' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('во время загрузки блокирует подтверждение, отмену и закрытие', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} loading />)
    await user.click(screen.getByRole('button', { name: 'Delete board' }))
    const confirm = screen.getByRole('button', { name: 'Delete' })
    expect(confirm).toBeDisabled()
    expect(confirm).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await user.click(confirm)
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
