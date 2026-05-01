---
title: Tilda reference — что мы наследуем со старого сайта
description: Полный анализ визуала текущего сайта istokmebel.by (Tilda export) — палитра, типографика, IA, паттерны. Источник правды для дизайн-системы нового сайта.
order: 1
date: 2026-05-01
tags: [design-system, brand, tilda, reference]
---

# Tilda reference

> **TL;DR.** Старый Tilda-сайт — почти монохромная (white/dark-grey/black) база с
> единственным брендовым акцентом `#FF8562` (коралл/лосось), который
> используется для **всех гиперссылок и CTA**. Шрифты — Montserrat (доминант) +
> Comfortaa (акцент). Layouts вручную в Tilda Zero Block — компонентов нет,
> верстаем заново. Информационная архитектура с 7 разделами годится «как есть»
> с уточнениями.

## Источник

- Полный экспорт сайта `istokmebel.by` в `tilda-old/istokmebel/` (см.
  [[../20 - Audit/Tilda export inventory]]).
- 50 HTML страниц, 60 CSS файлов, 76 JS, 151 МБ images, 11 МБ files.
- Анализ через grep + python: `tilda-old/istokmebel/css/*.css`,
  `tilda-old/istokmebel/page*.html`.

## Палитра (фактическая, из CSS)

Сканирование всех 60 CSS-файлов даёт 25 уникальных hex-цветов. Реально
смысловыми из них — пять:

| Hex | Использований | Семантика | В нашу DS |
| --- | --- | --- | --- |
| `#FFFFFF` | 243 | Базовый фон | `--color-bg-primary` |
| `#F8F8F8` | 34 | Чередующиеся секции | `--color-bg-section` |
| `#292929` | 230 | Основной текст, заголовки | `--color-text-primary` |
| `#000000` | 258 | Контрастные элементы (часто на белом) | `--color-text-strong` |
| `#777777` | 41 | Тонкий вспомогательный текст | `--color-text-muted` |
| `#BDBDBD` | 33 | Тонкие границы | `--color-line` |
| `#DDDDDD` | 44 | Разделители | `--color-line-soft` |
| **`#FF8562`** | **92** | **Главный акцент: ВСЕ гиперссылки + CTA** | **`--color-accent`** |

### Подтверждение акцента

В CSS селекторе `#allrecords a, .t-records a` — `color:#ff8562; text-decoration:none`.
То есть `#FF8562` — это **дефолтный цвет всех ссылок** на сайте. Это и есть
главный брендовый акцент компании.

### Игнорируем (системные, не наши)

- `#FA876B` (46x) — Tilda admin UI badge (`.t396__ui`), скрыт на проде. Шум.
- `#0088CC` / `#7DC3FE` — цвета Telegram-кнопок мессенджера (виджет связи).
- `#2015FF` / `#62C584` — системные цвета редактора Tilda.

## Типографика (фактическая)

| Шрифт | Использований | Где |
| --- | --- | --- |
| Montserrat | 185 | Основной — UI, body, заголовки |
| Comfortaa | 40 | Акцентные подписи, специальные блоки |
| Arial | 34 | Fallback (не загружаем сами) |
| Roboto | 2 | Случайно (от копипаста?), игнорируем |

Подключение в HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Comfortaa:wght@300;400;500;600;700&subset=latin,cyrillic" rel="stylesheet">
```

Поддерживается `cyrillic`. В нашем стеке — `next/font/google`:

```ts
import { Montserrat, Comfortaa } from "next/font/google";
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin","cyrillic"], display: "swap" });
const comfortaa = Comfortaa({ variable: "--font-comfortaa", subsets: ["latin","cyrillic"], display: "swap" });
```

> Сейчас в `web/src/app/layout.tsx` подключён Manrope (placeholder). При
> финализации DS заменяем на Montserrat + Comfortaa, чтобы сохранить
> узнаваемость для существующей аудитории.

## Layouts: Tilda Zero Block

Доминант блок-типа — `T396` (Zero Block / artboard) — 285 deklaration. Это
кастомные «painter» макеты, нарисованные в визуальном редакторе Tilda.
**Компонентного кода нет** — каждая страница это набор абсолютно
позиционированных элементов на координатной сетке.

Остальные блоки:
- `T131` (70x) — текст/info/featured
- `T1093` (46x) — галерея
- `T898` (45x) — формы
- `T760` / `T734` — дополнительные текстовые
- `T702` (10x) — feature-блоки
- `T113`, `T668`, `T1025`, `T552` — единичные

**Импликация для нас:** реверсить «как компоненты» нечего. Из Tilda забираем
только палитру + шрифты + примерное настроение. Layouts на новом сайте делаем
заново — на FSD-lite + container queries (см. ADR-004).

## Информационная архитектура

7 разделов в навигации (по `htaccess`):

| Старый URL | Новый URL | Заголовок |
| --- | --- | --- |
| `/` | `/` | Главная |
| `/chairs` | `/kresla` | Театральные кресла |
| `/office-catalog` | `/korpusnaya` | Корпусная мебель (хаб) |
| `/komody`, `/stoly`, `/stelazy`, `/shkafy` | те же (с фиксом `stelazhi`) | Подкатегории корпусной |
| `/child-beds` | `/krovatki` | Детские кроватки ELIS |
| `/galery2` | `/portfolio` | Галерея работ |
| `/uslugi2` | `/uslugi` | Услуги |
| `/goszakaz2` | `/goszakaz` | Для госзаказов |

См. [[../40 - Architecture/Карта URL]] для полного маппинга + 301-редиректов.

**Что меняем:**
- Slug-и в русский транслит (`/chairs` → `/kresla`, `/child-beds` → `/krovatki`).
- Опечатка `/stelazy` → `/stelazhi`.
- Двойные точки входа (`/about` дублирует главную) убираем.

## Метаданные сайта

- **Yandex Verification token:** `708ff1a7f9fdbfe1` — наследуем для быстрой
  ре-верификации в Search Console.
- **Tilda project-id:** `8464080`, page-alias structure `<category>/<slug>`.
- **Lang attribute:** `RU` (вся аудитория русскоязычная).
- **Country:** `BY` (Беларусь).
- **Аналитика:** **отсутствует**. Ни Метрики, ни GA4, ни пикселей. Это критическое
  слепое пятно — закрываем на новом сайте сразу.

## Контактная инфраструктура (с Tilda)

Виджеты связи на главной:
- WhatsApp, Viber, Telegram, обычный звонок, Mail.
- Иконки Tilda-дефолтные (`.t-popup__btn-svg`).
- Цвет иконок чёрный (`#000`), фон-кнопок белый.

Контакты со страниц:
- Телефоны: `+375 44 594-70-46`, `+375 29 587-34-40`
- Email: `istok-mebel@mail.ru`
- IG: `@istok_etg`
- Адреса: Минск (Краснозвёздная 18Б, офис), Березино (Зелёная 31, производство)

## Что переносим в новый сайт

| Элемент | Действие |
| --- | --- |
| Палитра (`#FF8562` accent + grayscale) | ✅ Базовые токены `--color-*` |
| Montserrat + Comfortaa | ✅ Через `next/font/google` |
| Yandex Verification token | ✅ Сохраняем в `<head>` |
| 7-секционная навигация | ✅ С уточнениями slug-ов |
| Стилистика товарных фото | ✅ Используем как референс |
| Контакты | ✅ Один в один |
| Tilda Zero Block layouts | ❌ Не переносим, верстаем заново |
| 60 CSS файлов Tilda | ❌ Не переносим |
| 76 JS файлов Tilda | ❌ Не переносим |
| Tilda widgets (мессенджеры) | ❌ Свои реализации, минимальный JS |
| Tilda forms | ❌ react-hook-form + zod (см. ADR-005) |

## Что добавляем сверху

- **Аналитика:** Яндекс.Метрика + GA4 + пиксели (Meta + ВК если будут).
- **Schema.org:** `Organization`, `LocalBusiness` (Минск + Березино),
  `Product` per товар, `BreadcrumbList`.
- **OG images** автогенерируемые (`opengraph-image.tsx`).
- **Sitemap + robots** — Next.js конвенции.
- **Тематический подраздел `/krovatki`** — своя визуальная тема (см. [[ADR-003]]).
- **Блок «О компании»** с историей (нет на Tilda).
- **«Госзаказы» лендинг** — серьёзнее текущего, для тендерных специалистов.

## Открытые вопросы

1. **Финал шрифтов:** Montserrat + Comfortaa (как сейчас) или сменить на что-то
   более «мебельное» (например, добавить serif-акцент)? — обсуждаем с дизайнером.
2. **Тон акцента `#FF8562`:** оставить точно тот же hex или подстроить под более
   контрастный (для AA-accessibility на белом)? Текущий контраст-ratio коралла на
   белом ≈ 3.0 — на грани, надо проверить для размеров текста.
3. **Темизация:** только light, или сразу закладываем dark theme? (для B2B-сайта
   мебельной фабрики dark вряд ли в приоритете — отложить).

## Связанные

- [[Component Inventory]] — реестр компонентов под имплементацию.
- [[../65 - Brand/istok/Visual language]] — бренд Истока (синхронизируется
  по этому документу).
- [[../65 - Brand/elis/Visual language]] — суббренд ELIS (отдельная палитра).
- [[../40 - Architecture/42 - ADR/ADR-004 SCSS Modules as Style Layer]]
- [[../40 - Architecture/Карта URL]]
- [[../20 - Audit/Tilda export inventory]]
- `tilda-old/istokmebel/css/` — источник CSS-сканирования.
