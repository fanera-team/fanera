import { defineConfig } from 'vitest/config';
import { testDatabaseUrl } from './test/test-database-url.js';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Переменные процесса важнее .env — тесты не зависят от локальных настроек.
    // DATABASE_URL — тестовая база (нужен docker compose), Redis в e2e подменяется
    env: {
      WEB_ORIGIN: 'http://localhost:3000',
      DATABASE_URL: testDatabaseUrl(),
      REDIS_URL: 'redis://localhost:6379',
    },
  },
});
