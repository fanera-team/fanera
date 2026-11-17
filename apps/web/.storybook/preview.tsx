import type { Preview } from '@storybook/react-vite'
import { useEffect, type ReactNode } from 'react'
import { useGlobals } from 'storybook/preview-api'
import type { Theme } from '@/shared/lib/theme'
import { useThemeStore } from '@/shared/lib/theme-store'
import '@/shared/lib/i18n'
import '@/shared/styles/globals.css'

function ThemePreview({
  theme,
  updateGlobals,
  children,
}: {
  theme: Theme
  updateGlobals: (globals: { theme: Theme }) => void
  children: ReactNode
}) {
  useEffect(() => {
    useThemeStore.getState().changeTheme(theme)
  }, [theme])

  useEffect(
    () =>
      useThemeStore.subscribe((state) => {
        if (state.theme !== theme) updateGlobals({ theme: state.theme })
      }),
    [theme, updateGlobals],
  )

  return <div className="bg-background text-foreground p-4 min-h-screen">{children}</div>
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема оформления',
      toolbar: {
        title: 'Тема',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const [, updateGlobals] = useGlobals()
      const theme: Theme = context.globals.theme === 'dark' ? 'dark' : 'light'
      return (
        <ThemePreview theme={theme} updateGlobals={updateGlobals}>
          <Story />
        </ThemePreview>
      )
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
