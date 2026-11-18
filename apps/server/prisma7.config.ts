import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// Prisma CLI запускается без Nest и сам .env не читает.
// В CI файла .env нет: переменные приходят из окружения.
if (existsSync('.env')) process.loadEnvFile();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Команда для prisma db seed
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
