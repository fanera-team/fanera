export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'fanera-theme'

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function setTheme(theme: Theme): void {
  const root = document.documentElement

  root.classList.toggle('dark', theme === 'dark')

  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Theme still works for this session when storage is unavailable.
  }
}
