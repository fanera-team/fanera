import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Переменные процесса важнее .env — тесты не зависят от локальных настроек
    env: { WEB_ORIGIN: 'http://localhost:3000' },
  },
});
