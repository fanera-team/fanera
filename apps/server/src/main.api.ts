import { ApiModule } from './app/api.module.js';
import { startRole } from './bootstrap.js';
import { configureApp } from './configure-app.js';

// Роль api: REST-контроллеры и Swagger. Префикс /api, CORS, helmet
// и Swagger включаются только здесь — через configureApp.
await startRole(ApiModule, { port: 'API_PORT', configure: configureApp });
