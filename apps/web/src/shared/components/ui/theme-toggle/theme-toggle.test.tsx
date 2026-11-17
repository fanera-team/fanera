import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { useThemeStore } from '@/shared/lib/theme-store'
import { ThemeToggle } from './theme-toggle'

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  useThemeStore.setState({ theme: 'light' })
  await i18n.changeLanguage('ru')
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.replaceChildren()
  document.documentElement.classList.remove('dark')
})

test('selects each theme and saves the choice', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  await act(async () => root.render(<ThemeToggle />))
  const [light, dark] = container.querySelectorAll('button')
  expect(light.getAttribute('aria-pressed')).toBe('true')
  expect(dark.getAttribute('aria-pressed')).toBe('false')
  expect(container.querySelectorAll('svg')).toHaveLength(2)

  await act(async () => dark.click())
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(localStorage.getItem('fanera-theme')).toBe('dark')
  expect(dark.getAttribute('aria-pressed')).toBe('true')

  await act(async () => light.click())
  expect(document.documentElement.classList.contains('dark')).toBe(false)
  expect(localStorage.getItem('fanera-theme')).toBe('light')

  await act(async () => root.unmount())
})

test('starts in the theme restored before React mounts', async () => {
  localStorage.setItem('fanera-theme', 'dark')
  document.documentElement.classList.add('dark')
  useThemeStore.setState({ theme: 'dark' })
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  await act(async () => root.render(<ThemeToggle />))
  expect(container.querySelectorAll('button')[1].getAttribute('aria-pressed')).toBe('true')

  await act(async () => root.unmount())
})

test('keeps multiple theme switches in sync', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  await act(async () =>
    root.render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    ),
  )
  const buttons = container.querySelectorAll('button')

  await act(async () => buttons[1].click())
  expect([...buttons].map((button) => button.getAttribute('aria-pressed'))).toEqual([
    'false',
    'true',
    'false',
    'true',
  ])
  expect(document.documentElement.classList.contains('dark')).toBe(true)

  await act(async () => root.unmount())
})

test('uses English labels when the language changes', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)

  await act(async () => root.render(<ThemeToggle />))
  const buttons = container.querySelectorAll('button')
  expect(buttons[0].getAttribute('aria-label')).toBe('Светлая тема')

  await act(async () => {
    await i18n.changeLanguage('en')
  })
  expect(buttons[0].getAttribute('aria-label')).toBe('Light theme')
  expect(buttons[1].getAttribute('aria-label')).toBe('Dark theme')

  await act(async () => root.unmount())
})
