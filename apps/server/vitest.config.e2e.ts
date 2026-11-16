import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Переменные процесса важнее .env — тесты не зависят от локальных настроек
    // Postgres и Redis в e2e подменяются, URL нужны только для проверки env-схемы
    env: {
      WEB_ORIGIN: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      REDIS_URL: 'redis://localhost:6379',
    },
  },
});
