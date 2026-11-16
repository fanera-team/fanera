import { afterEach, beforeEach, expect, test, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  document.documentElement.lang = 'ru'
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

test('prefers the saved language over the browser language on startup', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU')
  localStorage.setItem('fanera.locale', 'en')

  const { i18n } = await import('./i18n')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
})

test('uses the browser language when no preference is saved', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')

  const { i18n } = await import('./i18n')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
})

test('uses the browser language when reading storage fails', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Storage unavailable')
  })

  const { i18n } = await import('./i18n')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
})

test('still switches language when writing storage fails', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU')
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage unavailable')
  })

  const { i18n } = await import('./i18n')
  await i18n.changeLanguage('en')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
})

test('switches text, document language, and saved preference', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU')
  const { i18n } = await import('./i18n')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind работает!')
  await i18n.changeLanguage('en')

  expect(i18n.t('demo.heading', { ns: 'ui' })).toBe('Tailwind works!')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem('fanera.locale')).toBe('en')
})
