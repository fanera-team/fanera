import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import { Toaster } from '../sonner/sonner'
import { toast } from './toast'

function ToastDemo() {
  const { t } = useTranslation('ui')
  return (
    <>
      <button onClick={() => toast.success(t('examples.boardSaved'))}>
        {t('examples.success')}
      </button>
      <button onClick={() => toast.error(t('examples.saveFailed'))}>{t('examples.error')}</button>
      <Toaster />
    </>
  )
}

describe('Toast', () => {
  it('показывает успех', async () => {
    const user = userEvent.setup()
    render(<ToastDemo />)
    await user.click(screen.getByRole('button', { name: 'Success' }))
    expect(await screen.findByText('Board saved')).toBeInTheDocument()
  })

  it('показывает ошибку', async () => {
    const user = userEvent.setup()
    render(<ToastDemo />)
    await user.click(screen.getByRole('button', { name: 'Error' }))
    expect(await screen.findByText('Failed to save')).toBeInTheDocument()
  })
})
