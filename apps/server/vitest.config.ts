import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Алиасы путей из tsconfig.json (их добавляет, например, `nest g library`)
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    // Пока unit-тестов нет — не считать это ошибкой.
    passWithNoTests: true,
    coverage: {
      // Без include в отчёт попадают только файлы, которые тесты загрузили,
      // и непротестированный код просто не виден.
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts'],
    },
  },
});
