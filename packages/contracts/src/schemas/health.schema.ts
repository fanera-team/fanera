import { z } from 'zod'

export const healthStatusSchema = z.enum(['ok', 'error'])
export type HealthStatus = z.infer<typeof healthStatusSchema>

export const dependencyStatusSchema = z.enum(['up', 'down'])
export type DependencyStatus = z.infer<typeof dependencyStatusSchema>

export const healthSchema = z.object({
  status: healthStatusSchema,
  postgres: dependencyStatusSchema,
  redis: dependencyStatusSchema,
  uptime: z.number(),
})
export type HealthResponse = z.infer<typeof healthSchema>
