import { afterEach, expect, test } from 'vitest'
import { setTheme } from './theme'

afterEach(() => {
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
