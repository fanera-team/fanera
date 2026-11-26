import { Navigate, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuthQuery } from '../model/auth-query'

export function AuthGuard() {
  const { t } = useTranslation('ui')
  const auth = useAuthQuery()
  if (auth.isPending) return <p role="status">{t('auth.loading')}</p>
  if (!auth.data) return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestGuard() {
  const { t } = useTranslation('ui')
  const auth = useAuthQuery()
  if (auth.isPending) return <p role="status">{t('auth.loading')}</p>
  if (auth.data) return <Navigate to="/boards" replace />
  return <Outlet />
}
