import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import type { Env } from '../../config/env.schema.js';
import { errorMessage } from '../error-message.js';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private isDownLogged = false;

  constructor(config: ConfigService<Env, true>) {
    this.client = new Redis(config.get('REDIS_URL', { infer: true }), {
      lazyConnect: true,
      connectTimeout: 2000,
      // Ответ на команду ждём не дольше 2 с, даже если соединение зависло
      commandTimeout: 2000,
      // Без очереди команды при недоступном Redis падают сразу, а не висят
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    });

    this.client.on('ready', () => {
      this.isDownLogged = false;
      this.logger.log('connected to redis');
    });

    // ioredis сам переподключается; без обработчика 'error' процесс упадёт
    this.client.on('error', (err) => {
      if (this.isDownLogged) return;
      this.isDownLogged = true;
      this.logger.warn(`redis is unavailable: ${errorMessage(err)}`);
    });
  }

  async onModuleInit(): Promise<void> {
    // Сервер стартует и без Redis: статус покажет /health, а ioredis
    // продолжит переподключаться. Ошибку уже залогировал обработчик 'error'
    await this.client.connect().catch(() => undefined);
  }

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit();
    } else {
      this.client.disconnect();
    }
  }
}
