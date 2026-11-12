import { z } from 'zod';

// Переменные окружения: проверяются при старте, новые — сюда и в .env.example
export const envSchema = z.object({
  PORT: z.coerce.number().positive().default(3001),

  // Origin фронта для CORS; .origin убирает лишний "/" в конце, иначе CORS не совпадёт
  WEB_ORIGIN: z
    .url({ protocol: /^https?$/ })
    .default('http://localhost:3000')
    .transform((value) => new URL(value).origin),
});

export type Env = z.infer<typeof envSchema>;
