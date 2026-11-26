import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const { t } = useTranslation('ui')
  return <h1>{t('auth.registerPlaceholder')}</h1>
}
