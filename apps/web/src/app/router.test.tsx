import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthGuard, GuestGuard } from '@/features/auth'
import { clearAccessToken } from '@/shared/api'
import { mockAuthResponse } from '@/shared/api/test-fixtures'

beforeEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearAccessToken()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearAccessToken()
})

function renderAt(path: string, authenticated: boolean) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      authenticated
        ? new Response(JSON.stringify(mockAuthResponse), { status: 200 })
        : new Response('', { status: 401 }),
    ),
  )
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(
    [
      {
        element: <GuestGuard />,
        children: [
          { path: '/login', element: <div data-testid="login-page" /> },
          { path: '/register', element: <div data-testid="register-page" /> },
        ],
      },
      {
        element: <AuthGuard />,
        children: [{ path: '/boards', element: <div data-testid="boards-page" /> }],
      },
    ],
    { initialEntries: [path] },
  )
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('auth guards', () => {
  it('redirects anonymous users from boards to login', async () => {
    renderAt('/boards', false)
    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
  })

  it('redirects authenticated users from login to boards', async () => {
    renderAt('/login', true)
    expect(await screen.findByTestId('boards-page')).toBeInTheDocument()
  })

  it('redirects authenticated users from register to boards', async () => {
    renderAt('/register', true)
    expect(await screen.findByTestId('boards-page')).toBeInTheDocument()
  })

  it('shows a retry state on refresh failure and opens boards after retry succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockAuthResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const router = createMemoryRouter(
      [
        {
          element: <GuestGuard />,
          children: [{ path: '/login', element: <div data-testid="login-page" /> }],
        },
        {
          element: <AuthGuard />,
          children: [{ path: '/boards', element: <div data-testid="boards-page" /> }],
        },
      ],
      { initialEntries: ['/boards'] },
    )
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    const retryButton = await screen.findByRole('button', { name: 'Retry' })
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    await user.click(retryButton)
    expect(await screen.findByTestId('boards-page')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
