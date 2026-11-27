import { type INestApplication, Logger, type Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Env } from './config/env.schema.js';
import { createLogger } from './infra/logger.js';

/** У каждой роли свой порт: локально три процесса идут рядом, не конфликтуя. */
export type RolePort = 'API_PORT' | 'COLLAB_PORT' | 'WORKER_PORT';

export type StartRoleOptions = {
  port: RolePort;
  /**
   * Настройка приложения до старта. Префикс /api, Swagger, CORS и helmet
   * нужны только роли api; collab и worker отдают лишь /health и /metrics.
   */
  configure?: (app: INestApplication) => void;
};

/**
 * Общий старт всех трёх ролей: логгер, shutdown hooks, порт из проверенного
 * конфига и одна строка в лог. Роли отличаются только корневым модулем,
 * поэтому сценарий запуска не должен расходиться между main.*.ts.
 */
export async function startRole(
  module: Type<unknown>,
  options: StartRoleOptions,
): Promise<void> {
  const app = await NestFactory.create(module, { logger: createLogger() });

  options.configure?.(app);

  // При остановке (Ctrl+C, docker stop) дать сервисам закрыть соединения
  // с БД и т.п. в onApplicationShutdown, а не обрывать процесс
  app.enableShutdownHooks();

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get(options.port, { infer: true });

  await app.listen(port);

  Logger.log(`http://localhost:${port}/health`, module.name);
}
