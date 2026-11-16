import { afterEach, expect, test } from 'vitest'
import { i18n } from './i18n'

afterEach(async () => {
  await i18n.changeLanguage('ru')
})

test('switches text and document language between Russian and English', async () => {
  await i18n.changeLanguage('ru')
  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind работает!')

  await i18n.changeLanguage('en')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem('fanera.locale')).toBe('en')
})
