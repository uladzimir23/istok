---
title: ADR-010 — PocketBase Activation Phase 2 Static Rebuild
description: Активация Phase 2 — PocketBase добавляется как БД и Admin UI для редактирования каталога без git; сайт остаётся static export, данные читаются на билде.
order: 10
status: proposed
date: 2026-06-27
---

# ADR-010 — PocketBase Activation Phase 2 Static Rebuild

## Контекст

ADR-005 зафиксировал шесть trigger-условий для активации Phase 2 (PocketBase).
**Триггер №1 наступил:** клиент (менеджер фабрики) должен самостоятельно обновлять
товары, цены и фото — без git и без разработчика. Переход оправдан по собственным
критериям проекта, не «на вырост».

Текущее состояние на момент решения:

- Контент — content-as-code: 26 MDX-файлов в `content/products/` (три категории) и
  6 MDX в `content/projects/`. Загрузчики `web/src/entities/product/loader.ts`,
  `web/src/entities/project/loader.ts` читают файлы с диска на build-time.
- Хостинг — ADR-009: `output: "export"` в `nginx:alpine` на сервере агентства SYNC
  (`89.169.54.11`, порт 3007, `new.istokmebel.by`). Деплой: push → GHCR → ssh → compose.
- Zod-схемы product и project уже определены в `web/src/entities/*/schema.ts` — в
  PocketBase collections переносятся практически 1:1.
- На сервере порты PocketBase заняты: 8090 (auction), 8091 (property-finder), 8092
  (flex-glass). Следующий свободный — **8093** (istok).

Требование: нетехнический редактор фабрики правит каталог через браузер без участия
разработчика.

## Варианты

### A. Static export + PocketBase на билде + rebuild-webhook (выбран)
- Плюсы: хостинг ADR-009 не меняется (nginx:alpine раздаёт `web/out`); Lighthouse-100
  сохраняется; PocketBase добавляется в существующий compose без новой инфры; принцип
  defer-complexity соблюдён; бэкап = `cp pb_data`; донор-паттерн — `flex-glass`.
- Минусы: правки видны с задержкой ~1–3 минуты (ребилд CI + редеплой); нужен
  webhook-секрет и `repository_dispatch` между сервером и GitHub; при падении CI
  правка «зависает» до следующего прогона.

### B. Runtime standalone — Node читает PocketBase в рантайме
- Плюсы: мгновенные правки; возможна ISR.
- Минусы: меняет хостинг ADR-009 с static nginx на Node-контейнер; лишний рантайм
  ради витрины, где контент меняется раз в несколько дней. Нарушает ADR-009 без
  обоснованной необходимости. Отвергнут.

### C. Headless SaaS CMS (Sanity / Contentful)
- Плюсы: managed, встроенное превью.
- Минусы: вендор-лок, ценник, SaaS-зависимость. Уже отвергнут в ADR-005. Закрытая ветка.

## Решение

Выбираем **A. Static export + PocketBase на билде + rebuild-webhook.**

PocketBase добавляется сервисом в `/opt/istok/docker-compose.yml` на `89.169.54.11`
(порт `127.0.0.1:8093:8080`, volume `pb_data`, cron-бэкап). Collections зеркалят
Zod-схемы product и project — одноразовый миграционный скрипт переносит записи из MDX.
Loader-ы переписываются с чтения файлов на PocketBase JS SDK, но остаются build-time:
`generateStaticParams` и SSG-логика не меняются. `PB_URL` передаётся в Dockerfile как
build-arg. Хостинг ADR-009 (static export + nginx:alpine) не меняется.

Задержка ~1–3 минуты на ребилд приемлема для каталога-витрины, где контент меняется
раз в несколько дней. Редактор видит изменение в Admin UI сразу — сайт догоняет следом.
Это несравнимо лучше текущей ситуации, где нетехнический редактор вообще не имеет
доступа к контенту.

## Последствия

**Что делаем:**

- PocketBase-сервис в `/opt/istok/docker-compose.yml`: образ `ghcr.io/pocketbase/pocketbase`,
  порт `127.0.0.1:8093:8080`, volume `pb_data`, healthcheck.
- Collections `product` и `project` — схема из `web/src/entities/*/schema.ts`; экспорт
  схемы в `infra/pb-schema/` для воспроизводимости.
- Одноразовый `scripts/migrate-mdx-to-pb.ts` (bun): читает MDX, постит в PocketBase REST API.
- Loader-ы `entities/product/loader.ts` и `entities/project/loader.ts` — замена
  `fs.readdir`/`fs.readFile` на `new PocketBase(process.env.PB_URL)`, только build-time.
- `PB_URL` как `ARG` в Dockerfile и секрет `PB_URL` в GitHub Actions.
- PocketBase webhook (onRecordAfterCreate/Update/Delete) → HTTP `repository_dispatch` на
  GitHub → `deploy.yml` слушает event-type `pocketbase-content-update`.
- Webhook-секрет хранится на сервере (env PocketBase) и в GitHub Actions secrets
  (`PB_WEBHOOK_SECRET`). В git — только имена переменных, не значения (redaction policy).
- Admin UI PocketBase — доступ через reverse-proxy поддомен `admin.istokmebel.by` или
  SSH-туннель (выбрать в impl).
- Роль «editor» в PocketBase для фабрики: доступ только к collections product/project,
  без изменения схемы.
- Cron-бэкап `pb_data` — ежедневно на сервере (локально или S3-совместимо).
- MDX-файлы `content/products/` и `content/projects/` удаляются после верификации миграции.

**Что НЕ делаем:**

- Не переходим на `output: "standalone"` / Node-рантайм — хостинг ADR-009 остаётся нетронутым.
- Не трогаем приёмник заявок (`NEXT_PUBLIC_LEAD_ENDPOINT`) — внешний endpoint из ADR-005/ADR-008 в силе.
- Не делаем корзину, онлайн-оплату, личный кабинет — триггеры 4–6 из ADR-005 не наступили.

**Обратимость: средняя.** Откат PocketBase → MDX: экспорт записей через Admin UI или
API → конвертация скриптом → восстановление MDX-файлов. Оценка ~1 день работы.
Loader-интерфейс изолирует frontend от data-source — переключение затрагивает только
`entities/*/loader.ts`, страницы не меняются.

**Кто затронут:**

- Контент-команда фабрики — получает Admin UI PocketBase; это основная цель ADR.
- Разработка — реализует collections, миграцию, рефакторинг loader-ов, webhook.
- DevOps — добавляет PocketBase-контейнер, volume, cron-бэкап, webhook-секрет, admin-доступ.

## Имплементация

Не начата. Стартует после стабилизации деплоя ADR-009 (`new.istokmebel.by` в продакшне).

Шаги:

1. Добавить PocketBase-сервис в `/opt/istok/docker-compose.yml` (порт 8093, volume `pb_data`).
2. Описать collections `product` и `project` в Admin UI; экспортировать схему в `infra/pb-schema/`.
3. Написать и прогнать `scripts/migrate-mdx-to-pb.ts`.
4. Переписать `entities/product/loader.ts` и `entities/project/loader.ts` на PocketBase JS SDK.
5. Добавить `ARG PB_URL` в Dockerfile; добавить `PB_URL` в secrets и build-args `deploy.yml`.
6. Настроить PocketBase webhook → `repository_dispatch` → триггер в `deploy.yml`.
7. Настроить admin-доступ: поддомен `admin.istokmebel.by` или SSH-туннель; роль editor для фабрики.
8. Настроить cron-бэкап `pb_data`.
9. Удалить MDX-файлы из `content/products/` и `content/projects/` после верификации.

## Связанные

- [[ADR-005 Content-as-Code Phase 1 No Backend]] — этот ADR активирует триггер №1,
  зафиксированный в ADR-005. Переход предусмотрен и описан там.
- [[ADR-001 PocketBase as Backend]] — исходная идея ADR-001 (superseded ADR-005);
  здесь реализуется в модели static+rebuild, не runtime.
- [[ADR-009 Hetzner Agency Server Hosting]] — PocketBase добавляется в тот же
  compose-стек; хостинг статики не меняется.
- sync-agency-server Dashboard — карта портов на сервере (8090–8092 заняты; 8093 выбран).
- `~/Documents/flex-glass/` — донор PocketBase-паттерна (collections, JS SDK, миграция).
- [[Dashboard]]
