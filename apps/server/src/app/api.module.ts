import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { BoardsModule } from '../boards/boards.module.js';
import { CoreModule } from '../core/core.module.js';
import { UsersModule } from '../users/users.module.js';
import { WorkspacesModule } from '../workspaces/workspaces.module.js';

/**
 * Роль api: ядро (конфиг, /health, /metrics) плюс HTTP-контроллеры фич.
 * Здесь и только здесь подключаются фичи, которым нужен REST.
 */
@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    BoardsModule,
  ],
})
export class ApiModule {}
