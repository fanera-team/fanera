import { create } from 'zustand'
import { getTheme, setTheme, type Theme } from './theme'

interface ThemeState {
  theme: Theme
  changeTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: getTheme(),
  changeTheme: (theme) => {
    setTheme(theme)
    set({ theme })
  },
  toggleTheme: () => {
    get().changeTheme(get().theme === 'light' ? 'dark' : 'light')
  },
}))
