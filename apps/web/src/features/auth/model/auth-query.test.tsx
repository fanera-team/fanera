import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAccessToken, getAccessToken } from '@/shared/api'
import { mockAuthResponse } from '@/shared/api/test-fixtures'
import { authQueryKey, useAuthQuery } from './auth-query'

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

describe('useAuthQuery', () => {
  it('loads the session once and keeps only user data in the query cache', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify(mockAuthResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useAuthQuery(), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual(mockAuthResponse.user))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(getAccessToken()).toBe(mockAuthResponse.accessToken)
    expect(queryClient.getQueryData(authQueryKey)).toEqual(mockAuthResponse.user)
  })
})
