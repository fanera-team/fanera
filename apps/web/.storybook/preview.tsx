import type { Preview } from '@storybook/react-vite'

import '../src/shared/styles/globals.css'

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
    (Story, context) => (
      <div
        className={`${context.globals.theme === 'dark' ? 'dark' : ''} bg-background text-foreground`}
      >
        <Story />
      </div>
    ),
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
