import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ApiModule } from '../src/app/api.module.js';
import { configureApp } from '../src/configure-app.js';
import { Prisma } from '../src/generated/prisma/client.js';
import { PrismaService } from '../src/infra/prisma/prisma.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

// Настоящий Postgres (тестовая база, см. test-database-url.ts).
// Redis подменяем: он к этой проверке не относится.
const redis = { ping: vi.fn<() => Promise<void>>() };
const EMAIL_DOMAIN = '@e2e.test';

describe('Database (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [ApiModule],
    })
      .overrideProvider(RedisService)
      .useValue(redis)
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { endsWith: EMAIL_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health видит настоящий Postgres', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);

    expect(res.body).toMatchObject({ status: 'ok', postgres: 'up' });
  });

  it('сохраняет пользователя и читает его обратно', async () => {
    const email = `${randomUUID()}${EMAIL_DOMAIN}`;

    const created = await prisma.user.create({ data: { email, name: 'Test' } });
    const found = await prisma.user.findUnique({ where: { email } });

    expect(found).toEqual(created);
    expect(found?.createdAt).toBeInstanceOf(Date);
  });

  it('не даёт создать двух пользователей с одним email', async () => {
    const email = `${randomUUID()}${EMAIL_DOMAIN}`;
    await prisma.user.create({ data: { email, name: 'First' } });

    const duplicate = prisma.user.create({ data: { email, name: 'Second' } });

    // P2002 — нарушение уникального индекса
    await expect(duplicate).rejects.toBeInstanceOf(
      Prisma.PrismaClientKnownRequestError,
    );
    await expect(duplicate).rejects.toMatchObject({ code: 'P2002' });
  });

  it('сравнивает email без учёта регистра (citext)', async () => {
    const id = randomUUID();
    const email = `${id}${EMAIL_DOMAIN}`;
    const created = await prisma.user.create({
      data: { email: `${id.toUpperCase()}${EMAIL_DOMAIN}`, name: 'Upper' },
    });

    // Находим пользователя, даже если email набран в другом регистре
    const found = await prisma.user.findUnique({ where: { email } });
    expect(found?.id).toBe(created.id);

    // И не даём завести второй аккаунт на тот же ящик
    await expect(
      prisma.user.create({ data: { email, name: 'Lower' } }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });
});
