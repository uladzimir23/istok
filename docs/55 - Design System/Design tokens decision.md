---
title: Design tokens decision — финальные значения токенов
description: Резолюция значений токенов перед стартом имплементации web/src/shared/design-system/. Превращается в ADR при принятии.
order: 4
date: 2026-05-01
status: draft
tags: [design-system, tokens, decision]
---

# Design tokens decision

> **Статус: draft.** Финализируется по итогам обсуждений в [[Tilda reference]]
> и [[Inspiration & Mood]]. После accept — превращается в ADR-NNN или
> updates ADR-004.

## Решения, готовые к accept

### Палитра — Истоковский (B2B / корпусная / кресла)

```scss
:root {
  /* База */
  --color-bg-primary: #FFFFFF;
  --color-bg-section: #F8F8F8;

  /* Текст */
  --color-text-primary: #292929;
  --color-text-strong: #000000;
  --color-text-muted: #777777;

  /* Линии / разделители */
  --color-line: #BDBDBD;
  --color-line-soft: #DDDDDD;

  /* Акцент (фактический accent сайта Tilda — #FF8562 коралл/лосось) */
  --color-accent: #FF8562;
  --color-accent-hover: #FA876B;       /* TBD: проверить контраст; возможно затемним */
  --color-accent-fg: #FFFFFF;          /* текст на accent-фоне */
}
```

> Источник — пиксель-пик из 60 CSS-файлов tilda-old (см. [[Tilda reference]]).
> `#FF8562` используется как color для **всех `<a>` на сайте** = это
> официальный брендовый акцент.

### Палитра — ELIS (B2C / детские кроватки, раздел /krovatki)

```scss
.theme-elis {
  --color-bg-primary: #F1EDE0;
  --color-bg-secondary: #DBD7CC;
  --color-text-primary: #271910;
  --color-text-secondary: #5B5046;
  --color-text-muted: #877C73;
  --color-line: #C5BDB6;
  --color-accent: #5B5046;             /* у ELIS нет коралла — используем тёплый тёмный */
  --color-accent-hover: #271910;
  --color-accent-fg: #F1EDE0;
}
```

> Источник — пиксель-пик из PDF-каталога «Обновленный каталог.2.pdf» (см.
> [[../65 - Brand/elis/Visual language]]).

### Типографика

```scss
:root {
  --font-display: var(--font-montserrat, system-ui, sans-serif);
  --font-body: var(--font-montserrat, system-ui, sans-serif);
  --font-accent: var(--font-comfortaa, var(--font-montserrat));
  --font-mono: ui-monospace, "SF Mono", monospace;
}
```

Подключение через `next/font/google` (latin + cyrillic subsets, `display: "swap"`):
- **Montserrat Variable** (weights 100..900) — основной.
- **Comfortaa Variable** (weights 300..700) — акцент / декор.

> Сейчас в `web/src/app/layout.tsx` подключён Manrope (placeholder).
> Заменяем на Montserrat при имплементации DS.

## Открытые развилки (требуют решения)

### 1. Контрастность акцента

`#FF8562` на `#FFFFFF` фоне — contrast ratio ≈ **3.0:1** (на грани AA для
крупного текста, **не** проходит для body 16 px). Варианты:

| Вариант | Hex | Contrast vs white | Pro/Con |
| --- | --- | --- | --- |
| **A. Сохранить `#FF8562`** | `#FF8562` | 3.0:1 | Точная аутентичность Tilda; провал AA для small text |
| **B. Затемнить на ~10%** | `#E66B47` | 4.6:1 | Проходит AA для small text; визуально близок |
| **C. Затемнить значительно** | `#C04F2F` | 6.5:1 | Проходит AAA; визуально отличается, ближе к терракоте |

**Рекомендация:** B (`#E66B47`) — компромисс между узнаваемостью и
доступностью. Дизайнер подтверждает или предлагает свой вариант.

### 2. Шрифты

| Вариант | Сильные | Слабые |
| --- | --- | --- |
| **A. Montserrat + Comfortaa** (как Tilda) | Сохранение узнаваемости, кириллица | Comfortaa довольно «детский» — не идеален для B2B |
| **B. Только Montserrat** | Единый шрифт, чище | Теряем decoration-роль Comfortaa |
| **C. Montserrat + serif accent** (Cormorant / Playfair) | «Мебельная» классика | Отрыв от текущего сайта |

**Рекомендация:** A — следуем «сохранить узнаваемость». Comfortaa использовать
точечно (заголовки секций, hero-подписи), не для body.

### 3. Spacing шкала

Кандидат — fluid clamp() шкала (как в comforthotel):

```scss
:root {
  --space-2xs: clamp(0.25rem, 0.2rem + 0.25vi, 0.5rem);
  --space-xs:  clamp(0.5rem, 0.4rem + 0.5vi, 0.75rem);
  --space-sm:  clamp(0.75rem, 0.6rem + 0.75vi, 1rem);
  --space-md:  clamp(1rem, 0.8rem + 1vi, 1.5rem);
  --space-lg:  clamp(1.5rem, 1.2rem + 1.5vi, 2.5rem);
  --space-xl:  clamp(2rem, 1.6rem + 2vi, 4rem);
  --space-2xl: clamp(3rem, 2.4rem + 3vi, 6rem);
  --space-3xl: clamp(4rem, 3.2rem + 4vi, 8rem);
}
```

Принятие зависит от: финальной типографики (шкала размеров текста должна
коррелировать со spacing). Утверждается одновременно с шрифтами.

### 4. Радиусы / тени / motion

| Token | Кандидат |
| --- | --- |
| `--radius-sm` | `0.25rem` |
| `--radius-md` | `0.5rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-pill` | `999px` |
| `--shadow-sm` | `0 1px 2px rgba(41, 41, 41, 0.04)` |
| `--shadow-md` | `0 4px 12px rgba(41, 41, 41, 0.08)` |
| `--duration-fast` | `120ms` |
| `--duration-base` | `220ms` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |

> Тени и радиусы — рабочие значения, можно менять при имплементации.

## Когда становится ADR

Следующий ADR-NNN «Design tokens v1» после:
1. Резолюция контраст-варианта (1).
2. Подтверждение шрифт-варианта (2).
3. Spacing utвержён (3).

ADR будет коротким — основное обоснование уже здесь и в [[Tilda reference]].

## Связанные

- [[Tilda reference]] — источник палитры и шрифтов.
- [[Component Inventory]] — реестр компонентов под эти токены.
- [[../65 - Brand/istok/Visual language]] (синхронизируется по этому документу).
- [[../65 - Brand/elis/Visual language]]
- [[../40 - Architecture/42 - ADR/ADR-004 SCSS Modules as Style Layer]]
- [[../../.claude/skills/scss-modules]]
