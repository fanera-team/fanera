import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { plugin as featureSlicedPlugin } from '@conarti/eslint-plugin-feature-sliced'
import { resolve } from 'node:path'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/storybook-static', '**/*.config.*'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['docs/system-design/scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: resolve(import.meta.dirname, 'apps/web'),
      },
    },
    plugins: {
      '@conarti/feature-sliced': featureSlicedPlugin,
    },
    rules: {
      '@conarti/feature-sliced/layers-slices': ['error', { allowTypeImports: false }],
      '@conarti/feature-sliced/public-api': 'error',
      '@conarti/feature-sliced/absolute-relative': 'off',
    },
  },
  {
    files: ['apps/web/src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/[A-Za-zА-Яа-яЁё]/]',
          message: 'Move user-facing text to translations and render it with t().',
        },
        {
          selector:
            ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=/[A-Za-zА-Яа-яЁё]/]',
          message: 'Move user-facing text to translations and render it with t().',
        },
        {
          selector:
            'JSXAttribute[name.name=/^(placeholder|title|alt|aria-label|aria-description)$/][value.value=/[A-Za-zА-Яа-яЁё]/]',
          message: 'Move user-facing attribute text to translations and render it with t().',
        },
      ],
    },
  },
)
