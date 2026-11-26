import { QueryClient } from '@tanstack/react-query'
import { authQueryKey } from '@/features/auth'
import { subscribeToSessionExpiry } from '@/shared/api'

export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

subscribeToSessionExpiry(() => queryClient.setQueryData(authQueryKey, null))
