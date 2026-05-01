---
title: ADR-004 — SCSS Modules as Style Layer
description: Выбираем SCSS modules + cascade layers + token-систему CSS custom properties как стилевой слой фронтенда — по паттерну moreminsk/comforthotel.
order: 4
status: proposed
date: 2026-05-01
---

# ADR-004 — SCSS Modules as Style Layer

## Контекст

В ADR-002 принят Next.js 15 (App Router, TypeScript strict). Стилевой слой оставлен
открытым — в ADR-002 секция Последствия фиксирует «SCSS modules + cascade layers +
token-система, детали — ADR-004».

Выбор стилевого подхода влияет на:

- Структуру каждого компонента (`Foo.tsx` + `Foo.module.scss` vs utility-классы).
- Реализацию двухтемной системы — бренд «Исток-мебель» и суббренд ELIS-MEBEL Kids Beds,
  живущих в одном сайте (см. ADR-003).
- Переиспользование fundament-а из reference-проектов `moreminsk` и `comforthotel`.
- Скорость старта: есть ли готовый скилл и паттерны — или пишем заново.

Сайт контентный, не SaaS-приложение: ~30 SKU каталог, портфолио госзаказа, раздел ELIS,
лендинги услуг, контакты. Основная аудитория — мобильная, рынки BY/RU. Производительность
мобильного рендера и предсказуемость каскада критичны.

## Варианты

### A. Tailwind CSS + shadcn/ui

- Плюсы: быстрый старт, готовая компонентная библиотека shadcn/ui, большая экосистема,
  меньше boilerplate на простых компонентах.
- Минусы: utility-классы в JSX ухудшают читаемость в компонентах с тонкой стилистикой
  (мебельные карточки с галереями, hover-состояниями, акцентами по бренду). Тематические
  подразделы (ADR-003: Исток vs ELIS) реализуются через CSS variables — работает, но
  требует отдельной конфигурации темы Tailwind. Нет готового fundament-а или скилла
  в reference-проектах — паттерны `moreminsk`/`comforthotel` переносить нельзя.

### B. SCSS modules + cascade layers + token-система (по паттерну moreminsk)

- Плюсы: чистое разделение `Foo.tsx` + `Foo.module.scss` — компонентный scope без
  коллизий. Cascade layers `tokens → base → recipes → components → utilities` дают
  контролируемую специфичность и предсказуемый каскад. Тематические подразделы
  реализуются через переопределение CSS-переменных в layer `theme.brand-elis` на
  корневом layout-е раздела `/elis`. Готовый скилл `scss-modules.md` в
  `comforthotel/.claude/skills/`, fundament в `moreminsk/src/shared/styles/` — копируем,
  не пишем заново. Единый язык дизайна с `comforthotel` облегчает кросс-проектное ревью.
- Минусы: больше boilerplate чем Tailwind на простых компонентах, требует дисциплины
  в именовании классов (БЭМ-lite) и работе с токенами.

### C. CSS-in-JS (styled-components / emotion / vanilla-extract)

- Плюсы: динамические стили на уровне JS, типобезопасность токенов (vanilla-extract).
- Минусы: runtime-overhead у styled-components/emotion; в Next.js App Router при SSR
  всё ещё требует дополнительной настройки (Registry-паттерн). Нет переносимого опыта
  на этом стеке ни в одном из reference-проектов.

### D. UnoCSS

- Плюсы: меньший бандл, атомарный CSS, гибкая конфигурация.
- Минусы: utility-first — те же проблемы читаемости, что у Tailwind. Нет fundament-а
  или скиллов у пользователя; изучение паттернов с нуля.

## Решение

Выбираем **B. SCSS modules + cascade layers + token-систему** по паттерну moreminsk.

Определяющий фактор — полная переносимость накопленного опыта. `moreminsk` содержит
проверенный fundament (`_tokens.scss`, `_mixins.scss`, `_base.scss`, `index.scss` с
порядком layer-ов); `comforthotel` — свежий application-проект на этом же подходе плюс
отработанный скилл `scss-modules.md`. Переносим fundament и скилл в `istok` без
переизобретения.

Ключевое преимущество для этого проекта — двухтемная система. Cascade layer
`theme.brand-elis` переопределяет CSS-переменные палитры и типографики на уровне
корневого layout-а раздела `/elis`, не трогая компоненты. Компонент `ProductCard`
работает в обеих темах без изменений — он читает токены, не хардкодит цвета. Это
точно отвечает требованию ADR-003: Исток и ELIS живут в одном сайте с разной визуальной
идентичностью, без дублирования компонентной базы.

## Последствия

**Что делаем:**

- Каждый компонент `Foo.tsx` сопровождается `Foo.module.scss`. Инлайн-стили и
  глобальные классы вне layer-системы — запрещены.
- Глобальные стили в `apps/web/src/shared/styles/`:
  - `_tokens.scss` — CSS custom properties: палитра, типографика, spacing, radius,
    shadow, motion. Переопределения для темы ELIS — в том же файле под селектором
    `.theme-elis` или в layer `theme.brand-elis`.
  - `_mixins.scss` — `@mixin` для типографики, медиа-запросов, состояний.
  - `_base.scss` — reset/normalize, базовые `<html>/<body>`, подключение шрифтов.
  - `index.scss` — декларирует порядок cascade layers:
    `tokens → base → recipes → components → utilities`.
- Тема ELIS: layout `/elis/layout.tsx` добавляет класс `.theme-elis` на `<html>` или
  `<body>`, в `_tokens.scss` — переопределения всех брендовых переменных под этим
  классом.
- Шрифты — `next/font/google`, имена экспонируются как CSS custom properties
  (`--font-heading`, `--font-body`) для использования в `_tokens.scss`.
- Stylelint + ESLint в pre-commit (lefthook): проверка именования классов (БЭМ-lite),
  порядка layer-ов, запрет `!important` вне layer `utilities`.
- Скилл `scss-modules.md` адаптируется из `~/Documents/comforthotel/.claude/skills/`
  и размещается в `istok/.claude/skills/scss-modules.md`.
- Fundament переносится из `~/Documents/moreminsk/src/shared/styles/` как стартовая
  точка `apps/web/src/shared/styles/`.

**Что НЕ делаем:**

- Не подключаем Tailwind, shadcn/ui, UnoCSS.
- Не используем CSS-in-JS.
- Не пишем глобальные классы вне layer-системы (всё, что не токены и база — в
  `.module.scss`).
- Не хардкодим цвета и размеры в компонентах — только через токены.

**Обратимость: средняя.**

Переход с SCSS modules на Tailwind потребует переписать стили всех компонентов
(заменить `.module.scss` на utility-классы в JSX) — долго при росте кодобазы, но
механически выполнимо. Token-система (`_tokens.scss` → CSS custom properties) переносима
между любыми подходами. Reverse не требует изменений в PocketBase или SEO-слое.

**Кто затронут:**

- Разработка — изучение паттернов cascade layers и token-naming по скиллу
  `scss-modules.md`; готовый fundament снижает порог входа.
- Дизайн — два бренд-гайда (Исток / ELIS) переводятся в один `_tokens.scss` с
  именованными переменными и переопределениями для темы. Источник правды по токенам —
  `docs/65 - Brand/`.
- Контент-команда фабрики — не затронута; стилевой слой прозрачен для редакторов
  PocketBase-админки.

## Имплементация

Не начата. Зависит от ADR-002 (Next.js 15) и ADR-003 (структура разделов Исток/ELIS).

Первые шаги после принятия:

1. Перенести скилл `scss-modules.md` из `comforthotel` → `istok/.claude/skills/`.
2. Скопировать fundament из `moreminsk/src/shared/styles/` → `apps/web/src/shared/styles/`.
3. Адаптировать `_tokens.scss`: добавить переменные для темы ELIS под `.theme-elis`.
4. Настроить Stylelint + lefthook pre-commit для проверки именования и layer-ов.

## Связанные

- [[ADR-001 PocketBase as Backend]] — backend, источник данных для компонентов.
- [[ADR-002 Next.js 15 as Frontend]] — фреймворк, в котором живут SCSS modules.
- ADR-003 (планируется) — Бренд-архитектура: два бренда в одном сайте; тема ELIS
  реализуется через cascade layer `theme.brand-elis`.
- [[Dashboard]] — общий статус проекта.
- [[CLAUDE.md]] — секция Tech Stack (пометка «Стили — развилка, ADR pending» снимается).
- `docs/65 - Brand/` — источник правды по токенам палитры и типографики.
- Reference: `~/Documents/moreminsk/src/shared/styles/` (fundament),
  `~/Documents/comforthotel/.claude/skills/scss-modules.md` (скилл).
