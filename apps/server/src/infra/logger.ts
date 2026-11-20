import { ConsoleLogger } from '@nestjs/common';

/**
 * В проде (NODE_ENV=production) — JSON для promtail → Loki, иначе —
 * обычный текст Nest. В JSON-режиме structuredParams + flattenParams кладут
 * объект после сообщения в корень записи, а не прячут под params.
 * redact маскирует секреты по именам полей, но строки и стек не редактирует:
 * тела запросов и токены в сообщения всё равно не кладём.
 */
export function createLogger(): ConsoleLogger {
  const redact = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'cookie',
    'set-cookie',
    'secret',
    'apiKey',
  ];

  return process.env.NODE_ENV === 'production'
    ? new ConsoleLogger({
        json: true,
        structuredParams: true,
        flattenParams: true,
        redact,
      })
    : new ConsoleLogger({ redact });
}
