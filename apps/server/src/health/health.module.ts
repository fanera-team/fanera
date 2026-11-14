import { Module } from '@nestjs/common';
import { PostgresModule } from '../infra/postgres/postgres.module.js';
import { RedisModule } from '../infra/redis/redis.module.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

@Module({
  imports: [PostgresModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
