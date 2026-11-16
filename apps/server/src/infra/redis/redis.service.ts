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

const QUIT_TIMEOUT_MS = 2000;

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
      // Если сокет молчит 5 с (например, пропала сеть), соединение закрывается
      socketTimeout: 5000,
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
    if (this.client.status !== 'ready') {
      this.client.disconnect();
      return;
    }

    // quit() ждёт ответа Redis; если он завис, закрываем соединение сами
    let timer: NodeJS.Timeout | undefined;
    try {
      await Promise.race([
        this.client.quit(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('redis quit timed out')),
            QUIT_TIMEOUT_MS,
          );
        }),
      ]);
    } catch {
      this.client.disconnect();
    } finally {
      clearTimeout(timer);
    }
  }
}
