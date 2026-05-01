---
title: Карта URL — old (Tilda) → new (Next.js)
description: Полный маппинг 47 текущих URL сайта istokmebel.by на новые slug-и + план 301-редиректов для cutover. Источник — htaccess из tilda-old/istokmebel/.
order: 5
date: 2026-05-01
---

# Карта URL — old (Tilda) → new (Next.js)

> **TL;DR.** Tilda держит 47 публичных URL, в т.ч. 6 моделей театральных кресел,
> 12 моделей корпусной мебели, 8 моделей кроваток «Элис», галерею, услуги и
> госзаказы. Решение по новым slug-ам: **сохраняем русский транслит везде, где
> Tilda уже использует русский** (`/komody`, `/stoly`, `/shkafy`, `/stelazy`),
> и **переводим английские в русский для consistency** (`/chairs` → `/kresla`,
> `/child-beds` → `/krovatki`). Все старые URL — 301-редирект через nginx.

## Что нашли в Tilda export

Полный экспорт сайта (50 HTML страниц + 151 МБ изображений + 11 МБ файлов) лежит
в `tilda-old/istokmebel/`. Источник правды по URL — `tilda-old/istokmebel/htaccess`
(содержит `RewriteRule` для каждого slug → page-NNN.html).

### Стек Tilda (из HTML)

- Шрифты: **Montserrat** (UI) + **Comfortaa** (акцент). Cyrillic + Latin.
- Yandex Verification token (нужен для cutover SEO): `708ff1a7f9fdbfe1`.
- CDN ассетов: `tildacdn.com`.

## Маппинг URL (47 шт.)

> Колонка «новый slug» — наше решение для Next.js-сайта. `→ 301` означает редирект
> со старого URL на новый. Если slug совпадает — редирект не нужен.

### Главная и общие

| Tilda URL | Page file | Новый slug | 301? |
| --- | --- | --- | --- |
| `/` | `page42975758.html` | `/` | — |
| `/about` | `page42975758.html` (тот же) | `/` (дубль) | → 301 на `/` |
| `/galery2` | `page42976345.html` | `/portfolio` | → 301 |
| `/uslugi2` | `page42976369.html` | `/uslugi` | → 301 |
| `/goszakaz2` | `page42976418.html` | `/goszakaz` | → 301 |
| `/headermobile` | `page43130966.html` | — (служебный) | — (404) |
| `/footer` | `page42992627.html` | — (служебный) | — (404) |
| `/test` | `page98475646.html` | — (тест-страница) | — (404) |

### Театральные кресла

| Tilda URL | Page file | Новый slug | 301? |
| --- | --- | --- | --- |
| `/chairs` | `page67973413.html` | `/kresla` | → 301 |
| `/chairs/model-m3-1` | `page97960296.html` | `/kresla/m3-1` | → 301 |
| `/chairs/model-m3` | `page98445556.html` | `/kresla/m3` | → 301 |
| `/chairs/model-m3-g` | `page98445566.html` | `/kresla/m3-g` | → 301 |
| `/chairs/model-m1` | `page98445636.html` | `/kresla/m1` | → 301 |
| `/chairs/model-m2` | `page98445606.html` | `/kresla/m2` | → 301 |
| `/chairs/model-pm-1` | `page98445656.html` | `/kresla/pm-1` | → 301 |

### Корпусная мебель

| Tilda URL | Page file | Новый slug | 301? |
| --- | --- | --- | --- |
| `/office-catalog` | `page92817496.html` | `/korpusnaya` | → 301 |
| `/komody` | `page97906126.html` | `/komody` | — |
| `/komody/komod-s-odnoy-dvercey-i-chetyrmya-jaschikamy` | `page97903126.html` | `/komody/s-dvercey-i-4-yaschikami` | → 301 |
| `/komody/komod-s-chetyrmya-jaschikamy` | `page98451246.html` | `/komody/s-4-yaschikami` | → 301 |
| `/stelazy` | `page98470456.html` | `/stelazhi` | → 301 (typo fix: «стеллажи» с двумя «л») |
| `/stelazy/stelaz-s-odnoy-malenkoy-dvercey` | `page98470936.html` | `/stelazhi/s-maloy-dvercey` | → 301 |
| `/stelazy/stelaz-s-bolshoy-i-malenkoy-dvercey` | `page98470926.html` | `/stelazhi/s-dvumya-dvercami` | → 301 |
| `/stelazy/stelaz-s-bolshoy-dvercey-i-dvymya-vydvizhnymi-yaschikami` | `page98470866.html` | `/stelazhi/s-dvercey-i-yaschikami` | → 301 |
| `/stoly` | `page98470466.html` | `/stoly` | — |
| `/stoly/stol-s-dvercey` | `page98472006.html` | `/stoly/s-dvercey` | → 301 |
| `/stoly/stol-s-dvercey-i-vydviznym-yaschichkom` | `page98472086.html` | `/stoly/s-dvercey-i-yaschikom` | → 301 |
| `/stoly/stol-s-tremya-vydviznymi-yaschichkami` | `page98472106.html` | `/stoly/s-3-yaschikami` | → 301 |
| `/shkafy` | `page98470486.html` | `/shkafy` | — |
| `/shkafy/shkaf-odnodverny` | `page98472866.html` | `/shkafy/odnodverny` | → 301 |
| `/shkafy/shkaf-dvuhdverny` | `page98472896.html` | `/shkafy/dvuhdverny` | → 301 |
| `/shkafy/shkaf-dvuhdverny-s-dvuma-yaschichkamy` | `page98472916.html` | `/shkafy/dvuhdverny-s-2-yaschikami` | → 301 |
| `/shkafy/shkaf-trehdverny-s-dvuma-yaschichkamy` | `page98472936.html` | `/shkafy/trehdverny-s-2-yaschikami` | → 301 |

### Детские кроватки «Элис»

| Tilda URL | Page file | Новый slug | 301? |
| --- | --- | --- | --- |
| `/child-beds` | `page96694286.html` | `/krovatki` | → 301 |
| `/child-beds/nikole` | `page98453286.html` | `/krovatki/nikol` | → 301 |
| `/child-beds/melita` | `page98456376.html` | `/krovatki/melita` | → 301 |
| `/child-beds/paulina` | `page98456386.html` | `/krovatki/paulina` | → 301 |
| `/child-beds/elsa` | `page98456496.html` | `/krovatki/elza` | → 301 |
| `/child-beds/dominika` | `page98456896.html` | `/krovatki/dominika` | → 301 |
| `/child-beds/afina` | `page98456916.html` | `/krovatki/afina` | → 301 |
| `/child-beds/yasmina` | `page98456946.html` | `/krovatki/yasmina` | → 301 |
| `/child-beds/mishele` | `page98456966.html` | `/krovatki/mishel` | → 301 |

### Legacy slug-и (старые URL кресел без префикса /chairs/)

Похоже, это исторические URL до миграции на иерархическую структуру `/chairs/*`.
Все ведут на те же модели, что и `/chairs/model-*`. На них может быть накопленный
SEO-вес и внешние ссылки.

| Tilda URL | Page file | Новый slug | 301? |
| --- | --- | --- | --- |
| `/model-pm1` | `page43266869.html` | `/kresla/pm-1` | → 301 |
| `/model-m2` | `page42976669.html` | `/kresla/m2` | → 301 |
| `/model-m1` | `page55458259.html` | `/kresla/m1` | → 301 |
| `/model-m3g` | `page43266877.html` | `/kresla/m3-g` | → 301 |
| `/model-m3` | `page43266883.html` | `/kresla/m3` | → 301 |
| `/model-m31` | `page43266885.html` | `/kresla/m3-1` | → 301 |

## Принципы решения по новым slug-ам

1. **Русский транслит везде** — лучше для BY/RU SEO (запросы «комод», «стол с ящиками»,
   «детская кроватка» русскоязычные). Tilda сама использовала русский для большей
   части корпусной мебели — только `/chairs` и `/child-beds` остались английскими.
   Унифицируем.
2. **Короче — лучше.** `komod-s-odnoy-dvercey-i-chetyrmya-jaschikamy` (60 символов) →
   `s-dvercey-i-4-yaschikami` (28). Цифры вместо «четырьмя». URL остаются читаемыми
   и компактнее в выдаче.
3. **Без префикса категории в slug-е товара.** Категория уже в пути:
   `/komody/s-4-yaschikami`, не `/komody/komod-s-4-yaschikami`.
4. **Стеллажи правим: `stelazy` → `stelazhi`.** В Tilda опечатка (одна «ж» вместо «ж»+«и»),
   на новом сайте используем правильный транслит «стеллажи» → `stelazhi`. Старый URL
   через 301.
5. **Двойные точки входа объединяем.** `/about` (= главная), `/headermobile`, `/footer`
   — служебные дубли Tilda; в Next.js не воспроизводим.
6. **Тестовая страница `/test`** — 404, не переносим.

## План имплементации редиректов

В `nginx/sites-available/istokmebel.conf`:

```nginx
# Категории — в русский транслит
location = /chairs                           { return 301 /kresla; }
location = /child-beds                       { return 301 /krovatki; }
location = /office-catalog                   { return 301 /korpusnaya; }
location = /stelazy                          { return 301 /stelazhi; }

# Кресла /chairs/model-* → /kresla/*
location = /chairs/model-m3-1                { return 301 /kresla/m3-1; }
location = /chairs/model-m3                  { return 301 /kresla/m3; }
location = /chairs/model-m3-g                { return 301 /kresla/m3-g; }
location = /chairs/model-m1                  { return 301 /kresla/m1; }
location = /chairs/model-m2                  { return 301 /kresla/m2; }
location = /chairs/model-pm-1                { return 301 /kresla/pm-1; }

# Legacy кресла без /chairs префикса
location = /model-pm1                        { return 301 /kresla/pm-1; }
location = /model-m1                         { return 301 /kresla/m1; }
location = /model-m2                         { return 301 /kresla/m2; }
location = /model-m3                         { return 301 /kresla/m3; }
location = /model-m3g                        { return 301 /kresla/m3-g; }
location = /model-m31                        { return 301 /kresla/m3-1; }

# Кроватки /child-beds/* → /krovatki/*
location = /child-beds/nikole                { return 301 /krovatki/nikol; }
location = /child-beds/melita                { return 301 /krovatki/melita; }
location = /child-beds/paulina               { return 301 /krovatki/paulina; }
location = /child-beds/elsa                  { return 301 /krovatki/elza; }
location = /child-beds/dominika              { return 301 /krovatki/dominika; }
location = /child-beds/afina                 { return 301 /krovatki/afina; }
location = /child-beds/yasmina               { return 301 /krovatki/yasmina; }
location = /child-beds/mishele               { return 301 /krovatki/mishel; }

# Корпусная мебель — детальные slug-и
location = /komody/komod-s-odnoy-dvercey-i-chetyrmya-jaschikamy
                                             { return 301 /komody/s-dvercey-i-4-yaschikami; }
location = /komody/komod-s-chetyrmya-jaschikamy
                                             { return 301 /komody/s-4-yaschikami; }
# ... и т.д. для стеллажей, столов, шкафов

# Общие страницы
location = /galery2                          { return 301 /portfolio; }
location = /uslugi2                          { return 301 /uslugi; }
location = /goszakaz2                        { return 301 /goszakaz; }
location = /about                            { return 301 /; }

# Служебные / тестовые — 404
location = /headermobile                     { return 404; }
location = /footer                           { return 404; }
location = /test                             { return 404; }
```

В Next.js — соответствие новых slug-ов реальным страницам через App Router:
`web/src/app/kresla/[slug]/page.tsx`, `web/src/app/krovatki/[slug]/page.tsx`, и т.д.

## SEO continuity при cutover

1. **Yandex Verification** — сохранить токен `708ff1a7f9fdbfe1` в `<head>` нового сайта
   (или прописать новый, но это потеря «истории» для Яндекса).
2. **Sitemap** — генерируется в Next.js через `app/sitemap.ts` со всеми **новыми**
   URL-ами, отправляется в Search Console и Yandex Webmaster в день cutover.
3. **301 редиректы** активны с момента cutover — это передаёт SEO-вес со старых
   страниц на новые.
4. **Canonical URLs** во всех страницах — указывают на новый URL (не старый).
5. **`hreflang`** — пока только русский, но архитектура готова к добавлению `be` (бел.).

## Связанные

- [[ADR-002 Next.js 15 as Frontend]] — App Router structure для маппинга slug-ов.
- [[ADR-003 Brand Architecture One Site Two Brands]] — раздел `/krovatki` для ELIS.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — slug-и хранятся в frontmatter MDX.
- [[ADR-006 Self-hosted Docker VPS Hosting]] — nginx-конфиг для редиректов.
- `tilda-old/istokmebel/htaccess` — источник правды по текущим Tilda URL.
- `tilda-old/istokmebel/sitemap.xml` — список индексируемых страниц.
- [[Сайт as-is]] — общий аудит Tilda-сайта.
