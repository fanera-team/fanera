import enCommon from '@fanera/i18n/locales/en/common'
import enErrors from '@fanera/i18n/locales/en/errors'
import enUi from '@fanera/i18n/locales/en/ui'
import enValidation from '@fanera/i18n/locales/en/validation'
import ruCommon from '@fanera/i18n/locales/ru/common'
import ruErrors from '@fanera/i18n/locales/ru/errors'
import ruUi from '@fanera/i18n/locales/ru/ui'
import ruValidation from '@fanera/i18n/locales/ru/validation'
import { expect, test } from 'vitest'

function translationKeys(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof child === 'string' ? [path] : translationKeys(child, path)
  })
}

test.each([
  ['common', ruCommon, enCommon],
  ['errors', ruErrors, enErrors],
  ['validation', ruValidation, enValidation],
  ['ui', ruUi, enUi],
])('%s has the same keys in both languages', (_name, ru, en) => {
  expect(translationKeys(ru).sort()).toEqual(translationKeys(en).sort())
})
