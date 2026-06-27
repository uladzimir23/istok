---
title: ADR-009 — Hetzner Agency Server Hosting
description: Хостинг istokmebel.by переносится с GitHub Pages (ADR-008) на общий сервер агентства SYNC (Hetzner 89.169.54.11) по каноническому паттерну GHCR + Docker Compose + nginx:alpine.
order: 9
status: proposed
date: 2026-06-26
supersedes: ADR-008
---

# ADR-009 — Hetzner Agency Server Hosting

> Supersedes [[ADR-008 GitHub Pages Static Export Hosting]].
> Концептуально реанимирует серверный подход [[ADR-006 Self-hosted Docker VPS Hosting]],
> но на другом сервере (уже существующий, а не новый VPS) и по иному паттерну
> (GHCR + compose + static-в-nginx:alpine, а не standalone + провижининг с нуля).

## Контекст

ADR-008 выбрал GitHub Pages по принципу **defer-complexity**: своего сервера не было,
поднимать VPS ради статики — инфраструктура без задачи. ADR-006 (Docker VPS) был
superseded, Phase 1 задеплоена на GH Pages.

Теперь триггер изменился:

- У агентства SYNC **уже есть общий Hetzner-сервер 89.169.54.11 (Ubuntu 24.04)**
  с отлаженным каноническим паттерном деплоя. На нём живут 6+ сайтов: moreminsk,
  comforthotel-landing, clariva-landing, flex-glass и др.
- Паттерн задокументирован в `~/Desktop/sync-agency-server/docs/40 - Architecture/Deploy pattern (GHCR + compose).md`
  и проверен на нескольких проектах. SSH-ключи, GHCR org, host-nginx и certbot
  уже настроены.
- istok на этом сервере — **не «инфра без задачи»**: переиспользуем существующую инфру
  без дополнительного Opex. Принцип defer-complexity соблюдён иначе: вместо отдельного
  пайплайна GH Pages — один общий канон агентства.
- GitHub Pages требует `basePath: "/istok"` (project page без кастомного домена) и
  изолирован от серверного парка. При росте заявок / активации PocketBase (ADR-005)
  сервер агентства всё равно понадобится — лучше сразу.

## Варианты

### A. Остаться на GitHub Pages (ADR-008)

- Плюсы: zero-ops; SSL и CDN без настройки; деплой = `git push`; расходов ноль.
- Минусы: статика раздаётся по подпути `/istok` (пока нет кастомного домена),
  что ломает canonical URL; отдельный пайплайн вне парка агентства; при активации
  PocketBase Phase 2 всё равно переезжать на сервер — т.е. откладываем неизбежное.

### B. Сервер агентства, GHCR + Compose, nginx:alpine — static (выбранный)

- Плюсы: единый канон с остальными сайтами агентства; свой поддомен `new.istokmebel.by`
  с TLS через certbot; basePath убирается — нет проблем с canonical; сервер рядом →
  PocketBase Phase 2 добавляется одной строкой в `docker-compose.yml`;
  infrastructure-as-code в репо (`infra/`).
- Минусы: нужен серверный тюнинг (DNS A-запись, vhost в `/etc/nginx/sites-enabled/`,
  certbot, `/opt/istok/docker-compose.yml`) — но всё это уже отлажено на аналогах
  и занимает ~30 минут по готовому runbook'у.

### C. Сервер агентства, Next.js standalone (как clariva)

- Плюсы: полный Next.js runtime; API routes работают нативно.
- Минусы: истоку не нужен runtime: нет SSR, нет `/api/*` в Phase 1 (ADR-005 — заявки
  через внешний endpoint). Standalone — тяжелее образ, лишний Node-процесс, лишняя
  точка отказа ради раздачи статики.

## Решение

Выбираем **B. Сервер агентства, GHCR + Compose, nginx:alpine**.

istok остаётся **static export** (`output: "export"`) — единственное что меняется,
это кто раздаёт `web/out`: вместо CDN GitHub — контейнер `nginx:alpine` за
host-nginx на `89.169.54.11`. Паттерн `push → Actions → docker build → GHCR → ssh →
docker compose pull && up -d` применяется без изменений, как в moreminsk и comforthotel.

Ключевая особенность istok среди проектов сервера: Next-приложение в `web/`, контент в
соседнем `content/` (loader читает `../content`). Поэтому Dockerfile написан с
build-контекстом из корня репо: multi-stage `bun deps → node build (cwd web/) →
nginx:alpine (копирует web/out)`. Это отличает истоковый Dockerfile от moreminsk (всё
в корне) и clariva (standalone, нет статики), но не выходит за канон паттерна.

## Последствия

**Что делаем:**

- `Dockerfile` — custom multi-stage: build-контекст = корень репо;
  stage 1 `oven/bun` `bun install --frozen-lockfile --ignore-scripts` (cwd `web/`);
  stage 2 `node:22-alpine` `npx next build` (cwd `web/`, читает `../content`) —
  Node, т.к. napi-модули Next не работают на Bun;
  stage 3 `nginx:alpine`, `COPY --from=builder web/out /usr/share/nginx/html`.
- `.dockerignore` — исключает `node_modules`, `.next`, `out`, `docs`, `sandbox`,
  `.vault-private` и сырьё клиента (build-контекст лёгкий).
- `infra/nginx/container.conf` — nginx-конфиг внутри контейнера (раздача статики,
  fallback на `index.html` для SPA-навигации не нужен при static export с `trailingSlash`).
- `infra/nginx/new.istokmebel.by.conf` — host-vhost: `proxy_pass 127.0.0.1:3007`.
- `infra/docker-compose.yml` — сервис `istok`, порт `3007:80`, image из GHCR.
- `.github/workflows/deploy.yml` — триггер `push → main` (пути `web/**`, `content/**`);
  шаги: checkout v7.0.0 → setup-buildx v4.1.0 → login GHCR v4.2.0 →
  build-push v7.2.0 → appleboy/ssh-action v1.2.5 (`docker compose pull && up -d`).
  Экшены запинены к SHA (безопасность supply chain).
- Удалён `.github/workflows/deploy-pages.yml`; из `web/next.config.ts` убраны
  `basePath`, `assetPrefix`, `GITHUB_PAGES` env.
- Домен `new.istokmebel.by` — preview-поддомен на период до DNS-cutover (аналог
  `new.moreminsk.by`, `new.comforthotel.by`).
- Порт **3007** — следующий свободный в парке сервера (clariva-old: 3006).

**Что НЕ делаем:**

- Не переходим на Next.js standalone — `output: "export"` остаётся.
- Не деплоим на GitHub Pages — `deploy-pages.yml` удалён.
- Не поднимаем отдельный VPS для истока (ADR-006 не реанимируется буквально).
- Не меняем логику заявок: внешний endpoint `NEXT_PUBLIC_LEAD_ENDPOINT` по-прежнему
  в силе (ADR-005 / ADR-008 в этой части не меняется).
- Не трогаем `istokmebel.by` (Tilda) — apex остаётся на Tilda до финального cutover.

**Обратимость: лёгкая.**

Статический `web/out` портабелен. Вернуться на GH Pages — удалить `deploy.yml`,
восстановить `deploy-pages.yml` + `basePath`; занимает ~1 час. Перейти на Vercel —
то же самое без basePath. Перейти на standalone (Phase 2 + PocketBase) — сменить
`output` в `next.config.ts` и обновить Dockerfile/compose; ~0.5 дня, контент и
компоненты не затронуты.

**Кто затронут:**

- Разработка — деплой теперь в канон агентства; убирается subpath-головная боль.
- DevOps (серверная часть) — нужно разово выполнить серверный тюнинг (см. Имплементация).
- Бизнес — сайт доступен на `new.istokmebel.by` (нормальный URL) до cutover.

## Имплементация

**Частично реализована** (задеплоено в репо в сессии 2026-06-26):

- [x] `Dockerfile` (custom, web/ + content/)
- [x] `.dockerignore`
- [x] `infra/nginx/container.conf`
- [x] `infra/nginx/new.istokmebel.by.conf`
- [x] `infra/docker-compose.yml` (порт 3007)
- [x] `.github/workflows/deploy.yml` (GHCR + ssh-action, все экшены запинены к SHA)
- [x] Удалён `.github/workflows/deploy-pages.yml`
- [x] `web/next.config.ts` — убраны GH Pages `basePath` / `assetPrefix`

**Открытые серверные шаги (требуют доступа/подтверждения, не сделаны):**

- [ ] DNS A-запись `new.istokmebel.by` → `89.169.54.11`
- [ ] Секрет `DEPLOY_SSH_KEY` в настройках GitHub-репо istok
- [ ] На сервере: `/opt/istok/docker-compose.yml` (скопировать из `infra/`)
- [ ] На сервере: host-vhost `/etc/nginx/sites-enabled/new.istokmebel.by` (скопировать из `infra/nginx/`)
- [ ] `certbot --nginx -d new.istokmebel.by` на сервере
- [ ] Обновить Dashboard сервера агентства (sync-agency-server) — добавить истоку домен/порт 3007

## Связанные

- [[ADR-008 GitHub Pages Static Export Hosting]] — superseded этим ADR; GH Pages пайплайн
  удалён.
- [[ADR-006 Self-hosted Docker VPS Hosting]] — был superseded ADR-008; концептуально
  частично возвращаемся к серверному деплою, но на существующий сервер агентства,
  а не новый VPS с провижинингом с нуля.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — заявки через внешний
  `NEXT_PUBLIC_LEAD_ENDPOINT` в силе; этот ADR не меняет логику форм.
- Внешний референс: `~/Desktop/sync-agency-server/docs/40 - Architecture/Deploy pattern (GHCR + compose).md`
- [[Dashboard]]
