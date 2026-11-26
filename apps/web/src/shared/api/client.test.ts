import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './client'
import { clearAccessToken, setAccessToken } from './access-token'
import { mockAuthResponse } from './test-fixtures'

beforeEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearAccessToken()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearAccessToken()
  localStorage.clear()
  sessionStorage.clear()
})

describe('apiRequest', () => {
  it('shares a refresh request across concurrent 401 responses', async () => {
    setAccessToken('old')
    let finishRefresh!: (response: Response) => void
    const pendingRefresh = new Promise<Response>((resolve) => {
      finishRefresh = resolve
    })
    const fetchMock = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (String(url) === '/api/auth/refresh') return pendingRefresh
      if (new Headers(init?.headers).get('Authorization') === 'Bearer new')
        return new Response('{}')
      return new Response('', { status: 401 })
    })
    vi.stubGlobal('fetch', fetchMock)
    const a = apiRequest('/boards')
    const b = apiRequest('/boards')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    finishRefresh(
      new Response(JSON.stringify({ ...mockAuthResponse, accessToken: 'new' }), { status: 200 }),
    )
    await Promise.all([a, b])
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/auth/refresh')).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledTimes(5)
    expect(localStorage.length + sessionStorage.length).toBe(0)
  })
})
