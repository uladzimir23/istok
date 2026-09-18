---
title: ADR-012 — Monorepo apps + packages on Bun workspaces
description: Переход с плоской структуры (ADR-007) на монорепо-раскладку `apps/{web,admin,pocketbase}` + `packages/design-system` на Bun workspaces. Триггер — три активных деплой-таргета с общим design-system.
order: 12
status: accepted
supersedes: ADR-007
date: 2026-09-19
---

# ADR-012 — Monorepo apps + packages on Bun workspaces

## Контекст

ADR-007 (2026-05-01) зафиксировал плоскую структуру `web/` в корне репо с обоснованием
«одно приложение → workspace-оркестрация — overhead». Гипотеза не выдержала:

- **ADR-010** (2026-06-27) активировал PocketBase Phase 2 — второй деплой-юнит с
  Dockerfile и GHCR-образом (`istok-pb`).
- **ADR-011** (2026-06-27) добавил custom admin SPA — третий деплой-юнит (`istok-admin`,
  Vite + React).
- Design-system (SCSS токены + миксины) уже вынесен в `shared/design-system/`, чтобы
  использоваться из обоих `web/` (Next.js) и `admin/` (Vite). Первый реальный общий пакет.

Флаг «переехать в монорепо» из ADR-007 (сноска «оценка 2–4 часа») пора отдёрнуть.

Дополнительный триггер (2026-09-19) — пользователь озвучил желание переехать в монорепо
явно, в контексте расширения линейки проектов (`~/Projects/istok` уже вынесен из
тестового кластера `zavody-rb`, план — сделать эталонную раскладку для новых заводов).

## Варианты

### A. Оставить плоскую (ADR-007)
- Плюсы: ничего не менять; текущий CI работает.
- Минусы: три деплой-юнита в корне без иерархии; `admin/` и `pocketbase/` живут на том же
  уровне, что и `docs/`, `content/`, `infra/`, `.claude/` — семантический шум. Нет
  канонического места, где отражена симметрия «сайт / админка / PB»; новый проект фабрики,
  скопировавший этот шаблон, наследует ту же путаницу.

### B. Bun workspaces, `apps/{web,admin,pocketbase}` + `packages/design-system`
- Плюсы: canonical monorepo layout, три деплой-юнита в одном месте; общий пакет
  design-system сидит там, где ожидается; каркас готов принять `packages/content-schema`,
  `packages/ui`, второй `apps/mobile` без реструктуризации; онбординг новых проектов
  фабрики (референс-эталон) читается за 5 секунд.
- Минусы: 300+ файлов переезжают; пути в Dockerfile'ах, CI, `next.config`, `vite.config`,
  47 SCSS-импортов обновляются одной волной; риск сломать прод-деплой в момент миграции.

### C. Turborepo/Nx поверх Bun workspaces
- Плюсы: task orchestration, remote cache; удобно когда пакетов много.
- Минусы: overhead ради одного активного `apps/web` (admin/pocketbase пересобираются
  редко); Bun workspaces сами по себе достаточно; Turborepo можно добавить позже без
  реструктуризации.

## Решение

Выбираем **B**. Раскладка:

```
istok/
├── apps/
│   ├── web/                # Next.js 16 (ADR-002) — сайт istokmebel.by
│   ├── admin/              # Vite + React SPA (ADR-011) — admin.istokmebel.by
│   └── pocketbase/         # PocketBase 0.25.9 (ADR-010) — admin.istokmebel.by /api/, /_/
├── packages/
│   └── design-system/      # SCSS токены/миксины/базы (общий для web + admin)
├── content/                # MDX (Phase 1) → уезжает в PB
├── infra/                  # deploy compose + host-nginx vhosts (не workspace)
├── docs/                   # Obsidian vault
├── docker-compose.dev.yml  # локальный dev: PB рядом с web+admin
├── package.json            # "workspaces": ["apps/web", "apps/admin", "packages/*"]
└── ...
```

Bun workspaces активны только для JS-подпроектов (`apps/web`, `apps/admin`, `packages/*`).
`apps/pocketbase` физически там же для мысленной симметрии («три деплой-юнита»), но из
workspaces исключён — package.json у него нет, это Go-бинарь с миграциями.

Turborepo не подключаем сейчас — Bun workspaces + explicit `bun --cwd apps/web run build`
достаточно; добавим Turborepo когда появится 3+ активных JS-приложения.

## Последствия

**Что переехало (2026-09-19, commit `ee8f050` + `d4c5449`):**
- `web/` → `apps/web/`
- `admin/` → `apps/admin/`
- `pocketbase/` → `apps/pocketbase/`
- `shared/design-system/` → `packages/design-system/`
- Корневой `Dockerfile` → `apps/web/Dockerfile`
- Root `package.json` создан с workspaces
- `.dockerignore`, `.gitignore`, `.github/workflows/deploy.yml` обновлены
- `apps/web/next.config.ts` — loadPaths `../..`
- `apps/web/tsconfig.json` — path-alias `packages/*` вместо `shared/*`
- `apps/admin/vite.config.ts` — loadPaths `../..`
- entities loader'ы (product, project) — `process.cwd() + "../../content"`
- 47 SCSS-файлов — `@use "shared/design-system/..."` → `@use "packages/design-system/..."`

**Что НЕ изменилось:**
- `content/` остался в корне (не в `apps/` и не в `packages/`) — контент независим от
  workspaces, при активации PB (Phase 2 continued) уедет полностью в БД.
- `infra/` осталась в корне — deploy compose и host-nginx vhosts не workspace.
- Продакшн-инфра: та же (GHCR тегами, порт 3008 site, порт 3009 admin, порт 8093 PB).

**Обратимость:** назад в плоскую структуру — при желании 2–4 часа `git mv` в обратную
сторону + откат правок путей.

**Кто затронут:**
- Разработка — путь `web/src/` теперь `apps/web/src/`; `bun run dev` из `apps/web/`
  вместо `web/`. Скрипты в корневом package.json (`bun run dev`/`build:web`) для удобства.
- CI — build-context для `apps/web/Dockerfile` и `apps/admin/Dockerfile` = корень репо
  (было для web/); PB build-context = `apps/pocketbase/` (было `pocketbase/`).
- DevOps — сервер не трогается (GHCR теги те же).

## Имплементация

Выполнена 2026-09-19 (commits `ee8f050`, `d4c5449`). CI зелёный, прод на монорепо-образах.

**Дальнейшие шаги (не в рамках этого ADR):**
- Full content migration MDX → PB (Phase 2 продолжение) — отдельный ADR или продление
  ADR-010.
- Если появится `apps/mobile` или второй сайт — добавить в `workspaces`.
- Если пересборка CI станет медленной — добавить Turborepo с GHA cache.

## Связанные

- **Supersedes** [[ADR-007 Flat Repo Structure No Monorepo]]
- [[ADR-002 Next.js 15 as Frontend]] — `apps/web/` — реализация
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — `content/` в корне монорепо
- [[ADR-009 Hetzner Agency Server Hosting]] — deploy-инфра, не тронута
- [[ADR-010 PocketBase Activation Phase 2 Static Rebuild]] — `apps/pocketbase/`
- [[ADR-011 Custom Admin SPA over PocketBase]] — `apps/admin/`
