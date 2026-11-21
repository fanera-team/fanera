import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import '@/shared/lib/i18n'
import { Header } from './header'

const user = { name: 'Anna', email: 'anna@example.com' }

describe('Header', () => {
  it('открывает Sidebar и скрывает бургер в открытом состоянии', async () => {
    const onOpenSidebar = vi.fn()
    const { rerender } = render(
      <Header sidebarOpen={false} onOpenSidebar={onOpenSidebar} user={user} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open sidebar' }))
    expect(onOpenSidebar).toHaveBeenCalledOnce()

    rerender(<Header sidebarOpen onOpenSidebar={onOpenSidebar} user={user} />)
    expect(screen.queryByRole('button', { name: 'Open sidebar' })).not.toBeInTheDocument()
  })

  it('показывает аккаунт и выполняет доступное действие меню', async () => {
    const onProfile = vi.fn()
    render(<Header sidebarOpen={false} onOpenSidebar={vi.fn()} user={user} onProfile={onProfile} />)
    await userEvent.click(screen.getByRole('button', { name: 'User menu' }))
    expect(await screen.findByText('anna@example.com')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Profile' }))
    expect(onProfile).toHaveBeenCalledOnce()
  })

  it('закрывает меню по Esc с возвратом фокуса и блокирует действие без обработчика', async () => {
    const keyboard = userEvent.setup()
    render(<Header sidebarOpen={false} onOpenSidebar={vi.fn()} user={user} />)
    const trigger = screen.getByRole('button', { name: 'User menu' })
    await keyboard.click(trigger)
    expect(await screen.findByRole('menuitem', { name: 'Settings' })).toHaveAttribute(
      'data-disabled',
    )
    await keyboard.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
