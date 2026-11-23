import { z } from 'zod'

export const healthStatusSchema = z.enum(['ok', 'error'])

export type HealthStatus = z.infer<typeof healthStatusSchema>

export const dependencyStatusSchema = z.enum(['up', 'down'])

export type DependencyStatus = z.infer<typeof dependencyStatusSchema>

export const healthSchema = z.object({
  status: healthStatusSchema,
  postgres: dependencyStatusSchema,
  redis: dependencyStatusSchema,
  uptime: z.number().meta({ description: 'Секунд с запуска процесса' }),
})

export type HealthResponse = z.infer<typeof healthSchema>

export const healthOkSchema = healthSchema
  .extend({ status: z.literal('ok') })
  .meta({ id: 'Health' })

export const healthUnavailableSchema = healthSchema
  .extend({ status: z.literal('error') })
  .meta({ id: 'HealthUnavailable' })
