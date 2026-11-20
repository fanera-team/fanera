import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { BoardZoomControl } from './board-zoom-control'

beforeAll(async () => {
  await i18n.changeLanguage('ru')
})

describe('BoardZoomControl', () => {
  it('показывает переданный масштаб и отдаёт три действия', async () => {
    const user = userEvent.setup()
    const onZoomIn = vi.fn()
    const onZoomOut = vi.fn()
    const onFitAll = vi.fn()
    const props = { zoomPercent: 100, onZoomIn, onZoomOut, onFitAll }
    const { rerender } = render(<BoardZoomControl {...props} />)

    expect(screen.getByRole('group', { name: 'Масштаб доски' })).toHaveTextContent('100%')
    await user.click(screen.getByRole('button', { name: 'Увеличить масштаб' }))
    await user.click(screen.getByRole('button', { name: 'Уменьшить масштаб' }))
    await user.click(screen.getByRole('button', { name: 'Показать всё' }))
    expect(onZoomIn).toHaveBeenCalledTimes(1)
    expect(onZoomOut).toHaveBeenCalledTimes(1)
    expect(onFitAll).toHaveBeenCalledTimes(1)

    rerender(<BoardZoomControl {...props} zoomPercent={75} />)
    expect(screen.getByRole('group', { name: 'Масштаб доски' })).toHaveTextContent('75%')
  })

  it('блокирует действия на границе масштаба и при общей недоступности', async () => {
    const user = userEvent.setup()
    const onZoomIn = vi.fn()
    const onZoomOut = vi.fn()
    const onFitAll = vi.fn()
    const props = { zoomPercent: 200, onZoomIn, onZoomOut, onFitAll }
    const { rerender } = render(<BoardZoomControl {...props} canZoomIn={false} />)

    expect(screen.getByRole('button', { name: 'Увеличить масштаб' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Увеличить масштаб' }))
    expect(onZoomIn).not.toHaveBeenCalled()

    rerender(<BoardZoomControl {...props} disabled />)
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
      await user.click(button)
    }
    expect(onZoomOut).not.toHaveBeenCalled()
    expect(onFitAll).not.toHaveBeenCalled()
  })
})
