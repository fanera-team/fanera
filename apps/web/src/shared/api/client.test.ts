import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './client'
import { clearAccessToken, getAccessToken, setAccessToken } from './access-token'
import { subscribeToSessionExpiry } from './auth'
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

  it('does not clear a newer token when a retry gets a late 401', async () => {
    setAccessToken('old')
    let resolveFirstRefresh!: (response: Response) => void
    let resolveSecondRefresh!: (response: Response) => void
    let resolveLate401!: (response: Response) => void
    const firstRefresh = new Promise<Response>((resolve) => {
      resolveFirstRefresh = resolve
    })
    const secondRefresh = new Promise<Response>((resolve) => {
      resolveSecondRefresh = resolve
    })
    const late401 = new Promise<Response>((resolve) => {
      resolveLate401 = resolve
    })
    let refreshCount = 0
    const fetchMock = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (String(url) === '/api/auth/refresh') {
        refreshCount += 1
        return refreshCount === 1 ? firstRefresh : secondRefresh
      }
      const token = new Headers(init?.headers).get('Authorization')
      if (String(url) === '/api/resource' && token === 'Bearer old')
        return new Response('', { status: 401 })
      if (String(url) === '/api/resource' && token === 'Bearer new') return late401
      if (String(url) === '/api/other' && token === 'Bearer new')
        return new Response('', { status: 401 })
      return new Response('{}', { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)
    const onExpired = vi.fn()
    const unsubscribe = subscribeToSessionExpiry(onExpired)

    const resourceRequest = apiRequest('/resource')
    await vi.waitFor(() => expect(refreshCount).toBe(1))
    resolveFirstRefresh(
      new Response(JSON.stringify({ ...mockAuthResponse, accessToken: 'new' }), { status: 200 }),
    )
    await vi.waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([url]) => url === '/api/resource' && fetchMock.mock.calls.length >= 3,
        ),
      ).toBe(true),
    )

    const otherRequest = apiRequest('/other')
    await vi.waitFor(() => expect(refreshCount).toBe(2))
    resolveSecondRefresh(
      new Response(JSON.stringify({ ...mockAuthResponse, accessToken: 'newer' }), { status: 200 }),
    )
    await expect(otherRequest).resolves.toBeInstanceOf(Response)
    resolveLate401(new Response('', { status: 401 }))

    await expect(resourceRequest).rejects.toMatchObject({ status: 401 })
    expect(getAccessToken()).toBe('newer')
    expect(onExpired).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('does not trigger a second refresh when parallel unauthenticated requests fail refresh', async () => {
    let refreshCalls = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
        if (url.endsWith('/auth/refresh')) {
          refreshCalls += 1
          return new Response('', { status: 401 })
        }
        return new Response('', { status: 401 })
      }),
    )

    await expect(Promise.all([apiRequest('/boards'), apiRequest('/boards')])).rejects.toThrow()
    expect(refreshCalls).toBe(1)
  })
})
