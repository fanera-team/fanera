import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { PostgresService } from '../src/infra/postgres/postgres.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

// Postgres и Redis подменяем: e2e проверяет HTTP-слой и не требует
// поднятого docker compose. Тесты с настоящей БД появятся в #32.
const postgres = { ping: vi.fn<() => Promise<void>>() };
const redis = { ping: vi.fn<() => Promise<void>>() };

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    postgres.ping.mockResolvedValue(undefined);
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PostgresService)
      .useValue(postgres)
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

    expect(res.body).toMatchObject({
      status: 'ok',
      postgres: 'up',
      redis: 'up',
    });
  });

  it('GET /health -> 503 и статусы, когда Redis недоступен', async () => {
    redis.ping.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await request(app.getHttpServer()).get('/health').expect(503);

    expect(res.body).toMatchObject({
      status: 'error',
      postgres: 'up',
      redis: 'down',
    });
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
