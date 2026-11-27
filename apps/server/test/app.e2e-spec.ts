import { healthOkSchema, healthUnavailableSchema } from '@fanera/contracts';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ApiModule } from '../src/app/api.module.js';
import { configureApp } from '../src/configure-app.js';
import { PrismaService } from '../src/infra/prisma/prisma.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

// Postgres и Redis подменяем: здесь проверяем только HTTP-слой.
// Тесты с настоящей БД — в database.e2e-spec.ts.
const prisma = { ping: vi.fn<() => Promise<void>>() };
const redis = { ping: vi.fn<() => Promise<void>>() };

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    prisma.ping.mockResolvedValue(undefined);
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [ApiModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(RedisService)
      .useValue(redis)
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health -> 200, когда Postgres и Redis доступны', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);

    expect(healthOkSchema.safeParse(res.body).success).toBe(true);
    expect(res.body).toMatchObject({
      status: 'ok',
      postgres: 'up',
      redis: 'up',
    });
  });

  it('GET /health -> 503 и статусы, когда Redis недоступен', async () => {
    redis.ping.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await request(app.getHttpServer()).get('/health').expect(503);

    expect(healthUnavailableSchema.safeParse(res.body).success).toBe(true);
    expect(res.body).toMatchObject({
      status: 'error',
      postgres: 'up',
      redis: 'down',
    });
  });

  it('GET /metrics -> 200: эндпоинт живёт вне /api', async () => {
    const res = await request(app.getHttpServer()).get('/metrics').expect(200);

    expect(res.headers['content-type']).toContain('text/plain');
    // Пока это заглушка: тело — комментарий, серий ещё нет
    expect(res.text).toContain('metrics are not collected yet');
  });

  it('CORS: разрешает origin фронта', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://localhost:3000');

    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000',
    );
  });

  it('CORS: не разрешает чужой origin', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'https://evil.example');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
