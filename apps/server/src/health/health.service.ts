import { Injectable } from '@nestjs/common';
import type { DependencyStatus, HealthResponse } from '@fanera/contracts';
import { PostgresService } from '../infra/postgres/postgres.service.js';
import { RedisService } from '../infra/redis/redis.service.js';

type HealthReport = Pick<HealthResponse, 'status' | 'postgres' | 'redis'>;

/** Сколько ждать ответа зависимости, прежде чем считать её недоступной. */
export const HEALTH_CHECK_TIMEOUT_MS = 2000;

@Injectable()
export class HealthService {
  constructor(
    private readonly postgres: PostgresService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthReport> {
    // Параллельно: зависший Postgres не задерживает проверку Redis
    const [postgres, redis] = await Promise.all([
      probe(() => this.postgres.ping()),
      probe(() => this.redis.ping()),
    ]);

    const status = postgres === 'up' && redis === 'up' ? 'ok' : 'error';

    return { status, postgres, redis };
  }
}

/** 'up', если ping успел ответить без ошибки за HEALTH_CHECK_TIMEOUT_MS. */
async function probe(ping: () => Promise<void>): Promise<DependencyStatus> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('timeout')),
      HEALTH_CHECK_TIMEOUT_MS,
    );
  });

  try {
    await Promise.race([ping(), timeout]);
    return 'up';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}
