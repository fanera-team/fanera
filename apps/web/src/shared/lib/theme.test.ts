import { afterEach, expect, test, vi } from 'vitest'
import { setTheme } from './theme'

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

test('applies and persists the last requested theme', () => {
  setTheme('dark')
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  setTheme('light')
  expect(document.documentElement.classList.contains('dark')).toBe(false)
  expect(localStorage.getItem('fanera-theme')).toBe('light')
})

test('applies the theme when storage rejects writes', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage unavailable')
  })

  expect(() => setTheme('dark')).not.toThrow()
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})
