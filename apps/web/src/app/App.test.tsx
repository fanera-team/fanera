import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import '@/shared/lib/i18n'
import App from './App'

afterEach(() => vi.unstubAllGlobals())

describe('App layout', () => {
  it('сдвигает содержимое при закреплении и накладывает откреплённую панель', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const user = userEvent.setup()
    render(<App />)

    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveAttribute('data-pinned', 'true')
    expect(screen.getByRole('main')).toBeInTheDocument()

    await user.click(within(sidebar).getByRole('button', { name: 'Unpin sidebar' }))
    expect(sidebar).toHaveAttribute('data-pinned', 'false')
    expect(screen.getAllByRole('button', { name: 'Close sidebar' })).toHaveLength(2)

    await user.click(within(sidebar).getByRole('button', { name: 'Pin sidebar' }))
    expect(sidebar).toHaveAttribute('data-pinned', 'true')
    expect(screen.getAllByRole('button', { name: 'Close sidebar' })).toHaveLength(1)

    await user.click(within(sidebar).getByRole('button', { name: 'Close sidebar' }))
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open sidebar' })).toBeInTheDocument()
  })

  it('открывает панель поверх содержимого на узком экране и закрывает её по подложке', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open sidebar' }))
    expect(screen.getByRole('complementary')).toHaveAttribute('data-pinned', 'false')

    await user.click(screen.getAllByRole('button', { name: 'Close sidebar' })[0])
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
