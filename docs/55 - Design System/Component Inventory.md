---
title: Component Inventory — реестр компонентов
description: Полный список UI-компонентов сайта istokmebel.by с разбивкой по FSD-слоям. Источник для планирования имплементации DS.
order: 2
date: 2026-05-01
status: draft
tags: [design-system, components, fsd]
---

# Component Inventory

> **Что это.** Список всего UI, который потребуется для нового сайта. Делим
> по слоям FSD-lite (`app → widgets → features → entities → shared`). Источник
> для планирования спринтов имплементации DS и для оценки покрытия.

## Принцип

- **shared** — примитивы (кнопка, инпут, типографика).
- **entities** — бизнес-сущности (карточка товара, карточка проекта).
- **features** — интерактивные блоки (форма заявки, переключатель темы).
- **widgets** — крупные секции страницы (Hero, ProductGrid, Footer).
- **app** — layouts и шаблоны страниц.

## shared/ — примитивы

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `Button` (primary / secondary / ghost) | планируется | Цвет accent — `#FF8562` |
| `Input` (text / email / phone / textarea) | планируется | + `react-hook-form` integration |
| `Heading` (h1–h4 типография) | планируется | Montserrat scale |
| `Container` / `Stack` / `Cluster` (layout primitives) | планируется | Из паттерна comforthotel |
| `Link` | планируется | Цвет `#FF8562`, hover state |
| `Icon` (lucide-react или собственный SVG-набор) | TBD | Решить TBD |
| `Image` (обёртка над `next/image`) | планируется | LQIP, alt validation |
| `Logo` (Истоковский SVG) | планируется | Адаптация под dark/light |

## entities/ — бизнес-сущности

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `ProductCard` | планируется | Hero-фото + name + summary + CTA |
| `ProductCardCompact` (для каталог-листингов) | планируется | Меньше фото-шум |
| `ProjectCard` (портфолио госзаказа) | планируется | Объект + место + год + delivered |
| `CategoryCard` (хабы /kresla, /komody, …) | планируется | Большое фото + название + count |
| `ContactCard` (один телефон/email/мессенджер) | планируется | С иконкой |

## features/ — интерактив

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `LeadForm` (заявка → /api/lead → Telegram + email) | планируется | Паттерн comforthotel ADR-014 |
| `RequestKpForm` (запрос КП — для B2B/госзаказа) | планируется | С полями реквизитов |
| `MessengerCallout` (быстрый контакт через WhatsApp/Telegram/Viber) | планируется | Floating button |
| `Gallery` / `Lightbox` | планируется | Для товарных фото |
| `LocaleSwitcher` | отложено | Phase 1 — только русский |
| `ThemeToggle` (light/dark) | отложено | Решаем по бизнес-приоритету |

## widgets/ — секции страниц

| Компонент | Статус | Используется на |
| --- | --- | --- |
| `Header` (top-nav, мессенджеры, лого) | планируется | Все страницы |
| `Footer` (контакты, адреса, юр-данные) | планируется | Все страницы |
| `Hero` (главная — заголовок, ключевые направления, CTA) | планируется | `/` |
| `DirectionsBlock` (3 направления карточками) | планируется | `/` |
| `ProductGrid` (каталог категории) | планируется | `/kresla`, `/komody`, … |
| `ProductDetail` (карточка модели целиком) | планируется | `/kresla/[slug]`, … |
| `PortfolioGrid` (галерея проектов госзаказа) | планируется | `/portfolio` |
| `ServicesList` (доставка/сборка/гарантия) | планируется | `/uslugi` |
| `GoszakazLanding` (отдельный лендинг для тендерных специалистов) | планируется | `/goszakaz` |
| `ContactsBlock` (адреса, телефоны, мессенджеры, карта) | планируется | `/contacts`, footer |
| `AboutSection` (история компании, производство) | планируется | `/about` |

## app/ — layouts и templates

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `RootLayout` | базовая версия в repo | `<html lang="ru">`, шрифты, метаданные |
| `KrovatkiLayout` (с `.theme-elis` cascade-layer) | планируется | См. ADR-003 |
| `error.tsx` / `not-found.tsx` / `global-error.tsx` | планируется | UX для ошибок |
| `loading.tsx` (на медленных переходах) | планируется | Skeletons |

## SEO / системное

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `app/sitemap.ts` (генерация из MDX) | планируется | Все товары + проекты + статика |
| `app/robots.ts` | планируется | + ссылка на sitemap |
| `app/opengraph-image.tsx` (per-route OG) | планируется | Edge runtime, бренд-шаблон |
| `JsonLd` компонент (Product / Organization / LocalBusiness / Breadcrumb) | планируется | `shared/seo/` |

## Аналитика

| Компонент | Статус | Заметки |
| --- | --- | --- |
| `<YandexMetrika>` | планируется | Через `<Script>` в `app/layout.tsx` |
| `<GoogleAnalytics>` | планируется | Через `<Script>` |
| Pixel (Meta / ВК) | планируется | По требованию маркетинга |
| `dataLayer` events на ключевые действия | планируется | View product, submit form, click CTA |

## Открытые вопросы

- **Иконография** — lucide-react (популярный, быстрый) или собственный SVG-набор (бренд-консистентность)? Решить до старта shared/.
- **Photo style** — фото товаров (текущие с Tilda) + интерьеры (для каталог-хабов) — нужен ли единый фото-фильтр для согласованности?
- **Печатные элементы** — дублируем ли PDF-каталог через сайт (auto-generate PDF из тех же MDX)? Phase 2 отдельным ADR.

## Связанные

- [[Tilda reference]] — палитра, типографика, IA.
- [[Inspiration & Mood]] — сторонние референсы.
- [[../65 - Brand/istok/Visual language]] / [[../65 - Brand/elis/Visual language]]
- [[../40 - Architecture/42 - ADR/ADR-002 Next.js 15 as Frontend]]
- [[../40 - Architecture/42 - ADR/ADR-004 SCSS Modules as Style Layer]]
