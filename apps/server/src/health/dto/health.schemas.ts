import { z } from 'zod';

export const dependencyStatusSchema = z.enum(['up', 'down']);

export type DependencyStatus = z.infer<typeof dependencyStatusSchema>;

/** Результат проверки зависимостей — то, что возвращает сервис. */
export const healthReportSchema = z.object({
  status: z.enum(['ok', 'error']),
  postgres: dependencyStatusSchema,
  redis: dependencyStatusSchema,
});

export type HealthReport = z.infer<typeof healthReportSchema>;

const healthResponseBase = healthReportSchema.extend({
  uptime: z.number().meta({ description: 'Секунд с запуска процесса' }),
});

export const healthSchema = healthResponseBase
  .extend({ status: z.literal('ok') })
  .meta({ id: 'Health' });

export const healthUnavailableSchema = healthResponseBase
  .extend({ status: z.literal('error') })
  .meta({ id: 'HealthUnavailable' });

export type Health = z.infer<typeof healthSchema>;
export type HealthUnavailable = z.infer<typeof healthUnavailableSchema>;
export type HealthResponse = Health | HealthUnavailable;
