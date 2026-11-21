import { loadEnv } from 'vite';

/**
 * База для e2e-тестов: отдельная от рабочей, чтобы тесты не трогали твои данные.
 * Берётся из TEST_DATABASE_URL (переменная окружения или apps/server/.env),
 * иначе — база fanera_test в Postgres из docker-compose.yml.
 * Если базы нет, prisma migrate deploy создаст её сам.
 */
export function testDatabaseUrl(): string {
  const env = loadEnv('test', import.meta.dirname + '/..', '');
  return (
    env['TEST_DATABASE_URL'] ??
    'postgresql://fanera:fanera@localhost:5432/fanera_test'
  );
}
