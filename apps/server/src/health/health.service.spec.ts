import { Test } from '@nestjs/testing';
import { PostgresService } from '../infra/postgres/postgres.service.js';
import { RedisService } from '../infra/redis/redis.service.js';
import { HEALTH_CHECK_TIMEOUT_MS, HealthService } from './health.service.js';

describe('HealthService', () => {
  const postgres = { ping: vi.fn<() => Promise<void>>() };
  const redis = { ping: vi.fn<() => Promise<void>>() };
  let service: HealthService;

  beforeEach(async () => {
    postgres.ping.mockResolvedValue(undefined);
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PostgresService, useValue: postgres },
        { provide: RedisService, useValue: redis },
      ],
    }).compile();

    service = moduleRef.get(HealthService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ok, когда Postgres и Redis отвечают', async () => {
    await expect(service.check()).resolves.toEqual({
      status: 'ok',
      postgres: 'up',
      redis: 'up',
    });
  });

  it('error, когда Redis отвечает ошибкой', async () => {
    redis.ping.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(service.check()).resolves.toEqual({
      status: 'error',
      postgres: 'up',
      redis: 'down',
    });
  });

  it('error, когда Postgres отвечает ошибкой', async () => {
    postgres.ping.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(service.check()).resolves.toEqual({
      status: 'error',
      postgres: 'down',
      redis: 'up',
    });
  });

  it('считает зависшую зависимость недоступной по таймауту', async () => {
    vi.useFakeTimers();
    postgres.ping.mockReturnValue(new Promise(() => {})); // не ответит никогда

    const result = service.check();
    await vi.advanceTimersByTimeAsync(HEALTH_CHECK_TIMEOUT_MS);

    await expect(result).resolves.toEqual({
      status: 'error',
      postgres: 'down',
      redis: 'up',
    });
  });
});
