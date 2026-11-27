import { z } from 'zod';

// Переменные окружения: проверяются при старте, новые — сюда и в .env.example
export const envSchema = z.object({
  // Порт каждой роли: у collab и worker он тоже есть — им нужны /health и /metrics
  API_PORT: z.coerce.number().positive().default(3001),
  COLLAB_PORT: z.coerce.number().positive().default(3002),
  WORKER_PORT: z.coerce.number().positive().default(3003),

  // Origin фронта для CORS; .origin убирает лишний "/" в конце, иначе CORS не совпадёт
  WEB_ORIGIN: z
    .url({ protocol: /^https?$/ })
    .default('http://localhost:3000')
    .transform((value) => new URL(value).origin),

  // Postgres из docker-compose.yml; пример — в .env.example
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

  // Redis из docker-compose.yml; rediss — вариант с TLS
  REDIS_URL: z.url({ protocol: /^rediss?$/ }),
});

export type Env = z.infer<typeof envSchema>;
