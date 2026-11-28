import { useTranslation } from 'react-i18next'

export function BoardsPage() {
  const { t } = useTranslation('ui')
  return <h1>{t('auth.boardsPlaceholder')}</h1>
}
