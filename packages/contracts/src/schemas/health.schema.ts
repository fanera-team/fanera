import { z } from 'zod'

export const healthSchema = z.object({
  status: z.enum(['ok', 'error']),
  postgres: z.enum(['up', 'down']),
  redis: z.enum(['up', 'down']),
  uptime: z.number(),
})
