import {
  Controller,
  NotImplementedException,
  Post,
  type INestApplication,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { ApiErrors } from '../src/common/openapi/api-errors.decorator.js';
import { IDEMPOTENCY_KEY_HEADER } from '../src/common/openapi/headers.js';
import { configureApp } from '../src/configure-app.js';
import { PostgresService } from '../src/infra/postgres/postgres.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

type Operation = {
  security?: Record<string, string[]>[];
  parameters?: Array<{
    in?: string;
    name?: string;
    required?: boolean;
    description?: string;
    schema?: Record<string, unknown>;
  }>;
  responses: Record<
    string,
    {
      description?: string;
      headers?: Record<string, unknown>;
      content?: Record<string, unknown>;
    }
  >;
  requestBody?: unknown;
};

type OpenApiDocument = {
  paths: Record<string, Record<string, Operation>>;
  components: {
    schemas: Record<string, unknown>;
    securitySchemes: Record<string, unknown>;
  };
};

// Postgres и Redis не нужны: проверяем только сборку OpenAPI-документа.
const postgres = { ping: vi.fn<() => Promise<void>>() };
const redis = { ping: vi.fn<() => Promise<void>>() };

@Controller('__swagger-test')
class SwaggerTestController {
  @Post()
  @ApiHeader(IDEMPOTENCY_KEY_HEADER)
  @ApiErrors(422, 429, 501)
  create(): never {
    throw new NotImplementedException();
  }
}

describe('Swagger (e2e)', () => {
  let app: INestApplication<App>;
  let doc: OpenApiDocument;

  beforeAll(async () => {
    postgres.ping.mockResolvedValue(undefined);
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [SwaggerTestController],
    })
      .overrideProvider(PostgresService)
      .useValue(postgres)
      .overrideProvider(RedisService)
      .useValue(redis)
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const res = await request(app.getHttpServer())
      .get('/api/docs/openapi.json')
      .expect(200);
    doc = res.body as OpenApiDocument;
  });

  afterAll(async () => {
    await app.close();
  });

  const op = (method: string, path: string): Operation => {
    const operation = doc.paths[path]?.[method];
    if (!operation) throw new Error(`Нет ${method.toUpperCase()} ${path}`);
    return operation;
  };

  it('GET /api/docs отдаёт Swagger UI', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs').expect(200);

    expect(res.headers['content-type']).toContain('text/html');
  });

  it('health описан: 200 и диагностический 503', () => {
    const responses = op('get', '/health').responses;

    expect(responses).toMatchObject({
      200: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Health' },
          },
        },
      },
      503: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/HealthUnavailable' },
          },
        },
      },
    });
  });

  it('ошибки описаны схемой Problem из @fanera/contracts', () => {
    expect(doc.components.schemas).toHaveProperty('Problem');

    expect(doc.components.schemas.Problem).toMatchObject({
      type: 'object',
      required: expect.arrayContaining(['type', 'title', 'status', 'code']),
      properties: {
        status: { type: 'integer' },
        code: { type: 'string' },
      },
    });
  });

  it('общие декораторы описывают заголовки и ошибки', () => {
    const operation = op('post', '/api/__swagger-test');
    const { responses } = operation;

    expect(operation.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          in: 'header',
          name: 'Idempotency-Key',
          required: false,
          schema: { type: 'string', format: 'uuid' },
        }),
      ]),
    );

    expect(responses['422']).toMatchObject({
      description: 'Запрос не прошёл валидацию или нарушает условия контракта',
      content: {
        'application/problem+json': {
          schema: { $ref: '#/components/schemas/Problem' },
        },
      },
    });
    expect(responses['429']).toMatchObject({
      headers: {
        'Retry-After': {
          schema: { type: 'integer', minimum: 0 },
        },
      },
    });
    expect(responses['501']).toMatchObject({
      description: 'Эндпоинт ещё не реализован, пока работайте на моках',
      content: {
        'application/problem+json': {
          schema: { $ref: '#/components/schemas/Problem' },
        },
      },
    });
  });

  it('заглушка реально возвращает 501 в формате Problem', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/__swagger-test')
      .expect(501);

    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body).toMatchObject({ status: 501, code: 'NOT_IMPLEMENTED' });
  });

  it('схемы авторизации называются как в rest_api.yml', () => {
    expect(doc.components.securitySchemes).toMatchObject({
      bearerAuth: { type: 'http', scheme: 'bearer' },
      refreshCookie: { type: 'apiKey', in: 'cookie', name: 'rt' },
    });
  });
});
