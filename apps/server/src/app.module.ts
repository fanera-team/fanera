import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { BoardsModule } from './boards/boards.module.js';
import { envSchema } from './config/env.schema.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { WorkspacesModule } from './workspaces/workspaces.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigService доступен во всех модулях без повторного импорта.
      isGlobal: true,
      cache: true,
      // .env + process.env проверяются схемой при старте.
      validationSchema: envSchema,
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    BoardsModule,
  ],
})
export class AppModule {}
