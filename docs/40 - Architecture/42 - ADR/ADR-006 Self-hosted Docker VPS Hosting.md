---
title: ADR-006 — Self-hosted Docker VPS Hosting
description: Продакшен `istokmebel.by` размещается на собственном VPS через Docker Compose (Next.js + nginx + Let's Encrypt) по паттерну comforthotel ADR-024.
order: 6
status: proposed
date: 2026-05-01
---

# ADR-006 — Self-hosted Docker VPS Hosting

## Контекст

После принятия ADR-002 (Next.js 15) и ADR-005 (Content-as-Code, без БД в Phase 1)
встал вопрос продакшен-хостинга. Деплой нужен для `istokmebel.by` — корпоративного
сайта-витрины с аудиторией BY/RU.

В reference-проекте `comforthotel` уже отлажен self-hosted Docker deploy (ADR-024,
2026-04-21) на VPS Aeza (`89.169.54.11`): multi-stage Dockerfile (Bun + Node 20-alpine
standalone), docker-compose, nginx + certbot, GitHub Actions CI (`deploy-dev.yml`
через ghcr.io + SSH appleboy → `docker compose up -d`). Паттерн живёт в продакшене,
переносим и полностью нам знаком.

По ADR-005 Docker Compose в Phase 1 содержит только два сервиса — Next.js и nginx
(без стейтфул-сервисов). Это упрощает первоначальную настройку и бэкапы.

## Варианты

### A. Vercel

- Плюсы: zero-ops для Next.js; нативная поддержка ISR / edge / preview-deployments;
  OG-генерация edge runtime; встроенная аналитика; удобные preview-ссылки на PR.
- Минусы: SaaS-зависимость и непредсказуемые расходы при трафик-пиках после рекламы
  (bandwidth billing); привязка к американскому провайдеру — latency для BY/RU хуже,
  чем у европейского VPS; невозможно разместить рядом дополнительные сервисы
  (PocketBase Phase 2) без отдельной инфры.

### B. Netlify

- Плюсы: managed, бесплатный free-tier для лендингов.
- Минусы: free-tier capped credits — на проекте comforthotel был инцидент (ADR-019:
  миграция аккаунтов после превышения лимита); менее зрелая поддержка App Router
  SSR/ISR Next.js, чем у Vercel; те же географические минусы для BY/RU-аудитории.

### C. Self-hosted Docker на VPS (выбранный)

- Плюсы: полный контроль; предсказуемые расходы (фикс за VPS); локацию подбираем
  ближе к BY/RU-аудитории (Hetzner Helsinki / Aeza); готовый паттерн из comforthotel
  ADR-024 (Dockerfile, compose, CI, nginx, certbot) — копируем, не изобретаем;
  единый стек со всеми проектами пользователя; в Phase 2 PocketBase добавляется
  одной строкой в тот же docker-compose без миграции инфраструктуры.
- Минусы: ручное управление сервером (обновление OS, certbot renewals, мониторинг
  диска); SSL-ротация и DNS — на нас; необходима disciplined CI-pipeline.

## Решение

Выбираем **C. Self-hosted Docker на VPS** по паттерну comforthotel ADR-024.

Паттерн уже проверен в продакшене: `comforthotel` работает на `89.169.54.11` через
Docker Compose + ghcr.io + SSH-deploy + nginx + certbot. Нам учиться нечему — только
перенести Dockerfile, compose и GitHub Actions workflow в репо `istok`. Расходы
предсказуемы и не зависят от трафика — критично для проекта-эталона, который должен
демонстрировать экономически устойчивый self-host. Географическая близость VPS к
BY/RU-аудитории снижает latency относительно Vercel/Netlify.

Когда в Phase 2 будет активирован PocketBase (по trigger-условиям ADR-005), мы просто
дописываем `pb` сервис в тот же `docker-compose.yml`. Никакой миграции инфраструктуры,
никакого перехода между провайдерами.

## Последствия

**Что делаем:**

- `apps/web/Dockerfile` — multi-stage: build-stage (`bun install` + `bun run build`,
  `output: "standalone"`) → runtime-stage (`node:20-alpine`, копируем `.next/standalone`
  + `.next/static` + `public/`).
- `docker-compose.yml` в корне репо — сервисы `web` (Next.js standalone, порт 3000
  внутри сети) и `nginx` (reverse-proxy + статика, 80/443 наружу). Сервис `pb`
  (PocketBase) добавляется в Phase 2 без перестройки.
- `nginx/` — конфиг: `server_name istokmebel.by www.istokmebel.by`; 301-редирект
  `www` → apex; proxy_pass на `web:3000`; раздача `.next/static` и `public/` напрямую
  через nginx для снятия нагрузки с Node.
- Let's Encrypt через certbot (`--webroot` или standalone), auto-renew через cron
  (`0 3 * * * certbot renew --quiet`).
- **CI (GitHub Actions) `deploy-prod.yml`:** триггер `push → main`;
  шаги: `bun install` → `bun run typecheck` → `bun run lint` → `bun run build` →
  `docker buildx build` → `docker push ghcr.io/<org>/istok-web:<sha>` →
  `appleboy/ssh-action` → `docker compose pull && docker compose up -d` →
  `curl https://istokmebel.by/api/health` (fail CI если не 200).
- Health endpoint `/api/health` — `{ status: "ok", sha: "<GIT_SHA>", builtAt: "<ISO>" }`.
- Version endpoint `/api/version` — `{ sha: "<GIT_SHA>" }` (опционально, для отладки).
- **Мониторинг:** UptimeRobot ping на `https://istokmebel.by/api/health` каждую минуту;
  алерт в Telegram-бот при downtime.
- **Бэкапы Phase 1:** `git origin` достаточен — контент живёт в репо (ADR-005); БД нет.
  В Phase 2 добавится cron-снапшот `pb_data/`.
- VPS-провайдер — тактический выбор при provisioning (кандидаты: Hetzner Helsinki,
  Aeza); фиксируем в session log при выборе.

**Что НЕ делаем:**

- Не используем Vercel / Netlify / Cloudflare Pages.
- Не используем Kubernetes / Docker Swarm / Nomad — для одного-двух сервисов избыточно.
- Не строим CDN перед сайтом на старте (Cloudflare Free перед apex — отдельное решение
  при появлении трафик-пиков).

**Обратимость: средняя.**

Уход с self-host на Vercel — ~1 день работы: Next.js standalone → Vercel project + DNS
перевод. Обратно — столько же. Ничего критично не лочит, т.к. Next.js portable по
определению. Основной риск — потеря DevOps-знаний сервера при смене команды;
документируем server-runbook в `docs/45 - Engineering Workflow/`.

**Кто затронут:**

- DevOps (мы) — поднимаем VPS, настраиваем Docker, certbot, nginx, CI deploy-key,
  GitHub secrets (`GHCR_TOKEN`, `SSH_HOST`, `SSH_KEY`, `SSH_USER`).
- Контент-команда — deploy-flow скрыт; PR в `main` = автодеплой.
- Бизнес — фикс-расходы вместо variable-billing; downtime-алерты в Telegram.

## Имплементация

Не начата. Зависит от ADR-002 (Next.js 15) и ADR-007 (структура репо).

Шаги при старте:

1. Provisioning VPS (Aeza/Hetzner) — выбор, оплата, базовая настройка (ssh-ключи,
   ufw, Docker, docker-compose plugin).
2. Перенести `Dockerfile`, `docker-compose.yml`, `nginx/` из `comforthotel` с адаптацией
   для `istokmebel.by` (домен, порты, переменные окружения).
3. Настроить GitHub Actions `deploy-prod.yml` (ghcr.io, appleboy/ssh-action,
   health-check curl).
4. Добавить GitHub secrets: `GHCR_TOKEN`, `SSH_HOST`, `SSH_KEY`, `SSH_USER`.
5. Первый тестовый деплой на VPS (до DNS-cutover) — проверить через IP.
6. DNS-cutover `istokmebel.by` → новый VPS (с Tilda) — координируем после готовности
   контента; фиксируем дату в session log.

## Связанные

- [[ADR-002 Next.js 15 as Frontend]] — фронтенд-стек, который деплоим.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — нет БД в Phase 1, упрощает Docker
  Compose (только `web` + `nginx`).
- comforthotel ADR-024 — донор паттерна: Dockerfile, compose, nginx, certbot, CI.
- comforthotel ADR-019 — incident-context: почему ушли с Netlify в comforthotel
  (free-tier credit cap превышен, миграция аккаунтов).
- [[Dashboard]] — общий статус проекта.
