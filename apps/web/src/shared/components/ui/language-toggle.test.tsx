import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { LanguageToggle } from './language-toggle'

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  localStorage.clear()
  await i18n.changeLanguage('ru')
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

test('switches language, updates labels, and saves the choice', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  await act(async () => root.render(<LanguageToggle />))
  const [russian, english] = container.querySelectorAll('button')
  expect(russian.getAttribute('aria-pressed')).toBe('true')
  expect(english.getAttribute('aria-pressed')).toBe('false')
  expect(container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Язык')
  const indicator = container.querySelector('[data-segmented-indicator]') as HTMLElement
  expect(indicator.style.transform).toBe('translateX(0px)')

  await act(async () => english.click())
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem('fanera.locale')).toBe('en')
  expect(english.getAttribute('aria-pressed')).toBe('true')
  expect(container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Language')
  expect(indicator.style.transform).toBe('translateX(52px)')

  await act(async () => root.unmount())
})
