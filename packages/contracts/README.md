# @fanera/contracts

Общие схемы и типы для фронтенда и бэкенда. Контракты живут только здесь:
приложения импортируют их и не дублируют типы.

Публичные разделы: `schemas` и `socket-events` (также доступны как
подпути `@fanera/contracts/schemas` и `@fanera/contracts/socket-events`).
Корневой API экспортирует health-схему (`healthSchema`, `healthStatusSchema`,
`dependencyStatusSchema`), типы (`HealthResponse`, `HealthStatus`, `DependencyStatus`)
и Problem Details: `problemSchema`, `fieldErrorSchema`,
`PROBLEM_TYPE`, `PROBLEM_CONTENT_TYPE`, `Problem` и `FieldError`. Формат
Problem Details сохранён. Схемы и выведенные из них через `z.infer` типы определяются
в одном файле без разделения. Для запросов и ответов используются суффиксы
`*Request` / `*Response`, для сущностей — существительные.
Ответ health endpoint валидируется общей схемой. `socket-events` — задел для
типизированных событий и модели элемента доски (#4). Пакет не зависит от React или NestJS.

В пакете нет NestJS, React и доступа к окружению. `envSchema` остаётся на сервере,
как и фильтр ошибок с пайпом валидации.

## Разработка

`pnpm install` собирает пакет через `prepare`. Экспортируются JavaScript ESM
и декларации типов из `dist`, поэтому пакет работает в Node без загрузчика TypeScript.
`dist` не коммитим.

- `pnpm --filter @fanera/contracts build` — пересобрать после изменений.
- `pnpm --filter @fanera/contracts dev` — наблюдать за изменениями.
- `pnpm --filter @fanera/contracts typecheck` — проверить типы.

Корневой `pnpm dev`, `pnpm dev:web` и `pnpm dev:server` включают наблюдение за
контрактами. После пересборки `dist` сервер нужно перезапустить: `nest start --watch`
не следит за `node_modules`. Тесты и приложения читают собранный `dist`, поэтому
после правки контракта перед typecheck, тестами и сборкой приложений нужен
`pnpm --filter @fanera/contracts build`
(в CI это делает `prepare` при установке). Корневой `pnpm build` собирает зависимости
перед приложениями.

Изменения общего контракта затрагивают и фронт, и бэк: сначала согласуем
OpenAPI по Р-47. Формат ответа при переносе в этот пакет сохранён.
