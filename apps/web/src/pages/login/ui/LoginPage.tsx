import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { t } = useTranslation('ui')
  return <h1>{t('auth.loginPlaceholder')}</h1>
}
