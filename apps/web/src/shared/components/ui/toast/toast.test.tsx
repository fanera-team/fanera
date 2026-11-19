import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { Toaster } from '../sonner/sonner'
import { toast } from './toast'

function ToastDemo({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <>
      <button onClick={() => toast.success(i18n.t('toast.examples.success'))}>
        {i18n.t('toast.titles.success')}
      </button>
      <button
        onClick={() =>
          toast.error(i18n.t('toast.examples.error'), { title: i18n.t('examples.saveFailed') })
        }
      >
        {i18n.t('toast.titles.error')}
      </button>
      <button onClick={() => toast.info(i18n.t('toast.examples.info'), { onDismiss })}>
        {i18n.t('toast.titles.info')}
      </button>
      <button onClick={() => toast.warning(i18n.t('toast.examples.warning'))}>
        {i18n.t('toast.titles.warning')}
      </button>
      <Toaster />
    </>
  )
}

describe('Toast', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it.each([
    ['success', 'status'],
    ['error', 'alert'],
    ['info', 'status'],
    ['warning', 'status'],
  ] as const)('показывает %s с заголовком и сообщением', async (kind, role) => {
    const user = userEvent.setup()
    render(<ToastDemo />)

    await user.click(screen.getByRole('button', { name: i18n.t(`toast.titles.${kind}`) }))

    const notification = (await screen.findByText(i18n.t(`toast.examples.${kind}`))).closest(
      `[role="${role}"]`,
    )
    expect(notification).toBeInstanceOf(HTMLElement)
    expect(
      within(notification as HTMLElement).getByText(
        kind === 'error' ? i18n.t('examples.saveFailed') : i18n.t(`toast.titles.${kind}`),
      ),
    ).toBeInTheDocument()
    expect(
      within(notification as HTMLElement).getByText(i18n.t(`toast.examples.${kind}`)),
    ).toBeInTheDocument()
  })

  it('закрывается по кнопке и вызывает onDismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<ToastDemo onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', { name: i18n.t('toast.titles.info') }))
    const notification = screen
      .getAllByText(i18n.t('toast.examples.info'))
      .find(
        (element) => element.closest('[data-sonner-toast]')?.getAttribute('data-front') === 'true',
      )
      ?.closest('[role="status"]')
    expect(notification).toBeInstanceOf(HTMLElement)
    fireEvent.click(
      within(notification as HTMLElement).getByRole('button', { name: i18n.t('toast.close') }),
    )

    await waitFor(() => expect(onDismiss).toHaveBeenCalledOnce())
    await waitFor(() => {
      expect(notification?.closest('[data-sonner-toast]')).not.toBeInTheDocument()
    })
  })
})
