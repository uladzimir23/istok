---
title: ADR-008 — GitHub Pages Static Export Hosting
description: Хостинг istokmebel.by переведён с Self-hosted Docker VPS (ADR-006) на статический экспорт Next.js, деплоящийся на GitHub Pages через GitHub Actions.
order: 8
status: proposed
date: 2026-06-26
supersedes: ADR-006
---

# ADR-008 — GitHub Pages Static Export Hosting

> Reconciliation ADR: решение уже реализовано в коде. Этот документ приводит
> документацию в соответствие с фактическим состоянием репо.
>
> Supersedes [[ADR-006 Self-hosted Docker VPS Hosting]].

## Контекст

ADR-006 (proposed, не имплементирован) зафиксировал деплой через Docker Compose на
собственный VPS (Next.js standalone + nginx + certbot) по паттерну comforthotel ADR-024.

В процессе Phase 1 имплементации выяснилось: этот проект — **brochure-site**, у которого
нет стейтфул-задач, нет БД (ADR-005 отложил PocketBase в Phase 2 по trigger-условиям),
нет серверных вычислений в runtime. Весь контент — MDX/TS в репо, генерируется в `web/out`
на этапе `bun run build`. Поднимать VPS, настраивать Docker, nginx, certbot, SSH-ключи
и писать server-runbook ради раздачи статики — это инфраструктура без задачи.

GitHub Pages раздаёт статику бесплатно через CDN, деплой = `git push`, SSL встроен.
Это точнее соответствует принципу проекта **defer-complexity-until-justified**, чем
разворачивание VPS-стека ради витрины.

## Варианты

### A. Self-hosted Docker на VPS (ADR-006 — отвергнут)

- Плюсы: полный контроль; в Phase 2 PocketBase добавляется одной строкой в `docker-compose.yml`;
  предсказуемые фикс-расходы; паттерн из comforthotel ADR-024 готов.
- Минусы: **для чистой статики — избыточная инфраструктура**: VPS, Docker, nginx, certbot,
  SSH-ключи, server-runbook, мониторинг диска, SSL-ротация cron; всё это нужно
  обслуживать вечно ради сайта, который не генерирует ничего в runtime; противоречит
  принципу «эталон лучших практик = меньше движущихся частей».

### B. GitHub Pages static export (выбранный)

- Плюсы: zero-ops, ноль расходов; деплой = `git push main`; SSL автоматический; статика
  раздаётся с CDN GitHub (edge-присутствие); для brochure-site достаточно; контент в git
  (ADR-005) органично совпадает с hosting-in-git; кастомный домен `istokmebel.by` через
  CNAME — один шаг при cutover.
- Минусы: нет серверных API routes → `/api/lead` из ADR-005 невозможен при `output: "export"`,
  нужен внешний serverless-endpoint; сайт живёт по подпути `/istok` (project page) — до
  привязки кастомного домена; нет ISR / SSR / middleware (для brochure-site не требуется);
  при активации PocketBase в Phase 2 потребуется миграция хостинга на контейнерный стек.

### C. Vercel / Netlify (managed)

- Плюсы: managed, zero-ops; нативная поддержка Next.js (ISR, edge, preview deployments).
- Минусы: SaaS-зависимость; для чистой статики без SSR/ISR managed-overhead неоправдан;
  GitHub Pages проще и бесплатнее без лимитов credits (comforthotel ADR-019 — именно
  Netlify credit cap вынудил мигрировать); привязка к американскому провайдеру даёт
  latency для BY/RU аудитории хуже европейского CDN.

## Решение

Выбираем **B. GitHub Pages static export** как хостинг Phase 1.

Для сайта-витрины, у которого весь контент — это MDX/TS в репо, а все страницы генерируются
статически через `generateStaticParams`, GitHub Pages — это не компромисс, а наиболее
точное соответствие задаче. Нет бэкенда → нет смысла в контейнерах. Деплой = файлы в
`web/out`, которые Actions загружают через `actions/upload-pages-artifact` и раздаёт CDN.
Обслуживать нечего: ни сервер, ни certbot, ни nginx, ни диск.

Единственная реальная потеря — серверный `/api/lead` из ADR-005. Решается через внешний
endpoint (serverless-функция или сторонний сервис Telegram + email), конфигурируемый через
`NEXT_PUBLIC_LEAD_ENDPOINT`. Это не регресс: заявки всё равно шли бы в Telegram и Resend
(внешние системы), API route был только прокси. Вынести прокси наружу — незначительное
архитектурное изменение, не усложняющее ни клиент, ни инфраструктуру.

## Последствия

**Что делаем:**

- `web/next.config.ts` — `output: "export"`, `trailingSlash: true`,
  `images: { unoptimized: true }`; при `GITHUB_PAGES=true` — `basePath: "/istok"`,
  `assetPrefix: "/istok/"`, `env.NEXT_PUBLIC_BASE_PATH="/istok"`.
- `.github/workflows/deploy-pages.yml` — триггер `push → main` по путям
  `web/**`, `content/**`, `.github/workflows/**`; шаги: `bun install --frozen-lockfile` →
  `bun run build` (с `GITHUB_PAGES=true`) → `actions/upload-pages-artifact` (path `web/out`) →
  `actions/deploy-pages`; concurrency group `pages`, `cancel-in-progress: true`.
- `web/src/shared/lib/assetPath.ts` — хелпер для ручного префикса `basePath`
  на стороне клиента (нужен т.к. `next/image` при `unoptimized: true` + static export
  не добавляет `basePath` к `src` автоматически).
- `web/src/widgets/LeadForm/LeadForm.tsx` — отправка заявки на
  `process.env.NEXT_PUBLIC_LEAD_ENDPOINT`; если переменная не задана — `console.info`
  с payload (заглушка).

**Открытые пункты:**

- Поднять реальный приёмник заявок (serverless-функция или Telegram-бот-вебхук + Resend)
  и выставить URL как `NEXT_PUBLIC_LEAD_ENDPOINT` в Pages secrets.
- При DNS-cutover `istokmebel.by` — прописать кастомный домен в настройках репо
  (Pages → Custom domain → CNAME). После этого `basePath: "/istok"` и `/istok`-подпуть
  уходят, сайт живёт на apex.

**Что НЕ делаем (всё из ADR-006 отменяется):**

- Не поднимаем VPS, не настраиваем Docker Compose для Phase 1.
- Не создаём `nginx/` конфиг и certbot cron.
- Не пушим образы в ghcr.io, не используем `appleboy/ssh-action`.
- Не реализуем health endpoint `/api/health` и version endpoint `/api/version`.
- Не настраиваем UptimeRobot пинг на серверный health endpoint.
- Не храним GitHub secrets `SSH_HOST`, `SSH_KEY`, `SSH_USER`, `GHCR_TOKEN` (для деплоя).

**Обратимость: лёгкая.**

Next.js portable по определению. Переход на VPS (при активации PocketBase Phase 2)
или Vercel — это смена `output` в `next.config.ts` с `"export"` на `"standalone"` +
настройка CI. Оценка: ~1 рабочий день, не затрагивает контент, схемы или компоненты.

**Кто затронут:**

- Разработка — деплой упрощается до `git push`; заявки требуют внешнего endpoint
  (отдельная задача).
- DevOps — VPS и server-runbook из ADR-006 не нужны в Phase 1; при Phase 2
  (PocketBase-триггер) возвращаемся к контейнерному стеку.
- Бизнес — ноль расходов на хостинг Phase 1; latency — CDN GitHub (для BY/RU аудитории
  приемлемо на этапе разработки).

## Имплементация

Реализована. Файлы в репо:

- `web/next.config.ts` — `output: "export"` + `basePath`/`assetPrefix` при `GITHUB_PAGES=true`.
- `.github/workflows/deploy-pages.yml` — полный пайплайн GitHub Actions → Pages.
- `web/src/shared/lib/assetPath.ts` — клиентский хелпер для `basePath`-префикса.
- `web/src/widgets/LeadForm/LeadForm.tsx` — форма заявки на `NEXT_PUBLIC_LEAD_ENDPOINT`
  (заглушка `console.info` когда env не задан).

Открыто:

- [ ] Настроить `NEXT_PUBLIC_LEAD_ENDPOINT` — реальный приёмник заявок (Telegram + Resend).
- [ ] DNS-cutover `istokmebel.by` → кастомный домен в GitHub Pages (CNAME).

## Связанные

- [[ADR-006 Self-hosted Docker VPS Hosting]] — superseded этим ADR; VPS-стек не
  имплементировался и не нужен в Phase 1.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — уточняется в части `/api/lead`:
  маршрут невозможен при `output: "export"`; заявки идут на внешний endpoint через
  `NEXT_PUBLIC_LEAD_ENDPOINT`.
- [[ADR-002 Next.js 15 as Frontend]] — фронтенд-стек; `output: "export"` — режим
  Next.js, зависит от ADR-002.
- [[ADR-007 Flat Repo Structure No Monorepo]] — структура репо, которую деплоим.
- [[Dashboard]] — общий статус проекта.
