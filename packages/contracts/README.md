# @fanera/contracts

Общие Zod-схемы и типы REST-контрактов для фронтенда и бэкенда. Источник контракта —
сами схемы: типы выводятся через `z.infer`, поэтому меняем контракт только в схеме.

Публичный API — в [src/index.ts](src/index.ts). Импортируем через
`@fanera/contracts` или объявленные публичные подпути, не из внутренних файлов пакета.
Приложения не дублируют контрактные типы.

Публичные разделы: `schemas` и `socket-events` (также доступны как
подпути `@fanera/contracts/schemas` и `@fanera/contracts/socket-events`).
Корневой API экспортирует REST-схемы авторизации, профиля, воркспейсов, досок и пагинации,
health-схему (`healthSchema`, `healthStatusSchema`,
`dependencyStatusSchema`), типы (`HealthResponse`, `HealthStatus`, `DependencyStatus`)
и Problem Details: `problemSchema`, `fieldErrorSchema`,
`PROBLEM_TYPE`, `PROBLEM_CONTENT_TYPE`, `Problem` и `FieldError`. Формат
Problem Details сохранён. Схемы и выведенные из них через `z.infer` типы определяются
в одном файле без разделения. Для запросов и ответов используются суффиксы
`*Request` / `*Response`, для сущностей — существительные. В существующих REST-схемах
входных данных также используется суффикс `*Body`.
Ответ health endpoint валидируется общей схемой. `socket-events` — задел для
типизированных событий и модели элемента доски (#4). Пакет не зависит от React или NestJS.

Целевой API описан в [rest_api.yml](../../docs/system-design/api/rest_api.yml),
текущий контракт этапа публикуется в Swagger сервера. В пакете нет NestJS, React
и доступа к окружению: `envSchema` и фильтр ошибок остаются на сервере.

Сервер и фронтенд подключают пакет через `workspace:*`.

## Разработка

`pnpm install` собирает пакет через `prepare`; в `dist` лежат ESM и декларации типов,
`dist` не коммитим.

- `pnpm --filter @fanera/contracts build` — пересобрать.
- `pnpm --filter @fanera/contracts dev` — наблюдать за изменениями.
- `pnpm --filter @fanera/contracts typecheck` — проверить типы.

Корневые `pnpm dev`, `pnpm dev:web` и `pnpm dev:server` включают наблюдение за
контрактами. После пересборки `dist` сервер нужно перезапустить: `nest start --watch`
не следит за `node_modules`. Тесты и приложения читают собранный `dist`, поэтому
после правки контракта перед typecheck, тестами и сборкой приложений нужен
`pnpm --filter @fanera/contracts build`
(в CI это делает `prepare` при установке). Корневой `pnpm build` собирает зависимости
перед приложениями.

Изменения общего контракта затрагивают и фронт, и бэк: сначала согласуем OpenAPI по Р-47.
