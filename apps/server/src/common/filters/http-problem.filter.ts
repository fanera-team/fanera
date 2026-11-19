import {
  fieldErrorSchema,
  PROBLEM_CONTENT_TYPE,
  PROBLEM_TYPE,
  type FieldError,
  type Problem,
} from '@fanera/contracts';
import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { STATUS_CODES } from 'node:http';

/** Все исключения в обработке HTTP-запроса преобразуются в Problem Details. */
@Catch()
export class HttpProblemFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpProblemFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 5xx — наша ошибка: в лог целиком, со стеком. 4xx — ошибка клиента, логировать нечего.
    if (isServerError(status)) this.logger.error(exception);

    // При ошибке после начала отправки ответа заголовки уже менять нельзя.
    if (response.headersSent) {
      response.end();
      return;
    }

    response
      .status(status)
      .type(PROBLEM_CONTENT_TYPE)
      .json(toProblem(exception, status));
  }
}

function isServerError(status: number): boolean {
  return status >= HttpStatus.INTERNAL_SERVER_ERROR;
}

/** База Problem из HTTP-статуса: и для 5xx, и как fallback для 4xx. */
function baseProblem(status: number): Problem {
  return {
    type: PROBLEM_TYPE,
    title: STATUS_CODES[status] ?? 'Error',
    status,
    code: HttpStatus[status] ?? 'UNKNOWN',
  };
}

/**
 * Маппинг исключения в Problem. Тело 5xx не публикуем: наружу уходит только
 * статус, подробности остаются в логе.
 */
function toProblem(exception: unknown, status: number): Problem {
  const base = baseProblem(status);
  if (isServerError(status) || !(exception instanceof HttpException))
    return base;

  const body = exception.getResponse();
  // Приоритет: code из тела исключения → errorCode конструктора → HTTP-статус.
  const fallbackCode = exception.errorCode ?? base.code;

  if (typeof body === 'string') {
    return { ...base, code: fallbackCode, detail: body };
  }
  if (!isObjectBody(body)) return { ...base, code: fallbackCode };

  return {
    ...base,
    code: stringField(body, 'code') ?? fallbackCode,
    detail: stringField(body, 'detail') ?? detailFromMessage(body.message),
    errors: fieldErrorsOf(body),
  };
}

function isObjectBody(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringField(
  body: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = body[key];
  return typeof value === 'string' ? value : undefined;
}

/** `message` Nest бывает строкой или массивом строк — оба варианта годятся в detail. */
function detailFromMessage(message: unknown): string | undefined {
  if (typeof message === 'string') return message;
  if (
    Array.isArray(message) &&
    message.every((item) => typeof item === 'string')
  ) {
    return message.join('; ');
  }
  return undefined;
}

/** Публикуем только поля контракта: остальное из тела исключения отбрасываем. */
function fieldErrorsOf(
  body: Record<string, unknown>,
): FieldError[] | undefined {
  if (!Array.isArray(body.errors)) return undefined;

  return body.errors.flatMap((value) => {
    const parsed = fieldErrorSchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });
}
