import { type INestApplication, type Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { CollabModule } from '../src/app/collab.module.js';
import { WorkerModule } from '../src/app/worker.module.js';
import { PrismaService } from '../src/infra/prisma/prisma.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

// Postgres и Redis подменяем: проверяем, что роли поднимаются и отдают
// служебные ручки, а не доступность инфраструктуры.
const prisma = { ping: vi.fn<() => Promise<void>>() };
const redis = { ping: vi.fn<() => Promise<void>>() };

const roles = [
  { name: 'collab', module: CollabModule },
  { name: 'worker', module: WorkerModule },
];

async function boot(module: Type<unknown>): Promise<INestApplication<App>> {
  prisma.ping.mockResolvedValue(undefined);
  redis.ping.mockResolvedValue(undefined);

  const moduleRef = await Test.createTestingModule({ imports: [module] })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .overrideProvider(RedisService)
    .useValue(redis)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return app;
}

describe('Роли collab и worker (e2e)', () => {
  it('поднимаются и отдают /health и /metrics', async () => {
    for (const { name, module } of roles) {
      const app = await boot(module);

      try {
        const health = await request(app.getHttpServer())
          .get('/health')
          .expect(200);
        expect(health.body, `${name}: /health`).toMatchObject({ status: 'ok' });

        const metrics = await request(app.getHttpServer())
          .get('/metrics')
          .expect(200);
        expect(metrics.headers['content-type']).toContain('text/plain');
        expect(metrics.text, `${name}: /metrics`).toContain(
          'metrics are not collected yet',
        );
      } finally {
        await app.close();
      }
    }
  });
});
