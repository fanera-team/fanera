import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.schema.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  // При остановке (Ctrl+C, docker stop) дать сервисам закрыть соединения
  // с БД и т.п. в onApplicationShutdown, а не обрывать процесс
  app.enableShutdownHooks();

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });

  await app.listen(port);

  Logger.log(`http://localhost:${port}/health`, 'Bootstrap');
}

await bootstrap();
