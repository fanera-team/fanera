import { execFileSync } from 'node:child_process';
import { testDatabaseUrl } from './test-database-url.js';

// Перед e2e накатываем миграции на тестовую базу (один раз на весь прогон)
export default function setup(): void {
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    cwd: import.meta.dirname + '/..',
    env: { ...process.env, DATABASE_URL: testDatabaseUrl() },
    stdio: 'inherit',
  });
}
