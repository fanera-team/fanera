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
  const button = (name: string) => {
    const match = container.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)
    if (!match) throw new Error(`Button ${name} not found`)
    return match
  }

  await act(async () => root.render(<LanguageToggle />))
  const russian = button('Русский')
  const english = button('English')
  expect(russian.getAttribute('aria-pressed')).toBe('true')
  expect(english.getAttribute('aria-pressed')).toBe('false')
  expect(container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Язык')

  await act(async () => english.click())
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem('fanera.locale')).toBe('en')
  expect(button('English').getAttribute('aria-pressed')).toBe('true')
  expect(button('Русский').getAttribute('aria-pressed')).toBe('false')
  expect(container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Language')

  await act(async () => russian.click())
  expect(document.documentElement.lang).toBe('ru')
  expect(localStorage.getItem('fanera.locale')).toBe('ru')
  expect(button('Русский').getAttribute('aria-pressed')).toBe('true')
  expect(button('English').getAttribute('aria-pressed')).toBe('false')
  expect(container.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Язык')

  await act(async () => root.unmount())
})
