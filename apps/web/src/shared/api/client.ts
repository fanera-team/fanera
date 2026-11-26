import { problemSchema, type Problem } from '@fanera/contracts'
import { clearAccessToken, getAccessToken } from './access-token'
import { notifySessionExpired, refreshSession } from './auth'

export class ApiError extends Error {
  readonly status: number
  readonly problem: Problem | null

  constructor(status: number, problem: Problem | null, message?: string) {
    super(message ?? problem?.detail ?? `HTTP ${status}`)
    this.status = status
    this.problem = problem
  }
}

async function requestOnce(path: string, init: RequestInit, token: string | null) {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(`/api${path}`, { ...init, headers })
}

async function throwApiError(response: Response): Promise<never> {
  let problem: Problem | null = null
  if (response.headers.get('content-type')?.includes('application/problem+json')) {
    const parsed = problemSchema.safeParse(await response.json())
    if (parsed.success) problem = parsed.data
  }
  throw new ApiError(response.status, problem)
}

export async function apiRequest(path: string, init: RequestInit = {}) {
  const sentToken = getAccessToken()
  const response = await requestOnce(path, init, sentToken)
  if (response.status !== 401 || path === '/auth/refresh') {
    if (!response.ok) return throwApiError(response)
    return response
  }

  const currentToken = getAccessToken()
  if (currentToken && currentToken !== sentToken) {
    const retried = await requestOnce(path, init, currentToken)
    if (retried.status === 401) {
      notifySessionExpired()
      return throwApiError(retried)
    }
    if (!retried.ok) return throwApiError(retried)
    return retried
  }

  const refreshed = await refreshSession()
  if (!refreshed) {
    clearAccessToken()
    return throwApiError(response)
  }
  const retried = await requestOnce(path, init, refreshed.accessToken)
  if (retried.status === 401) notifySessionExpired()
  if (!retried.ok) return throwApiError(retried)
  return retried
}
