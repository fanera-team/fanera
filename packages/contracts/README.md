# @fanera/contracts

Общие Zod-схемы и типы REST-контрактов для фронтенда и бэкенда. Источник контракта —
сами схемы: типы выводятся через `z.infer`, поэтому меняем контракт только в схеме.

Публичный API — в [src/index.ts](src/index.ts). Импортируем только через
`@fanera/contracts`, не из внутренних файлов пакета.

Целевой API описан в [rest_api.yml](../../docs/system-design/api/rest_api.yml),
текущий контракт этапа публикуется в Swagger сервера. В пакете нет NestJS, React
и доступа к окружению: `envSchema` и фильтр ошибок остаются на сервере.

Сервер уже использует пакет; фронтенд подключит его через `workspace:*` в рамках T1-09.

## Разработка

`pnpm install` собирает пакет через `prepare`; в `dist` лежат ESM и декларации типов,
`dist` не коммитим.

- `pnpm --filter @fanera/contracts build` — пересобрать.
- `pnpm --filter @fanera/contracts dev` — наблюдать за изменениями.
- `pnpm --filter @fanera/contracts typecheck` — проверить типы.

Корневые `pnpm dev`, `pnpm dev:web` и `pnpm dev:server` включают наблюдение за
контрактами. После пересборки `dist` сервер нужно перезапустить: `nest start --watch`
не следит за `node_modules`. Тесты и приложения читают `dist`, поэтому после правки
контракта перед `pnpm test` нужен `build` (в CI это делает `prepare` при установке).

Изменения общего контракта затрагивают и фронт, и бэк: сначала согласуем OpenAPI по Р-47.
