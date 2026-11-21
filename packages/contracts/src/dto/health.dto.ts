import { z } from 'zod'
import { healthSchema } from '../schemas/health.schema.js'

export type HealthDto = z.infer<typeof healthSchema>
