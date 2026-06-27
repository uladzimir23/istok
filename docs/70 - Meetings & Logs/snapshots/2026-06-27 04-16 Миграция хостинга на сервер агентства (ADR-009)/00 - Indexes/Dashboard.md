---
title: istok — панель проекта
description: Главная страница документации с текущим статусом и ссылками на ключевое
order: 0
---

# istok — Dashboard

Корпоративный сайт мебельной фабрики «Исток-мебель» (istokmebel.by). Миграция с Tilda
на собственный стек. Этот проект — эталон SDD-практик для будущих проектов фабрики.

## Линзы по отделам

> Один проект — несколько углов зрения. Эта страница — общий статус.
> Если вы конкретный отдел — сразу к своей линзе:

- 🟦 [[01 Маркетинг]] — для отдела продаж и владельца: что строим, какие воронки,
  KPI, что нужно от вас.
- 🟪 [[02 Разработка]] — для разработчиков: стек, ADR-карта, зоны кода, риски,
  блокеры, окружения.

Шаблон новой dept-линзы — `docs/80 - Templates/dept-dashboard.md`.
Правила паттерна — `.claude/skills/multi-audience-docs.md`.

Впервые в проекте? → [[Архитектура знаний]] — карта слоёв документации и памяти за
5 минут чтения.

## Статус (2026-06-26)

- ✅ **Phase 0 — SDD-каркас завершён (2026-05-01).**
  - `CLAUDE.md` создан с видением, redaction policy, workflow.
  - `.claude/skills/` — 7 базовых скиллов (session-log, git-workflow, redaction,
    docs-writing, knowledge-graph, multi-audience-docs, snapshot).
  - `.claude/agents/` — `docs-sync` и `adr-drafter`.
  - `docs/` по Johnny Decimal — все 17 разделов с README.
  - Бриф проекта и аудит as-is занесены.
- ✅ **Phase 1 — ADR-каркас завершён (2026-05-01).** ADR-001..009. Цепочка по хостингу:
  ADR-006 (VPS) → ADR-008 (GitHub Pages) → **ADR-009 (сервер агентства SYNC)** — актуальное.
  ADR-001 superseded ADR-005 ещё до имплементации.
- ✅ **Phase 1 — Имплементация завершена (2026-06-26).** `web/` (Next.js 16, App Router,
  TS strict, FSD-lite) собрана. 26 MDX-товаров в `content/`, ~18 виджетов, SSG-карточки,
  robots/sitemap/JsonLd.
- 🟡 **Хостинг мигрирует с GitHub Pages на сервер агентства (ADR-009).** Репо-обвязка
  готова: Dockerfile (под `web/`+`content/`), `infra/nginx/`, `deploy.yml` (GHCR + ssh,
  SHA-пины). Деплой на `new.istokmebel.by` (порт 3007) — ждёт DNS + `DEPLOY_SSH_KEY` +
  серверных шагов. Карта сервера — в волте `sync-agency-server`.
- 🟡 **Tilda продолжает работать на `istokmebel.by`.** Не трогаем до cutover'а.

### ADR landscape (2026-06-26)

| ADR | Название | Статус |
|---|---|---|
| ADR-001 | PocketBase as Backend | superseded by ADR-005 |
| ADR-002 | Next.js 16 as Frontend | proposed |
| ADR-003 | Brand Architecture: One Site Two Brands | proposed |
| ADR-004 | SCSS Modules as Style Layer | proposed |
| ADR-005 | Content-as-Code Phase 1 No Backend | proposed |
| ADR-006 | Self-hosted Docker VPS Hosting | superseded by ADR-008 |
| ADR-007 | Flat Repo Structure No Monorepo | proposed |
| ADR-008 | GitHub Pages Static Export Hosting | superseded by ADR-009 |
| ADR-009 | Hetzner Agency Server Hosting | proposed (реализуется) |

> Хостинг-цепочка: ADR-006 → ADR-008 → **ADR-009** (актуальный). ADR-009 → `accepted`
> после первого успешного деплоя на `new.istokmebel.by`.

## Текущий приоритет

✅ **Phase 0, Phase 1 ADR-каркас и Phase 1 имплементация завершены.**

⏳ **Поднять `new.istokmebel.by` на сервере (ADR-009):**
1. **DNS** — A-запись `new.istokmebel.by` → `89.169.54.11`.
2. **Секрет** `DEPLOY_SSH_KEY` в GitHub-репо istok.
3. **Сервер** — `/opt/istok/docker-compose.yml`, host-vhost, `certbot --nginx`. Порт 3007
   (по докам сервера; live не подтверждён — проверить `docker ps` перед деплоем).

⏳ **Открытые задачи для выхода в прод (`istokmebel.by`):**
4. **Приёмник заявок** — настроить реальный endpoint (Telegram-бот + Resend email),
   задать `NEXT_PUBLIC_LEAD_ENDPOINT`.
5. **Портфолио госзаказа** — наполнить `content/projects/` (сейчас пусто, `.gitkeep`).
6. **Цены на «Элис»** — от клиента (8 моделей × 3 размера), без них карточки без цен.
7. **DNS-cutover** — перевести apex `istokmebel.by` с Tilda на сервер после финального QA
   на `new.istokmebel.by`.

## Ключевые документы

**Always:**
- [[Архитектура знаний]] — карта слоёв.
- `~/Projects/zavody-rb/istok/CLAUDE.md` — видение, стек, redaction.

**Active scope (Phase 1 → cutover):**
- [[Бриф проекта]] — бренд-архитектура, 3 направления, каталог Элис.
- [[Сайт as-is]] — что есть на Tilda, что отсутствует.
- `docs/40 - Architecture/42 - ADR/` — ADR-001..009 (хостинг: ADR-009 актуальный,
  ADR-006/008 superseded).

## Логи сессий

- [[2026-05-01 03-30 ADR-каркас Phase 1]] — SDD-каркас + ADR-001..007 (init)
- [[2026-06-26 23-24 Сверка docs с кодом, пивот на GitHub Pages]] — Phase 1 имплементация завершена, ADR-008, пивот на GH Pages

## Открытые вопросы (требуют ответа клиента)

1. **Цены на «Элис».** Без них новый сайт остаётся «как Tilda» по контенту.
2. **Доступы:** есть ли уже Яндекс.Метрика / GA4 / Meta Business / Telegram-бот?
3. **Театральные кресла — есть ли каталог по ним такой же, как по «Элис»?** Сейчас
   видны только модели по именам, без размеров/материалов/комплектаций.
4. **Сертификаты, история компании, кейсы госзаказа** — какие документы можно получить
   для страницы «О компании» и B2B-портфолио?

## Связанные

- [[01 Маркетинг]]
- [[02 Разработка]]
- [[Архитектура знаний]]
- [[Бриф проекта]]
- [[Сайт as-is]]
