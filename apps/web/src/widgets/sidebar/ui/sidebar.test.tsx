import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import '@/shared/lib/i18n'
import { Sidebar } from './sidebar'

describe('Sidebar', () => {
  it('вызывает действия закрепления, закрытия и выбора пространства', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onPinnedChange = vi.fn()
    const onSelectSpace = vi.fn()
    render(
      <Sidebar
        open
        pinned={false}
        onClose={onClose}
        onPinnedChange={onPinnedChange}
        onSelectSpace={onSelectSpace}
        spaces={[{ id: 'team', name: 'Team' }]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Pin sidebar' }))
    expect(onPinnedChange).toHaveBeenCalledWith(true)
    await user.click(screen.getByRole('button', { name: 'Team' }))
    expect(onSelectSpace).toHaveBeenCalledWith('team')
    await user.click(screen.getByRole('button', { name: 'Close sidebar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('не показывает закрытую панель и блокирует действия без обработчиков', () => {
    const props = { onClose: vi.fn(), onPinnedChange: vi.fn() }
    const { rerender } = render(<Sidebar open pinned {...props} />)
    expect(screen.getByRole('button', { name: 'Home' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Create space' })).toBeDisabled()
    rerender(<Sidebar open={false} pinned {...props} />)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
