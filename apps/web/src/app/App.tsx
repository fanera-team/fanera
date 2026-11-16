import { Counter } from '@/features/counter'
import { resolveLanguage } from '@/shared/lib/language'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation('ui')

  return (
    <main className="bg-neutral-600 flex min-h-screen items-center justify-center">
      <div className="flex flex-col">
        <label className="mb-4 gap-2 text-white flex items-center">
          {t('language.label')}
          <select
            aria-label={t('language.label')}
            value={resolveLanguage(i18n.resolvedLanguage)}
            onChange={(event) => void i18n.changeLanguage(event.target.value)}
            className="bg-neutral-800 p-1"
          >
            <option value="ru">{t('language.ru')}</option>
            <option value="en">{t('language.en')}</option>
          </select>
        </label>
        <h1 className="text-4xl font-bold text-white underline">{t('demo.heading')}</h1>
        <div className="mt-4">
          <Counter />
        </div>
      </div>
    </main>
  )
}

export default App
