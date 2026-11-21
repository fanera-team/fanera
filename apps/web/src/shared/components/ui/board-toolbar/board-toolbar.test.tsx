import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { BoardToolbar } from './board-toolbar'

beforeAll(async () => {
  await i18n.changeLanguage('ru')
})

describe('BoardToolbar', () => {
  it('показывает пять инструментов и сообщает о выбранном', async () => {
    const user = userEvent.setup()
    const onToolChange = vi.fn()
    const { rerender } = render(<BoardToolbar activeTool="select" onToolChange={onToolChange} />)

    expect(screen.getByRole('toolbar', { name: 'Инструменты доски' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Выбор' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Стикер' })).toHaveAttribute('aria-keyshortcuts', 'S')

    await user.click(screen.getByRole('button', { name: 'Стикер' }))
    expect(onToolChange).toHaveBeenCalledWith('sticky')
    rerender(<BoardToolbar activeTool="sticky" onToolChange={onToolChange} />)
    expect(screen.getByRole('button', { name: 'Стикер' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('не отдаёт событие для недоступного инструмента', async () => {
    const user = userEvent.setup()
    const onToolChange = vi.fn()
    render(
      <BoardToolbar activeTool="select" onToolChange={onToolChange} disabledTools={['arrow']} />,
    )

    const arrow = screen.getByRole('button', { name: 'Стрелка' })
    expect(arrow).toBeDisabled()
    await user.click(arrow)
    expect(onToolChange).not.toHaveBeenCalled()
  })
})
