# server

API Fanera на NestJS 12 (ESM, Express, Zod, Vitest).

## Запуск

Из корня репозитория:

```bash
docker compose up -d --wait                   # Postgres и Redis, ждёт healthcheck
cp apps/server/.env.example apps/server/.env
pnpm --filter server db:migrate:deploy        # таблицы
pnpm --filter server db:seed                  # тестовые данные
pnpm dev:server
```

После запуска:

- healthcheck — http://localhost:3001/health;
- Swagger UI — http://localhost:3001/api/docs;
- OpenAPI JSON — http://localhost:3001/api/docs/openapi.json;
- метрики Prometheus — http://localhost:3001/metrics (`/api` на них не распространяется; пока это заглушка: адрес есть, серий нет).

`/health` и `/metrics` есть у всех трёх ролей и живут вне `/api`: их дёргают docker и Prometheus, а не браузер.

Сервер стартует и без Postgres/Redis (в лог пишет предупреждение), но `/health` тогда отвечает `503` и показывает, что недоступно.

Проверки: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit), `pnpm test:e2e` (e2e запускаются отдельно и нужен Postgres: `docker compose up -d --wait`).
Отладка: `pnpm start:debug`, затем в VS Code — «Attach to Node Process».

### Три роли

Один код, три процесса ([architecture §2](../../docs/system-design/architecture/README.md#2-один-код--три-роли-запуска-модульный-монолит)): роль выбирается точкой входа.

```bash
pnpm --filter server dev:api      # REST и Swagger
pnpm --filter server dev:collab   # WebSocket (пока только /health и /metrics)
pnpm --filter server dev:worker   # фоновые задачи (пока только /health и /metrics)
```

`dev` = `dev:api`: фронту в разработке нужен только REST. В проде образ один, а роль задаёт команда запуска — `node dist/main.api.js`, `node dist/main.collab.js`, `node dist/main.worker.js`.

## Как устроено

- `src/main.api.ts`, `src/main.collab.ts`, `src/main.worker.ts` — точки входа трёх ролей. Всё общее — в `src/bootstrap.ts` (`startRole`): логгер, shutdown hooks, порт из конфига, одна строка в лог.
- `src/app/*.module.ts` — корневой модуль роли: `ApiModule` подключает фичи, `CollabModule` и `WorkerModule` пока только ядро.
- `src/core/core.module.ts` — общая часть всех ролей: конфиг из Zod, `/health`, `/metrics`.
- `src/configure-app.ts` — всё, что настраивается на уровне приложения: префикс `/api`, helmet, CORS, глобальная валидация и Swagger. Его же вызывают e2e-тесты, поэтому новые глобальные настройки добавляются сюда, а не в точку входа.
- `src/config/env.schema.ts` — Zod-схема переменных окружения. Проверяется при старте: с некорректным `.env` ни одна роль не запустится и напишет, что не так.
- `src/common/` — сквозные вещи, не принадлежащие фичам: `filters/` (ошибки HTTP → `Problem`), `pipes/` (Zod-валидация входных данных) и `openapi/` (общая настройка и декораторы Swagger).
- `src/infra/` — подключения к внешним сервисам: `prisma/` (`PrismaService`, Postgres через Prisma), `redis/` (`ioredis`), `metrics/` (`/metrics`: пока заглушка, prom-client подключим в T3-05), `logger.ts` (JSON при `NODE_ENV=production`, текст локально; секреты маскируются).
- `prisma/` — схема БД (`schema.prisma`), миграции и seed. `prisma7.config.ts` — настройки Prisma CLI.
- `src/generated/prisma/` — сгенерированный клиент Prisma, в git не хранится.
- `src/health/` — `GET /health`: пингует Postgres и Redis с таймаутом 2 с; `200` — всё доступно, `503` — нет.

## База данных (Prisma)

ORM — Prisma 7, почему — в [ADR 0001](../../docs/adr/0001-orm.md). Таблицы описаны в `prisma/schema.prisma` по модели данных из [core.dbml](../../docs/system-design/database/core.dbml).

| Команда (из `apps/server`) | Что делает                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm db:migrate`          | изменил `schema.prisma` → создаёт миграцию (SQL-файл в `prisma/migrations/`) и применяет её к локальной базе                                              |
| `pnpm db:migrate:deploy`   | обновляет клиент и применяет готовые миграции, ничего не создавая (после `git pull`, на сервере)                                                          |
| `pnpm db:seed`             | заполняет базу тестовыми данными (`prisma/seed.ts`), можно запускать повторно                                                                             |
| `pnpm db:generate`         | пересоздаёт клиент в `src/generated/prisma` (сам запускается после `pnpm install` и в `db:migrate` / `db:migrate:deploy`; руками — если клиент потерялся) |

Правила:

- схема БД меняется **только через миграции**: правим `schema.prisma`, запускаем `pnpm db:migrate --name что_поменяли`, SQL-файл коммитим вместе с кодом;
- уже смёрженные миграции не редактируем — исправление делаем новой миграцией;
- к БД обращаемся только из сервисов и репозиториев через `PrismaService`, не из контроллеров;
- сырой SQL (`$queryRaw`) — только с параметрами через шаблонную строку, никогда не склеивать строки (SQL-инъекция).

e2e-тесты работают с отдельной базой `fanera_test` и сами накатывают на неё миграции (`test/global-setup.ts`).

## Как добавлять код

Новая фича — отдельный модуль в своей папке (`src/boards/`, `src/users/`...):

```bash
pnpm nest g resource boards
```

Генератор создаёт DTO-классы под `class-validator` — замените их на Zod-схемы:

```ts
const createBoardSchema = z.strictObject({ title: z.string().min(1) });

@Post()
create(@Body({ schema: createBoardSchema }) dto: z.infer<typeof createBoardSchema>) {}
```

Новая переменная окружения → `src/config/env.schema.ts` и `.env.example`,
читать через `config.get('NAME', { infer: true })`.
