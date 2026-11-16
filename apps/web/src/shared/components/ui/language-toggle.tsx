import { useTranslation } from 'react-i18next'
import { resolveLanguage } from '@/shared/lib/language'
import { SegmentedToggle } from './segmented-toggle'

export function LanguageToggle() {
  const { t, i18n } = useTranslation('ui')

  return (
    <SegmentedToggle
      label={t('language.label')}
      value={resolveLanguage(i18n.resolvedLanguage)}
      options={[
        { value: 'ru', label: t('language.ru'), content: 'RU' },
        { value: 'en', label: t('language.en'), content: 'EN' },
      ]}
      onValueChange={(language) => void i18n.changeLanguage(language)}
    />
  )
}
