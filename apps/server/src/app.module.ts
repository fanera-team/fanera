import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigService доступен во всех модулях без повторного импорта.
      isGlobal: true,
      cache: true,
      // .env + process.env проверяются схемой при старте.
      validationSchema: envSchema,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
