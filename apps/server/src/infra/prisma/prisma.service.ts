import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Env } from '../../config/env.schema.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { errorMessage } from '../error-message.js';

// Общий логгер: обработчик ошибок пула создаётся до super(), когда this ещё нет
const logger = new Logger('PrismaService');

/**
 * Доступ к Postgres через Prisma. Внедряется в репозитории и сервисы,
 * не в контроллеры (ADR 0001).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(config: ConfigService<Env, true>) {
    const adapter = new PrismaPg(
      {
        connectionString: config.get('DATABASE_URL', { infer: true }),
        connectionTimeoutMillis: 2000,
        // connectionTimeoutMillis ограничивает только подключение; без этого
        // запрос к зависшей базе висит вечно и держит соединение из пула
        query_timeout: 2000,
      },
      {
        // Без обработчика обрыв простаивающего соединения роняет процесс
        onPoolError: (err) => {
          logger.warn(`connection to postgres was lost: ${errorMessage(err)}`);
        },
      },
    );
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    // Сервер стартует и без Postgres: статус покажет /health
    try {
      await this.ping();
      logger.log('connected to postgres');
    } catch (err) {
      logger.warn(`postgres is unavailable: ${errorMessage(err)}`);
    }
  }

  async ping(): Promise<void> {
    await this.$queryRaw`SELECT 1`;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.$disconnect();
  }
}
