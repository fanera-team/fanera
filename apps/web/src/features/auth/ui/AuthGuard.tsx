import { Navigate, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui'
import { useAuthQuery } from '../model/auth-query'

function SessionCheckError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation('ui')
  return (
    <div role="alert">
      <p>{t('auth.sessionCheckFailed')}</p>
      <Button onClick={onRetry}>{t('auth.retry')}</Button>
    </div>
  )
}

export function AuthGuard() {
  const { t } = useTranslation('ui')
  const auth = useAuthQuery()
  if (auth.isPending) return <p role="status">{t('auth.loading')}</p>
  if (auth.isError) return <SessionCheckError onRetry={() => void auth.refetch()} />
  if (!auth.data) return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestGuard() {
  const { t } = useTranslation('ui')
  const auth = useAuthQuery()
  if (auth.isPending) return <p role="status">{t('auth.loading')}</p>
  if (auth.isError) return <SessionCheckError onRetry={() => void auth.refetch()} />
  if (auth.data) return <Navigate to="/boards" replace />
  return <Outlet />
}
