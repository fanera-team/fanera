import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'

function TestDialog() {
  const { t } = useTranslation('ui')
  return (
    <Dialog>
      <DialogTrigger>{t('examples.open')}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('examples.title')}</DialogTitle>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('открывается по клику на триггер', async () => {
    const user = userEvent.setup()
    render(<TestDialog />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('закрывается по Esc и возвращает фокус на триггер', async () => {
    const user = userEvent.setup()
    render(<TestDialog />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
