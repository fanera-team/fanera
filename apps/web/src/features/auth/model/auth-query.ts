import { useQuery } from '@tanstack/react-query'
import { refreshSession } from '@/shared/api'

export const authQueryKey = ['auth', 'session'] as const

export function useAuthQuery() {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: async () => (await refreshSession())?.user ?? null,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}
