import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import App from './App'

// Мокаем useAuthQuery, чтобы AuthGuard всегда считал пользователя авторизованным
vi.mock('@/features/auth/model/auth-query', () => ({
  authQueryKey: ['auth'],
  useAuthQuery: () => ({
    data: { id: 'u1' },
    isPending: false,
    isLoading: false,
  }),
}))

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

beforeEach(async () => {
  window.history.replaceState({}, '', '/boards')
  await i18n.changeLanguage('en')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App layout', () => {
  it('сдвигает содержимое при закреплении и накладывает откреплённую панель', async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const user = userEvent.setup()
    renderApp()

    const sidebar = await screen.findByRole('complementary')
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
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const user = userEvent.setup()
    renderApp()

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: 'Open sidebar' }))
    expect(screen.getByRole('complementary')).toHaveAttribute('data-pinned', 'false')

    await user.click(screen.getAllByRole('button', { name: 'Close sidebar' })[0])
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
