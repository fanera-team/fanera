import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import { i18n } from '@/shared/lib/i18n'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'

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
  const t = (key: string) => i18n.t(key, { ns: 'ui' })
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

  it.each([
    ['s', 'max-w-[400px]'],
    ['m', 'max-w-[536px]'],
    ['l', 'max-w-[720px]'],
  ] as const)('задаёт размер %s из макета', async (size, width) => {
    render(
      <Dialog defaultOpen>
        <DialogContent size={size}>
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', size)
    expect(screen.getByRole('dialog')).toHaveClass(width)
  })

  it('выбирает фиксированную высоту по умолчанию и высоту по содержимому по запросу', () => {
    const { rerender } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('h-[380px]')
    rerender(
      <Dialog defaultOpen>
        <DialogContent autoHeight>
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-auto-height', 'true')
    expect(screen.getByRole('dialog')).not.toHaveClass('h-[380px]')
  })

  it('центрирует окно относительно обеих осей viewport', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    const popup = screen.getByRole('dialog')
    expect(popup).toHaveClass('top-1/2', 'left-1/2')
    expect(popup.style.translate).toBe('-50% -50%')
    expect(popup.style.transform).toBe('translate(0px)')
  })

  it('пропускает клик на страницу в немодальном режиме без backdrop', async () => {
    const click = vi.fn()
    const user = userEvent.setup()
    render(
      <>
        <button onClick={click}>{t('examples.actions')}</button>
        <Dialog defaultOpen modal={false} disablePointerDismissal>
          <DialogContent>
            <DialogTitle>{t('examples.title')}</DialogTitle>
          </DialogContent>
        </Dialog>
      </>,
    )
    expect(document.querySelector('[data-slot="dialog-overlay"]')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: t('examples.actions') }))
    expect(click).toHaveBeenCalledOnce()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('остаётся открытым после клика по backdrop при closeOnOutsideClick=false', async () => {
    const user = userEvent.setup()
    render(
      <Dialog defaultOpen closeOnOutsideClick={false}>
        <DialogContent>
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement
    await user.click(overlay)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('передаёт действия футера с disabled и обработчиком', async () => {
    const save = vi.fn()
    const user = userEvent.setup()
    render(
      <Dialog defaultOpen>
        <DialogContent
          footerActions={[
            {
              label: t('confirmDialog.cancel'),
              onClick: vi.fn(),
              variant: 'outline',
              disabled: true,
            },
            { label: t('confirmDialog.confirm'), onClick: save },
          ]}
        >
          <DialogTitle>{t('examples.title')}</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: t('confirmDialog.cancel') })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: t('confirmDialog.confirm') }))
    expect(save).toHaveBeenCalledOnce()
  })

  it('перетаскивает за заголовок в пределах viewport и не перехватывает кнопку', () => {
    const action = vi.fn()
    const header = (
      <DialogHeader>
        <DialogTitle>{t('examples.title')}</DialogTitle>
        <button onClick={action}>{t('examples.actions')}</button>
      </DialogHeader>
    )
    render(
      <Dialog defaultOpen>
        <DialogContent draggable>{header}</DialogContent>
      </Dialog>,
    )
    const popup = screen.getByRole('dialog')
    const handle = popup.querySelector('[data-slot="dialog-header"]') as HTMLElement
    expect(handle).toHaveClass('cursor-grab')
    handle.setPointerCapture = vi.fn()
    handle.hasPointerCapture = vi.fn(() => true)
    handle.releasePointerCapture = vi.fn()
    vi.spyOn(popup, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      right: 500,
      bottom: 480,
      width: 400,
      height: 380,
      x: 100,
      y: 100,
      toJSON: () => {},
    })
    fireEvent.pointerDown(popup, { button: 0, pointerId: 3, clientX: 150, clientY: 150 })
    fireEvent.pointerMove(handle, { pointerId: 3, clientX: 300, clientY: 300 })
    expect(popup.style.transform).toBe('translate(0px)')
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 150, clientY: 150 })
    expect(document.documentElement.style.cursor).toBe('grabbing')
    expect(handle).toHaveAttribute('data-dragging', 'true')
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 160, clientY: 170 })
    expect(popup.style.transform).toBe('translate(10px, 20px)')
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 10000, clientY: 10000 })
    expect(popup.style.transform).toBe(
      `translate(${window.innerWidth - 500}px, ${window.innerHeight - 480}px)`,
    )
    fireEvent.pointerUp(handle, { pointerId: 1 })
    expect(handle.releasePointerCapture).toHaveBeenCalledWith(1)
    expect(handle).not.toHaveAttribute('data-dragging')
    expect(document.documentElement.style.cursor).toBe('')
    fireEvent.pointerDown(screen.getByRole('button', { name: t('examples.actions') }), {
      button: 0,
      pointerId: 2,
    })
    expect(handle.setPointerCapture).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: t('examples.actions') }))
    expect(action).toHaveBeenCalledOnce()
  })
})
