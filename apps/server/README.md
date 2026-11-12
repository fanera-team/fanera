# server

API Fanera на NestJS 12 (ESM, Express, Zod, Vitest).

## Запуск

```bash
cp .env.example .env
pnpm dev                # из корня: pnpm dev:server
# -> http://localhost:3001/api/health
```

Проверки: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit), `pnpm test:e2e` (e2e запускаются отдельно).
Отладка: `pnpm start:debug`, затем в VS Code — «Attach to Node Process».

## Как устроено

- `src/main.ts` — запуск: порт из конфига, корректное завершение по SIGTERM.
- `src/configure-app.ts` — всё, что настраивается на уровне приложения: префикс `/api`, helmet, CORS, глобальная валидация. Его же вызывают e2e-тесты, поэтому новые глобальные настройки добавляются сюда, а не в `main.ts`.
- `src/config/env.schema.ts` — Zod-схема переменных окружения. Проверяется при старте: с некорректным `.env` сервер не запустится и напишет, что не так.
- `src/app.module.ts` — корневой модуль, подключает модули фич.

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
