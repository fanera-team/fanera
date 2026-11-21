import { problemSchema } from '@fanera/contracts';
import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
  type SchemaObject,
} from '@nestjs/swagger';
import { z } from 'zod';
import { PROBLEM_SCHEMA_NAME } from './api-errors.decorator.js';
import { BEARER_AUTH, REFRESH_COOKIE_AUTH } from './security.js';

/** Swagger UI. Глобальный префикс `/api` сюда не добавляется, путь полный. */
const SWAGGER_PATH = 'api/docs';
const SWAGGER_JSON_PATH = 'api/docs/openapi.json';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Fanera API')
    .setDescription(
      [
        'Контракт REST API, по которому фронт делает моки.',
        '',
        'Здесь описаны эндпоинты, которые уже взяты в работу. Целевой черновик всего API —',
        '`docs/system-design/api/rest_api.yml`, эндпоинты переезжают оттуда сюда по мере работы над задачами.',
        'Эндпоинты с ответом **501** — контракт согласован, реализации ещё нет.',
        '',
        'Регистрация и вход публичные: возвращают access-токен в JSON и устанавливают refresh-cookie.',
        'Access JWT живёт 15 минут и хранится в памяти фронта. Для REST: `Authorization: Bearer <access JWT>` (кнопка Authorize).',
        'Refresh-токен лежит в cookie `rt`: HttpOnly, Secure, SameSite=Lax, Path=/api/auth. В JSON он не передаётся.',
        '`POST /api/auth/refresh` использует cookie, без тела и Bearer. При загрузке страницы и после 401 фронт получает новый access-токен этим запросом.',
        'До вехи 3 refresh без ротации; с вехи 3 — ротация и обработка параллельного обновления во вкладках (Р-59, Р-60).',
        'Ошибки приходят как RFC 9457 `application/problem+json` (схема `Problem`).',
      ].join('\n'),
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      BEARER_AUTH,
    )
    .addCookieAuth(
      'rt',
      { type: 'apiKey', in: 'cookie', name: 'rt' },
      REFRESH_COOKIE_AUTH,
    )
    .build();

  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config);

    // Problem используется только через $ref в content ошибок (см. ApiErrors),
    // поэтому сам Swagger его не найдёт — добавляем схему вручную.
    // Источник истины — @fanera/contracts, а не копия в сервере.
    document.components ??= {};
    document.components.schemas = {
      ...document.components.schemas,
      [PROBLEM_SCHEMA_NAME]: z.toJSONSchema(problemSchema, {
        target: 'openapi-3.0',
        io: 'output',
      }) as SchemaObject,
    };

    return document;
  };

  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory, {
    jsonDocumentUrl: SWAGGER_JSON_PATH,
    swaggerOptions: {
      // Не терять введённый токен при перезагрузке страницы
      persistAuthorization: true,
    },
  });
}
