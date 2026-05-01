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

## Статус (2026-05-01)

- ✅ **Phase 0 — SDD-каркас завершён (2026-05-01).**
  - `CLAUDE.md` создан с видением, redaction policy, workflow.
  - `.claude/skills/` — 7 базовых скиллов (session-log, git-workflow, redaction,
    docs-writing, knowledge-graph, multi-audience-docs, snapshot).
  - `.claude/agents/` — `docs-sync` и `adr-drafter`.
  - `docs/` по Johnny Decimal — все 17 разделов с README.
  - Бриф проекта и аудит as-is занесены.
- ✅ **Phase 1 — ADR-каркас завершён (2026-05-01).** 7 ADR принято (proposed);
  ADR-001 superseded ADR-005 ещё до начала имплементации.
- ⏳ **Phase 1 — Имплементация стартует.** Следующий шаг: создание `web/` через
  `bunx create-next-app`, перенос fundament из moreminsk, реализация
  `content/schema.ts`.
- 🟡 **Tilda продолжает работать на `istokmebel.by`.** Не трогаем до cutover'а.

### ADR landscape (2026-05-01)

| ADR | Название | Статус |
|---|---|---|
| ADR-001 | PocketBase as Backend | superseded by ADR-005 |
| ADR-002 | Next.js 15 as Frontend | proposed |
| ADR-003 | Brand Architecture: One Site Two Brands | proposed |
| ADR-004 | SCSS Modules as Style Layer | proposed |
| ADR-005 | Content-as-Code Phase 1 No Backend | proposed |
| ADR-006 | Self-hosted Docker VPS Hosting | proposed |
| ADR-007 | Flat Repo Structure No Monorepo | proposed |

## Текущий приоритет

✅ **Phase 0 SDD-каркас и Phase 1 ADR-каркас готовы.**

⏳ **Следующее действие — Phase 1 имплементация:**
1. `bunx create-next-app` → создать `web/` с App Router, TypeScript strict.
2. Перенести fundament (SCSS-переменные, reset, tokens) из `~/Documents/moreminsk/`.
3. Реализовать `content/schema.ts` — Zod-схемы для продуктов всех трёх направлений.

## Ключевые документы

**Always:**
- [[Архитектура знаний]] — карта слоёв.
- `~/Documents/istok/CLAUDE.md` — видение, стек, redaction.

**Active scope (Phase 1 имплементация):**
- [[Бриф проекта]] — бренд-архитектура, 3 направления, каталог Элис.
- [[Сайт as-is]] — что есть на Tilda, что отсутствует.
- `docs/40 - Architecture/42 - ADR/` — ADR-001..007 приняты 2026-05-01.

## Логи сессий

- (первая сессия после init будет здесь)

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
