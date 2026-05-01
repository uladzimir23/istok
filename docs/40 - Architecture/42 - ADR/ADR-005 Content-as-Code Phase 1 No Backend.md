---
title: ADR-005 — Content-as-Code Phase 1 No Backend
description: Для Phase 1 (миграция витрины с Tilda) backend не нужен — контент живёт как код в репо (MDX/TS + Zod). PocketBase отложен в Phase 2 с явно зафиксированными trigger-условиями. Supersedes ADR-001.
order: 5
status: proposed
date: 2026-05-01
supersedes: ADR-001
---

# ADR-005 — Content-as-Code Phase 1 No Backend

> Supersedes [[ADR-001 PocketBase as Backend]] до начала имплементации.

## Контекст

ADR-001 (proposed, не имплементирован) выбрал PocketBase как единый backend. После
пересмотра scope-а Phase 1 встал вопрос: нужен ли PocketBase на старте — или это план
Phase 2?

Анализ реальной динамики контента `istokmebel.by`:

- Каталог ~30 SKU суммарно; новая модель появляется раз в квартал, цены (если
  появятся) — раз в 1–3 месяца.
- Нет корзины, нет статусов заказов, нет личного кабинета, нет регистрации.
- Заявки → email + Telegram-бот (`/api/lead`), без инбокса / БД для переписки.
- Портфолио госзаказа: новый кейс раз в несколько месяцев.
- Контент-команда на старте — мы сами; редактор на стороне фабрики появится позже
  (при наступлении одного из trigger-условий Phase 2, см. ниже).

В таких условиях PocketBase = инфраструктура без задачи: Go-бинарник, который надо
хостить, бэкапить, обновлять и мониторить ради контента, обновляющегося реже
релизного пайплайна. Reference: `comforthotel` использует PocketBase в Phase 2, не
в Phase 0.5. `flex-glass` — там PocketBase оправдан (динамические multi-tenant сайты).
У нас типичный brochure-site, и преждевременное поднятие БД противоречит принципу
«эталон лучших практик = defer-complexity-until-justified».

## Варианты

### A. Поднять PocketBase сразу (как в ADR-001)
- Плюсы: будущий редактор фабрики получит готовую Admin UI; контент в БД упрощает
  будущий sync с маркетплейсами (Wildberries, 21vek, Onliner).
- Минусы: лишняя инфра без актуальной задачи прямо сейчас; усложняет деплой и бэкапы;
  добавляет обязательный стейтфул-сервис в Docker Compose; противоречит принципу
  «лучшая практика = простая практика», который проект должен демонстрировать.

### B. Content-as-code (MDX/TS в репо + Zod-валидация)
- Плюсы: ноль инфраструктуры данных; контент в git (audit trail, history, diffs, blame);
  типобезопасность через Zod; PR-ревью контента; быстрый деплой (минуты); Lighthouse 100
  на SSG-страницах; нет CMS-лок-ина; лёгкая миграция в любую БД позже.
- Минусы: контент-редактор без git не может править сам — только мы или его обучение;
  нет живого превью без билда (dev-сервер Next.js решает на этапе авторства); правки цен
  не делаются в один клик нетехническим пользователем.

### C. Headless CMS (Sanity / Contentful)
- Плюсы: managed, готовая Admin UI, встроенное превью.
- Минусы: SaaS-зависимость и ценник; вендор-лок-ин; для редко-меняющегося контента
  overhead неоправдан; противоречит «свой стек» — направлению проекта.

## Решение

Выбираем **B. Content-as-code** в Phase 1. PocketBase отложен в Phase 2 с явно
зафиксированными trigger-условиями.

Динамика контента `istokmebel.by` на старте не оправдывает наличие БД: каталог стабилен,
нет транзакций, нет персонализации, нет ролей. Git как контент-store даёт audit trail и
PR-ревью бесплатно. Zod-валидация на билде ловит ошибки раньше, чем PocketBase
collection-rules. Меньше инфра-движущихся частей — проще деплой, бэкап, обновление и
онбординг нового разработчика.

Принцип, который этот проект демонстрирует как эталон: defer-complexity-until-justified.
Переход на PocketBase в Phase 2 — это 1–2 дня работы (миграционный скрипт
`MDX → PocketBase records` + замена `loaders.ts`), не архитектурный переворот.

**Trigger-условия для активации Phase 2 (PocketBase)** — активируется при наступлении
**любого** из:

1. Появляется второй редактор на стороне фабрики, не умеющий работать с git.
2. Контент начинает обновляться чаще одного раза в неделю.
3. Нужен инбокс/CRM для заявок со статусами и историей коммуникации.
4. Появляется sync с маркетплейсами (Wildberries / 21vek / Onliner) — нужен единый
   API-источник.
5. Появляется онлайн-заказ кроваток с конфигуратором и оплатой.
6. Появляется личный кабинет / регистрация / роли.

При наступлении триггера: фиксируем в session log, открываем `ADR-NNN — PocketBase
Activation Phase 2`, запускаем имплементацию.

## Последствия

**Что делаем в Phase 1:**

- Создаём папку `content/` в корне репо:
  - `content/products/<category>/<sku>.mdx` — товары (фронтматтер по Zod-схеме + текст
    описания).
  - `content/projects/<slug>.mdx` — кейсы портфолио госзаказа.
  - `content/categories.ts` — таксономия (chairs, cabinets, cribs, projects).
  - `content/schema.ts` — Zod-схемы товара / проекта / категории.
  - `content/loaders.ts` — серверные функции `getProducts()`, `getProductBySku()`,
    `getProjects()` — читают MDX, валидируют Zod.
- Все страницы каталога — SSG с генерацией маршрутов из MDX (`generateStaticParams`).
- Заявки → API route `/api/lead` → Telegram-бот (sendMessage) + email через Resend
  параллельно с `Promise.allSettled` (паттерн comforthotel ADR-014).
- Никаких БД-сервисов в Docker Compose — только Next.js + nginx (см. ADR-006 Hosting).
- Бэкап контента = git (репо + origin).

**Что НЕ делаем в Phase 1:**

- Не поднимаем PocketBase / другую БД.
- Не строим Admin UI.
- Не реализуем регистрацию / личный кабинет / роли.
- Не делаем live-превью контента без билда (dev-сервер Next.js достаточен на этапе
  авторства).

**Обратимость: лёгкая.**

Переход на PocketBase в Phase 2 — миграционный скрипт `MDX → PocketBase records` за
1–2 дня + замена `content/loaders.ts` на JS SDK PocketBase. Frontend от выбора
data-source отвязан через единый интерфейс loader-ов; адаптер изолируется в
`packages/data-source/` (или аналоге).

**Кто затронут:**

- Разработка — пишет Zod-схемы и loader-ы вместо PocketBase migrations + клиента;
  проще на Phase 1, чуть больше работы при переходе в Phase 2.
- Контент — на старте мы пишем MDX; редактор на стороне фабрики не подключается до
  наступления Phase 2-триггера.
- DevOps — упрощается: только Next.js-контейнер, без стейтфул-сервиса БД.

## Имплементация

Не начата. Зависит от ADR-002 (Next.js 15) и ADR-006 (Hosting).

Следующие шаги при старте Phase 1:

1. Создать `content/schema.ts` с Zod-схемами ProductFrontmatter, ProjectFrontmatter.
2. Создать `content/loaders.ts` с `getProducts()`, `getProductBySku()`, `getProjects()`.
3. Наполнить `content/products/` MDX-файлами по трём направлениям (~30 SKU).
4. Наполнить `content/projects/` кейсами портфолио.
5. Подключить loader-ы в App Router (server components, `generateStaticParams`).

## Связанные

- [[ADR-001 PocketBase as Backend]] — superseded этим ADR (PocketBase предложен, не
  имплементирован; отложен в Phase 2 по trigger-условиям).
- [[ADR-002 Next.js 15 as Frontend]] — фронтенд-стек; SSG в нём опирается на loader-ы
  из `content/`.
- [[ADR-003 Brand Architecture One Site Two Brands]] — контент структурируется по двум
  брендам через таксономию в `content/categories.ts`.
- [[ADR-004 SCSS Modules as Style Layer]] — стилевой слой не зависит от data-source.
- ADR-006 (планируется) — Hosting (Docker VPS); упрощается, т.к. нет БД-сервиса.
- comforthotel ADR-014 — донор паттерна `/api/lead` (Telegram + Resend).
- [[Dashboard]] — общий статус проекта.
