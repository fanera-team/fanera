import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { plugin as featureSlicedPlugin } from '@conarti/eslint-plugin-feature-sliced'
import { resolve } from 'node:path'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/*.config.*'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
)
