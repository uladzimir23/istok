---
title: ADR-007 — Flat Repo Structure No Monorepo
description: Репозиторий istok строится как плоская структура с одним Next.js приложением в `web/`, без pnpm workspaces / turbo / nx — потому что второго приложения нет и не предвидится в Phase 1–2.
order: 7
status: proposed
date: 2026-05-01
---

# ADR-007 — Flat Repo Structure No Monorepo

## Контекст

После фиксации ADR-002 (Next.js 15) и ADR-005 (Content-as-Code Phase 1, без backend)
встал вопрос: как организовать корень репозитория? Нужна ли монорепо-оркестрация?

Phase 1 даёт один деплой-таргет — Next.js. Нет мобильного приложения, нет отдельного
admin-сервиса, нет shared TypeScript-пакетов между несколькими приложениями. В Phase 2
появится PocketBase, но это отдельный Docker-сервис, а не ts-workspace: общих файлов
с Next.js у него не будет.

Reference-проекты пользователя:

- `moreminsk` — плоская структура (Next.js в корне); один деплой-таргет, нет ws.
- `comforthotel` — полу-плоская: `landing/` + `docs-site/` без общих пакетов и без
  workspace-оркестрации; каждый деплоится независимо.
- `core-tech-orch` — настоящее монорепо с pnpm workspaces: несколько сервисов, реальные
  shared-пакеты. Оправдано там, не оправдано здесь.

Стандартное первое решение команды — «сделаем монорепо, вдруг пригодится» — приводит
к turbo/nx overhead ради одного `apps/web/`. Этот ADR закрывает вопрос явно.

## Варианты

### A. Монорепо (pnpm workspaces + turbo): `apps/web/`, `packages/ui/`, `packages/seo/`, `packages/content/`
- Плюсы: разделение по ответственностям выглядит чисто; переиспользуемые пакеты теоретически подходят для будущих проектов фабрики; знакомо командам от 3+ разработчиков.
- Минусы: turbo/pnpm workspace оркестрация ради одного приложения — чистый overhead; импорты `@istok/ui` вместо `@/components` без реального выигрыша; CI усложняется (cache, filter-by-changed); ничего реально не переиспользуется — нет второго потребителя пакетов; онбординг нового разработчика тяжелее.

### B. Плоская структура: `web/` в корне, Next.js-приложение как единственная кодовая база
- Плюсы: простейшая навигация; стандартные `@/*` импорты Next.js без настроек; CI читается за 5 секунд; copy-paste из `moreminsk` без адаптации; один `package.json`; меньше движущихся частей = меньше точек отказа.
- Минусы: если в Phase 3+ появится второе приложение — придётся мигрировать в workspace (оценка: 2–4 часа, не блокер).

### C. Полу-плоская: `web/` + `pocketbase/` как изолированные деревья без shared-пакетов
- Плюсы: PocketBase в своём поддиректории; каждый сервис со своим Dockerfile.
- Минусы: формально это вариант B — разница только в месторасположении конфигов, а не в наличии workspace. Выделен для ясности: `pocketbase/` добавляется без workspace-оркестрации.

## Решение

Выбираем **B. Плоскую структуру** (с учётом C как способа организации Phase 2-сервисов).
Структура корня репозитория:

```
istok/
├── docs/                    # Obsidian vault (Johnny Decimal)
├── web/                     # Next.js 15 application
│   ├── src/
│   │   ├── app/
│   │   ├── widgets/
│   │   ├── features/
│   │   ├── entities/
│   │   └── shared/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.local
├── content/                 # MDX/TS контент-as-code (ADR-005)
│   ├── products/
│   ├── projects/
│   ├── categories.ts
│   └── schema.ts
├── nginx/                   # nginx config
├── scripts/                 # check-secrets.sh, deploy-helpers
├── .github/workflows/       # CI (deploy-prod.yml)
├── docker-compose.yml       # web + nginx (PocketBase добавится в Phase 2)
├── Dockerfile               # для web
├── CLAUDE.md
├── README.md
└── .gitignore
```

Один приложение → нет необходимости в workspace-оркестрации. Монорепо оправдано, когда
есть shared-пакеты с несколькими потребителями или несколько независимо деплоящихся
сервисов с общим кодом. Ни того, ни другого в istok Phase 1–2 нет. Пакет `packages/ui`,
у которого один потребитель (`apps/web`), — это не переиспользование, это просто
перемещение файлов с усложнением импортов.

`content/` живёт в корне (а не в `web/src/`), чтобы быть независимым от деплой-таргета:
при добавлении второго приложения в Phase 3 оно сможет читать тот же контент без
перемещений. Импортируется в `web/` через path-alias `@content/*` в `web/tsconfig.json`
или через relative-paths из `web/src/shared/lib/content-loader.ts`.

В Phase 2 PocketBase добавляется как `pocketbase/` в корне с собственным Dockerfile и
записью в `docker-compose.yml`. Никаких workspace-изменений это не требует: общих
TypeScript-файлов между Next.js и PocketBase не возникает.

## Последствия

**Что делаем:**

- Создаём `web/` через `bunx create-next-app@latest --typescript --eslint --app --src-dir --import-alias "@/*"`.
- FSD-lite слои внутри `web/src/`: `app/`, `widgets/`, `features/`, `entities/`, `shared/` — по паттерну `moreminsk`/`comforthotel`.
- `content/` в корне репо; `web/tsconfig.json` добавляет path-alias `@content/*` → `../content`.
- `Dockerfile` в корне: build-context включает `web/` и `content/` (MDX парсится при `next build`).
- `package.json` один — в `web/`. Корень репо без `package.json` (нет workspace).

**Что НЕ делаем в Phase 1–2:**

- Не подключаем pnpm workspaces / turbo / nx.
- Не выделяем `packages/ui`, `packages/seo`, `packages/content` — нет второго потребителя.
- Не дублируем компоненты в виде «shared library» — переиспользование внутри одного
  приложения через FSD-слои (`shared/ui/`, `shared/lib/`).

**Обратимость: лёгкая.**

Переход в монорепо при появлении второго приложения: создать `pnpm-workspace.yaml`,
переместить `web/` → `apps/web/`, добавить `packages/`, обновить пути в Dockerfile и CI.
Оценка — 2–4 часа. Ни одна строка кода текущего приложения не переписывается.

**Кто затронут:**

- Разработка — стандартные паттерны Next.js (`@/*` алиас, `src/` директория); нет
  нестандартных workspace-команд при установке зависимостей и запуске.
- DevOps — простой `Dockerfile` + `docker-compose.yml` в корне; CI запускается одной
  командой без turbo-фильтров.

## Имплементация

Не начата. Зависит от старта Phase 1 (код ещё не создан).

Следующие шаги при старте:

1. `bunx create-next-app@latest web --typescript --eslint --app --src-dir --import-alias "@/*"`.
2. Добавить в `web/tsconfig.json` path-alias: `"@content/*": ["../content/*"]`.
3. Создать `content/` по структуре ADR-005.
4. Написать `Dockerfile` в корне с multi-stage build (`COPY content ./content`, `COPY web ./web`).
5. Написать `docker-compose.yml` с сервисом `web` + `nginx`.

## Связанные

- [[ADR-002 Next.js 15 as Frontend]] — фронтенд-стек; `web/` содержит это приложение.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — определяет наличие `content/` в
  корне репо и отсутствие backend-сервиса в Phase 1.
- ADR-006 (этот) совместим с будущим ADR о Hosting (Docker VPS) — `Dockerfile` и
  `docker-compose.yml` в корне уже предусмотрены структурой.
- Reference: `~/Documents/moreminsk/` — плоская структура, донор паттерна.
- Reference: `~/Documents/comforthotel/landing/` — плоская внутри полу-плоского репо.
- `CLAUDE.md` секция «Структура репо» — обновить после принятия с реальной финальной
  структурой.
- [[Dashboard]] — общий статус проекта.
