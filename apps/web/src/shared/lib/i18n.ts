import enCommon from '@fanera/i18n/locales/en/common'
import enErrors from '@fanera/i18n/locales/en/errors'
import enUi from '@fanera/i18n/locales/en/ui'
import enValidation from '@fanera/i18n/locales/en/validation'
import ruCommon from '@fanera/i18n/locales/ru/common'
import ruErrors from '@fanera/i18n/locales/ru/errors'
import ruUi from '@fanera/i18n/locales/ru/ui'
import ruValidation from '@fanera/i18n/locales/ru/validation'
import i18next, { createInstance, type i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, resolveLanguage } from './language'

const STORAGE_KEY = 'fanera.locale'

function getInitialLanguage() {
  try {
    return resolveLanguage(localStorage.getItem(STORAGE_KEY) ?? navigator.language)
  } catch {
    return resolveLanguage(navigator.language)
  }
}

export async function initI18n(instance: I18nInstance = i18next) {
  instance.off('languageChanged')
  instance.on('languageChanged', (language) => {
    document.documentElement.lang = resolveLanguage(language)

    try {
      localStorage.setItem(STORAGE_KEY, resolveLanguage(language))
    } catch {
      // The language still works when browser storage is unavailable.
    }
  })

  await instance.use(initReactI18next).init({
    resources: {
      ru: { common: ruCommon, errors: ruErrors, validation: ruValidation, ui: ruUi },
      en: { common: enCommon, errors: enErrors, validation: enValidation, ui: enUi },
    },
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['ru', 'en'],
    defaultNS: 'ui',
    ns: ['common', 'errors', 'validation', 'ui'],
    initAsync: false,
    interpolation: { escapeValue: false },
  })
  return instance
}

export function createI18n() {
  return initI18n(createInstance())
}

export const i18n = i18next
void initI18n(i18n)
