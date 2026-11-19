# server

API Fanera на NestJS 12 (ESM, Express, Zod, Vitest).

## Запуск

Из корня репозитория:

```bash
docker compose up -d                          # Postgres и Redis
cp apps/server/.env.example apps/server/.env
pnpm --filter server db:migrate:deploy        # таблицы
pnpm --filter server db:seed                  # тестовые данные
pnpm dev:server
# -> http://localhost:3001/health
```

Сервер стартует и без Postgres/Redis (в лог пишет предупреждение), но `/health` тогда отвечает `503` и показывает, что недоступно.

Проверки: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit), `pnpm test:e2e` (e2e запускаются отдельно и нужен Postgres: `docker compose up -d`).
Отладка: `pnpm start:debug`, затем в VS Code — «Attach to Node Process».

## Как устроено

- `src/main.ts` — запуск: порт из конфига, корректное завершение по SIGTERM.
- `src/configure-app.ts` — всё, что настраивается на уровне приложения: префикс `/api`, helmet, CORS, глобальная валидация. Его же вызывают e2e-тесты, поэтому новые глобальные настройки добавляются сюда, а не в `main.ts`.
- `src/config/env.schema.ts` — Zod-схема переменных окружения. Проверяется при старте: с некорректным `.env` сервер не запустится и напишет, что не так.
- `src/app.module.ts` — корневой модуль, подключает модули фич.
- `src/infra/` — подключения к внешним сервисам: `prisma/` (`PrismaService`, Postgres через Prisma), `redis/` (`ioredis`).
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
