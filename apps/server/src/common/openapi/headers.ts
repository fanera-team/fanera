/**
 * Описание заголовка для Swagger (`@ApiHeader`), а не Zod-схема:
 * поэтому лежит рядом с остальными OpenAPI-описаниями.
 */
export const IDEMPOTENCY_KEY_HEADER = {
  name: 'Idempotency-Key',
  required: false,
  description:
    'UUID. Повтор запроса с тем же ключом в течение 24 ч вернёт прежний ответ. Тот же ключ с другим запросом — 422 IDEMPOTENCY_KEY_REUSED.',
  schema: { type: 'string', format: 'uuid' },
} as const;
