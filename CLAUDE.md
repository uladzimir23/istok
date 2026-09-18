# istok — Project context for Claude Code

Корпоративный сайт мебельной фабрики **«Исток-мебель»** (istokmebel.by, Минск/Березино).
Миграция с Tilda на собственный стек. Этот проект — **эталон SDD-практик** для будущих
проектов фабрики и наших клиентов.

## Текущее состояние проекта (2026-05-01)

- **Phase 0 — SDD-каркас (init) — готово.** `CLAUDE.md`, `.claude/` (skills + agents),
  `docs/` по Johnny Decimal, бриф и аудит as-is занесены, первый коммит сделан.
- **Phase 1 ADR-каркас — готово.** ADR-001..009: Next.js (App Router), SCSS modules,
  бренд-архитектура (один сайт, два бренда), content-as-code (PocketBase отложен в Phase 2
  по триггерам), плоская структура. Hosting-цепочка: ADR-006 (Docker VPS) → ADR-008
  (GitHub Pages) → **ADR-009 (сервер агентства SYNC, Hetzner)** — актуальное.
- **Phase 1 имплементация — выполнена (2026-06-26).** Собран рабочий сайт: `apps/web/`
  (Next.js 16, App Router, TS strict, FSD-lite), все категории (кресла, кроватки,
  корпусная → комоды/столы/стеллажи/шкафы) + карточки товаров (SSG), дизайн-система
  Исток/ELIS, ~18 виджетов, 26 MDX-товаров с Zod-валидацией, SEO. `bun run build` проходит.
- **Хостинг живёт на сервере агентства (ADR-009).** Static export раздаётся
  `nginx:alpine` в Docker-образе; деплой `push → GHCR → ssh → compose` на `89.169.54.11`,
  порт 3008 (3007 занят другим стеком). Host-nginx проксирует apex `istokmebel.by` +
  `www.istokmebel.by` + preview `new.istokmebel.by` → 127.0.0.1:3008. Обвязка в репо:
  `apps/{web,admin}/Dockerfile`, `infra/nginx/{container.conf,istokmebel.by.conf,new.istokmebel.by.conf}`,
  `infra/docker-compose.yml`, `.github/workflows/deploy.yml`. Карта сервера — внешний волт
  `~/Desktop/sync-agency-server/`.
- **DNS-cutover apex завершён (2026-09-18).** `istokmebel.by` и `www.istokmebel.by`
  переведены с Tilda на наш сервер (hoster.by панель, A → 89.169.54.11), SSL Let's Encrypt
  выпущен, redirect www→apex и http→https настроены. Tilda больше не обслуживает домен.
- **Phase 2 открыта (2026-06-27) — PocketBase ([[ADR-010]]).** Сработал триггер №1 из
  ADR-005 (редактор фабрики без git): активируем БД + админку. Модель — **static export
  + rebuild-webhook** (хостинг ADR-009 не меняется): PB на том же сервере, loader'ы читают
  PB на билде, правка в админке → `repository_dispatch` → пересборка статики. Имплементация —
  после выката статики на сервер, на ветке. Донор паттерна — `flex-glass` (skill `pocketbase.md`).
- **Открытые пункты:** реальный приёмник заявок (`NEXT_PUBLIC_LEAD_ENDPOINT`: Telegram +
  Resend — сейчас заглушка), наполнение портфолио `content/projects/`, цены «Элис» от
  клиента.

## Видение

Делаем **один корпоративный сайт `istokmebel.by`** под реальную бренд-архитектуру компании:

- **Головной бренд «Исток-мебель»** — B2B/госзаказ. Театральные кресла (~1/3 госзаказа на
  кресла для залов в РБ по их заявлению), корпусная мебель (комоды/столы/стеллажи/шкафы),
  портфолио проектов.
- **Суббренд «ELIS-MEBEL Kids Beds»** — потребительская линейка детских кроваток (8 моделей
  «Элис»). Реализуется как **раздел внутри `istokmebel.by`**, отдельного сайта/домена нет.

Подробности — `docs/10 - Brief & Requirements/Бриф проекта.md`.

## Принцип принятия решений

> Все технические и архитектурные решения (стек, фреймворки, хостинг, библиотеки,
> паттерны, инструменты) принимаем **сами**, исходя из best practices и опыта других
> наших проектов (см. reference в `docs/10 - Brief & Requirements/Бриф проекта.md`).
>
> **У клиента (фабрики) спрашиваем только бизнес/контент-вопросы:** цены, фото, тексты,
> бренд-атрибуты, согласование макетов, юр-нюансы, доступы. Технический язык в общении
> избегаем — переводим в бизнес-результат.
>
> Любая развилка типа «Vercel или self-host», «Sanity или PocketBase» — решаем сами,
> документируем как ADR с обоснованием. Спрашиваем клиента только если выбор реально
> влияет на бюджет, сроки или фичи.

## Документативный подход (закреплено 2026-05-01)

Любое значимое решение оформляется **до кода**:

1. **ADR** в `docs/40 - Architecture/42 - ADR/ADR-NNN Title.md` с обоснованием
   (sub-агент `adr-drafter` для скорости).
2. **Обновление CLAUDE.md** если меняется фокусная работа или стек.
3. **Обновление Dashboard** в `docs/00 - Indexes/Dashboard.md` (sub-агент `docs-sync`).
4. **Запись в память Claude** для важного фактического контекста (см. auto-memory секцию
   системного промпта).
5. **Session log** в `docs/70 - Meetings & Logs/` после содержательной сессии.

## Redaction policy (критично)

В публичные (закоммиченные) документы **никогда** не попадают:

- Пароли, API-ключи, токены (включая будущие `POCKETBASE_ADMIN_PASS`, `TELEGRAM_BOT_TOKEN`,
  `RESEND_API_KEY`, `YANDEX_METRIKA_KEY`).
- Логины админок.
- Приватные IP, внутренние хосты, порты.
- Личные телефоны сотрудников фабрики (рабочие из публичного сайта — ок).
- Внутренние ID интеграций (например, Bitrix24/amoCRM ID, если будет).

Всё перечисленное — заменяется на `████` (U+2588). Реальные значения хранятся в
`.vault-private/secrets.md` (gitignored). Подробности — `.claude/skills/redaction.md`.

## Tech Stack

> Зафиксирован серией ADR (2026-05-01). См. `docs/40 - Architecture/42 - ADR/`.

| Слой | Решение | Источник |
| --- | --- | --- |
| Frontend | **Next.js 16** (App Router, TypeScript strict, FSD-lite) | [[ADR-002]] |
| Стили | **SCSS modules + cascade layers + token-система** (паттерн moreminsk) | [[ADR-004]] |
| Контент Phase 1 | **Content-as-code** — MDX/TS в `content/` + Zod-валидация на билде | [[ADR-005]] |
| Backend Phase 1 | **Нет.** Заявки → внешний endpoint `NEXT_PUBLIC_LEAD_ENDPOINT` → Telegram + email (Resend) | [[ADR-005]], [[ADR-008]] |
| Backend Phase 2 | **PocketBase** при наступлении trigger-условий (см. ADR-005) | [[ADR-001]] (superseded), [[ADR-005]] |
| Бренд-архитектура | Один сайт `istokmebel.by`, ELIS — раздел `/krovatki` со своей темой | [[ADR-003]] |
| Хостинг | **Сервер агентства SYNC** (Hetzner, GHCR + compose, `nginx:alpine` раздаёт static export); `new.istokmebel.by` | [[ADR-009]] (supersedes [[ADR-008]], [[ADR-006]]) |
| Структура репо | Монорепо `apps/{web,admin,pocketbase}` + `packages/design-system` + `content/` (Bun workspaces web/admin) | [[ADR-007]] superseded 2026-09-19 |
| Аналитика | **Яндекс.Метрика + GA4** + пиксели | базис, отдельный ADR |
| Формы | **react-hook-form + zod**, submit через `Promise.allSettled` | паттерн comforthotel ADR-014 |
| AI-пайплайн | Gemini + Krea (формализуем как playbook позже, отдельный ADR Phase 2+) | отложено |

## Структура репо

Монорепо на Bun workspaces (2026-09-19; ADR-007 superseded):

```
istok/
├── apps/
│   ├── web/                         # Next.js 16 сайт (ADR-002)
│   │   ├── src/{app,widgets,features,entities,shared}/   # FSD-lite
│   │   ├── scripts/{validate-content,pb/*}.ts
│   │   ├── next.config.ts           # output:"export", loadPaths="../.."
│   │   ├── Dockerfile               # multi-stage: bun deps → node build → nginx:alpine
│   │   └── package.json
│   ├── admin/                       # Vite + React SPA админка (ADR-011)
│   │   ├── src/
│   │   ├── vite.config.ts           # loadPaths="../.."
│   │   ├── Dockerfile
│   │   └── package.json
│   └── pocketbase/                  # PocketBase бинарь + миграции + hooks (ADR-010)
│       ├── Dockerfile               # без package.json — из workspaces исключён
│       ├── pb_data/                 # в git не идёт (persistent volume)
│       └── pb_migrations/
├── packages/
│   └── design-system/               # SCSS токены/миксины/базы (общий для web + admin)
├── content/                         # MDX (Phase 1) — уезжает в PB (Phase 2)
│   ├── products/{chairs,cabinets,cribs}/    # 26 MDX-товаров
│   └── projects/                    # портфолио госзаказа
├── infra/                           # IaC деплоя (ADR-009)
│   ├── nginx/{container,istokmebel.by,new.istokmebel.by}.conf
│   └── docker-compose.yml           # источник для /opt/istok/ на сервере
├── docker-compose.dev.yml           # локальный dev-стек (PB рядом с web+admin dev)
├── docs/                            # Obsidian vault (Johnny Decimal 00–97)
├── package.json                     # workspaces: apps/*, packages/*
├── .dockerignore
├── .github/workflows/deploy.yml     # CI: 3 образа (site+admin+pb) → GHCR → ssh compose
├── .claude/{agents,skills,settings.local.json}
├── .vault-private/                  # НЕ в git
├── CLAUDE.md
└── README.md
```

## Ветки

**Init phase (сейчас) — работаем на `main`.** Feature-ветки не используем (избыточно
для проекта с одним разработчиком + ассистентом). После запуска прод-сайта переходим
на `main` + `feat/*` через PR.

Полный операционный бриф появится в `docs/45 - Engineering Workflow/` после Phase 1.

## Ключевые документы (читать перед работой)

**Always:**
- `docs/00 - Indexes/Dashboard.md` — текущий статус и приоритет.
- `CLAUDE.md` (этот файл) — стек, видение, redaction policy.
- `docs/00 - Indexes/Архитектура знаний.md` — карта слоёв документации.

**Active scope (Phase 1 имплементация):**
- `docs/10 - Brief & Requirements/Бриф проекта.md` — бренд-архитектура, направления,
  каталог Элис, клиентские реалии.
- `docs/20 - Audit/Сайт as-is.md` — что есть на Tilda, что отсутствует.
- `docs/40 - Architecture/42 - ADR/` — ADR-001 (superseded ADR-005), ADR-002..005, 007
  (proposed); хостинг-цепочка ADR-006 → ADR-008 → **ADR-009** (сервер агентства SYNC,
  актуальный; 006/008 superseded): Next.js, бренд-архитектура, SCSS modules,
  content-as-code, static export на сервере агентства, плоский репо.

## Workflow

- **Session log** — в конце сессии с реальной работой создавать запись в
  `docs/70 - Meetings & Logs/YYYY-MM-DD HH:mm <topic>.md` (см. скилл
  `.claude/skills/session-log.md`).
- **ADR** — все значимые решения через sub-агент `adr-drafter` или вручную по шаблону
  `docs/80 - Templates/adr.md`.
- **Memory** — фактический контекст для следующих сессий — в
  `~/.claude/projects/-Users-vladimirmazyrec-Projects-istok/memory/`.
- **Коммиты** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`,
  `content:` для контента, `chore(brand):` для брендинга). Подробности — в
  `.claude/skills/git-workflow.md`.
- **Sub-агент `docs-sync`** — после существенного события (новый ADR, новый session log,
  закрытая фаза) вызывать вместо ручного обновления Dashboard + dept-линз + MEMORY.md.

## Внешние ссылки

- Публичный сайт (Tilda, до cutover): <https://istokmebel.by>
- Instagram: <https://instagram.com/istok_etg>
- Reference-проекты для копирования паттернов:
  - `~/Documents/comforthotel/` — самый зрелый SDD-проект
  - `~/Documents/flex-glass/` — донор PocketBase + shadcn скиллов
  - `~/Documents/core-tech-orch/` — донор `.claude/commands/` и `adr-drafter`
