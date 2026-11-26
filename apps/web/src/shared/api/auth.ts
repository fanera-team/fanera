import { authResponseSchema, type AuthResponse } from '@fanera/contracts'
import { clearAccessToken, setAccessToken } from './access-token'

let refreshInFlight: Promise<AuthResponse | null> | null = null
const listeners = new Set<() => void>()

export function subscribeToSessionExpiry(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifySessionExpired() {
  clearAccessToken()
  listeners.forEach((listener) => listener())
}

export function refreshSession(): Promise<AuthResponse | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
    if (response.status === 401) {
      notifySessionExpired()
      return null
    }
    if (!response.ok) throw new Error(`Refresh failed: ${response.status}`)
    const result = authResponseSchema.parse(await response.json())
    setAccessToken(result.accessToken)
    return result
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}
