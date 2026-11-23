import { problemSchema } from '@fanera/contracts';
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
import { PrismaService } from '../src/infra/prisma/prisma.service.js';
import { RedisService } from '../src/infra/redis/redis.service.js';

type Operation = {
  tags?: string[];
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
      content?: Record<string, { schema?: unknown; example?: unknown }>;
    }
  >;
  requestBody?: unknown;
};

type OpenApiDocument = {
  security?: Record<string, string[]>[];
  paths: Record<string, Record<string, Operation>>;
  components: {
    schemas: Record<string, unknown>;
    securitySchemes: Record<string, unknown>;
  };
};

// Postgres и Redis не нужны: проверяем только сборку OpenAPI-документа.
const prisma = { ping: vi.fn<() => Promise<void>>() };
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
    prisma.ping.mockResolvedValue(undefined);
    redis.ping.mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [SwaggerTestController],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
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

  const problemResponse = {
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/Problem' },
      },
    },
  };

  it.each([
    ['post', '/api/auth/register', 201, 'Auth', [400, 409, 422, 501]],
    ['post', '/api/auth/login', 200, 'Auth', [400, 401, 422, 429, 501]],
    ['post', '/api/auth/refresh', 200, 'Auth', [401, 501]],
    ['get', '/api/me', 200, 'Me', [401, 501]],
    ['get', '/api/workspaces', 200, 'Workspaces', [401, 501]],
    [
      'get',
      '/api/workspaces/{workspaceId}/boards',
      200,
      'Boards',
      [401, 404, 422, 501],
    ],
    [
      'post',
      '/api/workspaces/{workspaceId}/boards',
      201,
      'Boards',
      [400, 401, 403, 404, 422, 501],
    ],
    ['get', '/api/boards/{boardId}', 200, 'Boards', [401, 404, 422, 501]],
  ] as const)(
    '%s %s описывает успешный ответ и ошибки Problem',
    (method, path, status, tag, errors) => {
      const operation = op(method, path);
      expect(operation.tags).toContain(tag);
      expect(operation.responses[String(status)].content).toHaveProperty(
        'application/json',
      );
      for (const error of errors) {
        expect(operation.responses[String(error)]).toMatchObject(
          problemResponse,
        );
        const example =
          operation.responses[String(error)].content?.[
            'application/problem+json'
          ]?.example;
        expect(problemSchema.parse(example)).toMatchObject({
          type: 'about:blank',
          status: error,
        });
      }
    },
  );

  it('регистрация и вход публичные, refresh использует cookie, остальные маршруты — Bearer', () => {
    for (const path of ['/api/auth/register', '/api/auth/login']) {
      expect(op('post', path).security ?? doc.security ?? []).toEqual([]);
    }
    expect(op('post', '/api/auth/refresh').security).toEqual([
      { refreshCookie: [] },
    ]);
    expect(op('post', '/api/auth/refresh').requestBody).toBeUndefined();
    for (const [method, path] of [
      ['get', '/api/me'],
      ['get', '/api/workspaces'],
      ['get', '/api/workspaces/{workspaceId}/boards'],
      ['post', '/api/workspaces/{workspaceId}/boards'],
      ['get', '/api/boards/{boardId}'],
    ]) {
      expect(op(method, path).security).toEqual([{ bearerAuth: [] }]);
    }
  });

  it.each([
    [
      '/api/auth/register',
      ['email', 'password', 'name'],
      { minLength: 8, maxLength: 128 },
    ],
    ['/api/auth/login', ['email', 'password'], { minLength: 1 }],
  ])(
    '%s описывает обязательное тело и ограничения входных данных',
    (path, required, password) => {
      expect(op('post', path).requestBody).toMatchObject({
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required,
              additionalProperties: false,
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', ...password },
              },
            },
          },
        },
      });
    },
  );

  it('auth возвращает access в JSON и описывает refresh-cookie в заголовке', () => {
    for (const [path, status] of [
      ['/api/auth/register', '201'],
      ['/api/auth/login', '200'],
      ['/api/auth/refresh', '200'],
    ]) {
      expect(op('post', path).responses[status]).toMatchObject({
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AuthResponse' },
          },
        },
        headers: { 'Set-Cookie': { schema: { type: 'string' } } },
      });
    }
    expect(doc.components.schemas.AuthResponse).toMatchObject({
      required: ['accessToken', 'expiresIn', 'user'],
      properties: {
        accessToken: { type: 'string' },
        expiresIn: { type: 'integer' },
        user: { $ref: '#/components/schemas/UserPublic' },
      },
    });
    expect(doc.components.schemas.AuthResponse).not.toHaveProperty(
      'properties.refreshToken',
    );
    expect(op('post', '/api/auth/login').responses['429']).toMatchObject({
      headers: { 'Retry-After': { schema: { type: 'integer' } } },
    });
  });

  it('список досок описывает UUID воркспейса, курсорную пагинацию и элементы ответа', () => {
    const operation = op('get', '/api/workspaces/{workspaceId}/boards');
    expect(operation.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          in: 'path',
          name: 'workspaceId',
          required: true,
          schema: expect.objectContaining({ type: 'string', format: 'uuid' }),
        }),
        expect.objectContaining({
          in: 'query',
          name: 'limit',
          schema: expect.objectContaining({
            minimum: 1,
            maximum: 100,
            default: 20,
          }),
        }),
        expect.objectContaining({
          in: 'query',
          name: 'cursor',
          required: false,
          schema: expect.objectContaining({ type: 'string' }),
        }),
      ]),
    );
    expect(operation.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            required: ['items', 'nextCursor'],
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/BoardSummary' },
              },
              nextCursor: { type: 'string', nullable: true },
            },
          },
        },
      },
    });
    expect(doc.components.schemas.BoardSummary).toMatchObject({
      required: ['id', 'title', 'owner', 'myRole', 'updatedAt'],
    });
  });

  it('создание и получение доски описывают Board, название и ключ идемпотентности', () => {
    const create = op('post', '/api/workspaces/{workspaceId}/boards');
    expect(create.requestBody).toMatchObject({
      required: true,
      content: {
        'application/json': {
          schema: {
            required: ['title'],
            additionalProperties: false,
            properties: {
              title: { type: 'string', minLength: 1, maxLength: 200 },
            },
          },
        },
      },
    });
    expect(create.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          in: 'header',
          name: 'Idempotency-Key',
          schema: { type: 'string', format: 'uuid' },
        }),
      ]),
    );
    const get = op('get', '/api/boards/{boardId}');
    expect(get.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          in: 'path',
          name: 'boardId',
          required: true,
          schema: expect.objectContaining({ type: 'string', format: 'uuid' }),
        }),
      ]),
    );
    for (const response of [create.responses['201'], get.responses['200']]) {
      expect(response).toMatchObject({
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Board' },
          },
        },
      });
    }
    expect(doc.components.schemas.Board).toMatchObject({
      required: expect.arrayContaining([
        'id',
        'title',
        'workspaceId',
        'collab',
      ]),
      properties: { collab: { required: ['url', 'namespace'] } },
    });
  });

  it('список воркспейсов описывает элементы и роль пользователя', () => {
    expect(op('get', '/api/workspaces').responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            required: ['items'],
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/Workspace' },
              },
            },
          },
        },
      },
    });
    expect(doc.components.schemas.Workspace).toMatchObject({
      required: ['id', 'name', 'myRole', 'createdAt'],
    });
  });

  it.each([
    [
      'post',
      '/api/auth/register',
      { email: 'bad', password: 'short', name: '' },
    ],
    ['post', '/api/auth/login', { email: 'bad', password: '' }],
    ['get', '/api/workspaces/not-a-uuid/boards', undefined],
    [
      'get',
      '/api/workspaces/00000000-0000-4000-8000-000000000001/boards?limit=0',
      undefined,
    ],
    [
      'post',
      '/api/workspaces/00000000-0000-4000-8000-000000000001/boards',
      { title: '   ' },
    ],
    ['get', '/api/boards/not-a-uuid', undefined],
  ] as const)(
    '%s %s: невалидные данные действительно возвращают 422 Problem',
    async (method, path, body) => {
      const http = request(app.getHttpServer());
      const req = method === 'post' ? http.post(path) : http.get(path);
      if (body) req.send(body);
      const res = await req.expect(422);
      expect(res.headers['content-type']).toContain('application/problem+json');
      expect(res.body).toMatchObject({
        status: 422,
        code: 'VALIDATION_ERROR',
        errors: expect.any(Array),
      });
    },
  );

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
        status: { type: 'integer', minimum: 100, maximum: 599 },
        code: { type: 'string' },
      },
    });
  });

  it.each([
    [100, true],
    [599, true],
    [99, false],
    [600, false],
    [422.5, false],
    [Number.MAX_SAFE_INTEGER, false],
  ])('Problem проверяет HTTP-статус %s', (status, valid) => {
    expect(
      problemSchema.safeParse({
        type: 'about:blank',
        title: 'Example',
        status,
        code: 'EXAMPLE',
      }).success,
    ).toBe(valid);
  });

  it('GET /me описан общей схемой Me с обязательными полями и nullable-аватаркой', () => {
    const operation = op('get', '/api/me');

    expect(operation.security).toEqual([{ bearerAuth: [] }]);
    expect(operation.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Me' },
        },
      },
    });
    expect(operation.responses['401']).toMatchObject({
      content: {
        'application/problem+json': {
          schema: { $ref: '#/components/schemas/Problem' },
        },
      },
    });
    expect(doc.components.schemas.Me).toMatchObject({
      type: 'object',
      required: ['id', 'name', 'avatarUrl', 'email'],
    });
    expect(doc.components.schemas.Me).toHaveProperty('properties', {
      id: expect.objectContaining({ type: 'string', format: 'uuid' }),
      name: { type: 'string' },
      avatarUrl: expect.objectContaining({
        type: 'string',
        format: 'uri',
        nullable: true,
      }),
      email: expect.objectContaining({ type: 'string', format: 'email' }),
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
          // Пример общий, без конкретных field/message: их форма — в схеме Problem,
          // а тексты валидации живут в рантайме.
          example: {
            type: 'about:blank',
            status: 422,
            code: 'VALIDATION_ERROR',
          },
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
    expect(
      op('post', '/api/__swagger-test').responses['501'].content?.[
        'application/problem+json'
      ]?.example,
    ).toEqual(res.body);
  });

  it('схемы авторизации называются как в rest_api.yml', () => {
    expect(doc.components.securitySchemes).toMatchObject({
      bearerAuth: { type: 'http', scheme: 'bearer' },
      refreshCookie: { type: 'apiKey', in: 'cookie', name: 'rt' },
    });
  });
});
