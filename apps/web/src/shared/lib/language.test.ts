import { expect, test } from 'vitest'
import { resolveLanguage } from './language'

test('accepts both supported languages and regional variants', () => {
  expect(resolveLanguage('ru-RU')).toBe('ru')
  expect(resolveLanguage('en-US')).toBe('en')
  expect(resolveLanguage('EN_gb')).toBe('en')
})

test('falls back to Russian for an absent or unsupported language', () => {
  expect(resolveLanguage(null)).toBe('ru')
  expect(resolveLanguage('de-DE')).toBe('ru')
})
