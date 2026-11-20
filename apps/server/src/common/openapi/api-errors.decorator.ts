import { PROBLEM_CONTENT_TYPE } from '@fanera/contracts';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

/** Имя схемы ошибки в components.schemas (регистрируется в setup-swagger.ts). */
export const PROBLEM_SCHEMA_NAME = 'Problem';

const ERROR_DESCRIPTIONS = {
  400: 'Некорректный JSON в теле запроса',
  401: 'Нет или невалиден access-токен',
  403: 'Недостаточно прав',
  404: 'Не найдено или нет доступа',
  409: 'Конфликт, например email уже занят',
  422: 'Запрос не прошёл валидацию или нарушает условия контракта',
  429: 'Превышен лимит запросов, см. заголовок Retry-After',
  501: 'Эндпоинт ещё не реализован, пока работайте на моках',
} as const;

export type ApiErrorStatus = keyof typeof ERROR_DESCRIPTIONS;

/**
 * Описывает в Swagger ошибки эндпоинта в едином формате Problem (RFC 9457),
 * например `ApiErrors(400, 422)`.
 */
export function ApiErrors(...statuses: ApiErrorStatus[]) {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: ERROR_DESCRIPTIONS[status],
        ...(status === 429
          ? {
              headers: {
                'Retry-After': {
                  description: 'Сколько секунд ждать перед повтором запроса',
                  schema: { type: 'integer', minimum: 0 },
                },
              },
            }
          : {}),
        content: {
          [PROBLEM_CONTENT_TYPE]: {
            schema: { $ref: getSchemaPath(PROBLEM_SCHEMA_NAME) },
          },
        },
      }),
    ),
  );
}
