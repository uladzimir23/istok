---
title: ADR-002 — Next.js 15 as Frontend
description: Выбираем Next.js 15 (App Router, TypeScript strict) как фреймворк фронтенда для istokmebel.by — единственного сайта фабрики, включая раздел ELIS-MEBEL.
order: 2
status: proposed
date: 2026-05-01
---

# ADR-002 — Next.js 15 as Frontend

## Контекст

В ADR-001 принято решение по PocketBase как backend. Следующая развилка — фронтенд-фреймворк.

Сайт корпоративный и контентный: главная, категорийные лендинги, карточки товаров (~30 SKU,
горизонт роста до ~200), портфолио госзаказа, раздел ELIS-MEBEL внутри istokmebel.by,
страницы услуг и контактов. Основная аудитория — мобильная, рынки BY/RU.

Ключевые требования к стеку:

- **SEO** — schema.org `Product`, `Organization`, `LocalBusiness`, hreflang ru/be (потенциально),
  автогенерируемый sitemap, OG-картинки, Core Web Vitals на мобиле.
- **Рендеринг** — статичные карточки + ISR при правке через PocketBase admin.
- **Data-fetching** — PocketBase JS SDK с серверной стороны (server components / route handlers),
  чтобы не светить API-ключи на клиенте.
- **Формы** — заявки, запрос КП, заказ кроватки; валидация через `react-hook-form + zod`.
- **Аналитика** — Яндекс.Метрика (обязательно), GA4, пиксели соцсетей.
- **Локализация** — не нужна сейчас, но архитектурно не блокировать.
- **Опыт команды** — переиспользование паттернов из reference-проектов `comforthotel`,
  `flex-glass`, `moreminsk`.

## Варианты

### A. Next.js 15 (App Router, TypeScript strict)

- Плюсы: знакомый стек из `comforthotel` (Next.js 16 + FSD-lite + SCSS modules),
  `flex-glass` (Next.js 14 + PocketBase — готовые паттерны data-fetching), `moreminsk`
  (fundament + SCSS modules + booking wizard). App Router server components = чистое
  разделение «сервер тянет данные из PocketBase / клиент — только интерактив». ISR +
  `revalidateTag` от PocketBase webhook (см. ADR-001). `next/image` критичен для каталога
  мебели с большим числом фото. Встроенные `app/sitemap.ts`, `app/robots.ts`,
  `app/opengraph-image.tsx`. TypeScript strict — стандарт для проекта-эталона.
- Минусы: App Router продолжает развиваться (изменения от мажора к мажору), bundle
  чуть больше Astro для чисто статичных страниц, требует Node-runtime в Docker.

### B. Astro 5

- Плюсы: Islands Architecture даёт меньший JS-бандл по умолчанию, отличная скорость SSG
  для контентных сайтов с минимумом интерактива.
- Минусы: нет готового fundament-а ни в одном из reference-проектов. Формы заявки и
  конфигуратор размеров кроватки требуют отдельных «островов» — менее удобно, чем единая
  React-компонентная модель Next.js. Меньшая экосистема адаптеров под PocketBase.

### C. SvelteKit

- Плюсы: компактный bundle, удобная реактивность, хорошая SSR.
- Минусы: в reference-проектах пользователя нет ни одного Svelte-проекта — нулевой перенос
  опыта, скиллов, fundament-а. Изучение с нуля без выигрыша перед Next.js.

### D. Vite + React (SPA)

- Плюсы: простой dev-сервер, минимум магии.
- Минусы: SPA без SSR — антипаттерн для SEO-критичного контентного сайта (плохая
  индексация, плохие Core Web Vitals). Проверено в `neuro-center` — для лендингов хуже
  Next.js.

## Решение

Выбираем **A. Next.js 15 (App Router, TypeScript strict)**.

Выбор определяется прежде всего накопленным опытом: `comforthotel` (самый зрелый SDD-проект),
`flex-glass` (донор PocketBase-паттернов), `moreminsk` (fundament под текущий проект) — все
работают на Next.js. Это означает готовые переиспользуемые паттерны FSD-lite, SCSS modules,
скиллы `scss-modules.md` / `seo.md` / `nextjs-static-export.md`, а значит выигрыш в скорости
старта без компромисса в качестве.

App Router с server components чисто маппится на архитектуру «PocketBase → server component →
HTML для пользователя, клиент получает только интерактивные острова». ISR + `revalidateTag`
от PocketBase webhook закрывает требование «редактор правит товар в админке → витрина
обновляется без редеплоя» (см. ADR-001). `next/image`, встроенные OG-маршруты и
`app/sitemap.ts` закрывают SEO- и performance-требования без сторонних зависимостей.

## Последствия

**Что делаем:**

- Корень кода — `apps/web/` (или `web/` в случае плоской структуры без монорепо — решит
  отдельный ADR).
- Структура слоёв — FSD-lite: `app → widgets → features → entities → shared`. Импорты строго
  сверху вниз, кросс-слойные импорты запрещены eslint-правилом.
- Стили — SCSS modules + cascade layers + token-система CSS custom properties. Детали — ADR-004.
- Формы — `react-hook-form + zod`, отправка через API route handlers на серверной стороне
  (POST в PocketBase `leads` collection + email-нотификация).
- SEO — `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`; JSON-LD
  `Product / Organization / LocalBusiness` через утилиту `shared/seo/jsonld.ts`.
- Шрифты — `next/font/google` для предотвращения FOUC и оптимизации CLS.
- Аналитика — `<Script strategy="afterInteractive">` для Яндекс.Метрики и GA4 в
  `app/layout.tsx`; события через `dataLayer.push(...)`.
- Деплой — Node-сервер в Docker (детали — ADR-005).
- Fundament — переносим и адаптируем паттерны из `~/Documents/moreminsk/` и
  `~/Documents/comforthotel/`.

**Что НЕ делаем:**

- Не используем Pages Router (legacy, конфликтует с App Router).
- Не делаем SPA-режим (только SSR / SSG / ISR).
- Не включаем Turbopack в production-сборке до его стабилизации (в dev — допустимо).
- Не тянем данные из PocketBase на клиенте напрямую (все запросы — через server components
  или route handlers, чтобы не светить креды и не дублировать fetch).

**Обратимость: средняя.**

Уход с Next.js на Astro или SvelteKit потребует переписать все компоненты и перестроить
SEO-инфраструктуру — болезненно. При этом Next.js является индустриальным стандартом,
мотивации для смены нет. Если возникнет необходимость — единый адаптер `packages/data-source/`
(см. ADR-001) снизит стоимость переключения data-layer, но UI-слой всё равно переписывается.

**Кто затронут:**

- Разработка — переиспользуем паттерны FSD-lite / SCSS modules из `comforthotel` и `moreminsk`.
- DevOps — Node-runtime в Docker (детали в ADR-005); сборка `next build` как шаг CI.
- Контент-команда фабрики — никак; контент в PocketBase-админке, выбор фронтенд-фреймворка
  прозрачен для редакторов.

## Имплементация

Не начата. Следующие шаги после принятия ADR-004 (стили) и ADR-005 (хостинг):

1. Инициализировать `apps/web/` — `npx create-next-app@15 --typescript --app --src-dir=false`.
2. Настроить `tsconfig.json` с `"strict": true`, path aliases (`@/entities`, `@/shared` и т.д.).
3. Перенести fundament из `~/Documents/moreminsk/` (layout, SCSS-токены, базовые компоненты).
4. Подключить PocketBase JS SDK: `shared/lib/pb.ts` (серверный клиент, singleton).
5. Настроить `next.config.ts`: `images.domains`, `headers` (CSP), `env` (из `.env.local`).

## Связанные

- [[ADR-001 PocketBase as Backend]] — backend, от которого зависит data-fetching Next.js.
- ADR-003 (планируется) — Бренд-архитектура: как Исток + ELIS-MEBEL живут в одной навигации.
- ADR-004 (планируется) — SCSS modules как стилевой слой (по паттерну moreminsk/comforthotel).
- ADR-005 (планируется) — Хостинг: Docker на VPS vs managed (определяет Node-runtime окружение).
- [[CLAUDE.md]] — секция Tech Stack (Frontend = Next.js 15, пометка «ADR pending» снимается).
- [[Dashboard]] — общий статус проекта.
- Reference: `~/Documents/comforthotel/` (Next.js 16, FSD-lite, самый зрелый проект),
  `~/Documents/flex-glass/` (Next.js 14 + PocketBase паттерны),
  `~/Documents/moreminsk/` (fundament для текущего проекта).
