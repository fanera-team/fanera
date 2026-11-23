import { healthSchema } from '@fanera/contracts';
import { z } from 'zod';

// Уточняем общий контракт для Swagger: 200 и 503 имеют разные значения status.
const healthResponseBase = healthSchema.extend({
  uptime: healthSchema.shape.uptime.meta({
    description: 'Секунд с запуска процесса',
  }),
});

export const healthOkSchema = healthResponseBase
  .extend({ status: z.literal('ok') })
  .meta({ id: 'Health' });

export const healthUnavailableSchema = healthResponseBase
  .extend({ status: z.literal('error') })
  .meta({ id: 'HealthUnavailable' });
