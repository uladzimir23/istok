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
- **Phase 1 имплементация — выполнена (2026-06-26).** Собран рабочий сайт: `web/`
  (Next.js 16, App Router, TS strict, FSD-lite), все категории (кресла, кроватки,
  корпусная → комоды/столы/стеллажи/шкафы) + карточки товаров (SSG), дизайн-система
  Исток/ELIS, ~18 виджетов, 26 MDX-товаров с Zod-валидацией, SEO. `bun run build` проходит.
- **Хостинг мигрирует на сервер агентства (ADR-009).** Static export раздаётся
  `nginx:alpine` в Docker-образе; деплой `push → GHCR → ssh → compose` на `89.169.54.11`,
  поддомен `new.istokmebel.by` (порт 3007). Обвязка в репо: `Dockerfile`, `infra/nginx/`,
  `infra/docker-compose.yml`, `.github/workflows/deploy.yml`. Карта сервера — внешний волт
  `~/Desktop/sync-agency-server/`. Открыто: DNS, `DEPLOY_SSH_KEY`, серверные шаги.
- **Phase 2 открыта (2026-06-27) — PocketBase ([[ADR-010]]).** Сработал триггер №1 из
  ADR-005 (редактор фабрики без git): активируем БД + админку. Модель — **static export
  + rebuild-webhook** (хостинг ADR-009 не меняется): PB на том же сервере, loader'ы читают
  PB на билде, правка в админке → `repository_dispatch` → пересборка статики. Имплементация —
  после выката статики на сервер, на ветке. Донор паттерна — `flex-glass` (skill `pocketbase.md`).
- **Открытые пункты:** реальный приёмник заявок (`NEXT_PUBLIC_LEAD_ENDPOINT`: Telegram +
  Resend — сейчас заглушка), наполнение портфолио `content/projects/`, цены «Элис» от
  клиента, финальный DNS-cutover apex `istokmebel.by` с Tilda на сервер.
- **Tilda продолжает работать на `istokmebel.by`.** Не трогаем до DNS-cutover.

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
| Структура репо | Плоская (`web/` + `content/`), без монорепо | [[ADR-007]] |
| Аналитика | **Яндекс.Метрика + GA4** + пиксели | базис, отдельный ADR |
| Формы | **react-hook-form + zod**, submit через `Promise.allSettled` | паттерн comforthotel ADR-014 |
| AI-пайплайн | Gemini + Krea (формализуем как playbook позже, отдельный ADR Phase 2+) | отложено |

## Структура репо

Плоская (зафиксировано в [[ADR-007]]). Финальная структура после старта Phase 1:

```
istok/
├── docs/                            # Obsidian vault (Johnny Decimal)
│   ├── 00 - Indexes/                #   Dashboard, dept-lenses, Архитектура знаний
│   ├── 10 - Brief & Requirements/   #   Бриф проекта, доступы
│   ├── 20 - Audit/                  #   Сайт as-is, контент-инвентаризация
│   ├── 30 - SEO/
│   ├── 40 - Architecture/42 - ADR/  #   Architecture Decision Records
│   ├── 45 - Engineering Workflow/   #   Branching, commits, PR, release, server runbook
│   ├── 50 - Roadmap/                #   Phase planы
│   ├── 60 - Content/                #   тексты, описания
│   ├── 65 - Brand/istok|elis/       #   бренд-гайды двух брендов
│   ├── 67 - SMM/
│   ├── 70 - Meetings & Logs/        #   session logs + snapshots
│   ├── 80 - Templates/
│   ├── 90 - Ideas & Backlog/
│   ├── 95 - Attachments/
│   └── 97 - Reports/
├── web/                             # Next.js 16 application (ADR-002, ADR-007)
│   ├── src/{app,widgets,features,entities,shared}/   # FSD-lite
│   │   └── entities/product/{schema.ts,loader.ts}    # Zod-схема + MDX-loader (ADR-005)
│   ├── scripts/validate-content.ts  # CLI-валидатор контента (bun run validate:content)
│   ├── public/
│   ├── package.json
│   ├── next.config.ts               # output: "export" (без basePath — поддомен, ADR-009)
│   └── tsconfig.json
├── content/                         # MDX контент-as-code (ADR-005)
│   ├── products/{chairs,cabinets,cribs}/    # 26 MDX-товаров
│   └── projects/                    # портфолио госзаказа (пока пусто)
├── infra/                           # IaC деплоя на сервер агентства (ADR-009)
│   ├── nginx/container.conf         #   nginx внутри образа (раздача static export)
│   ├── nginx/new.istokmebel.by.conf #   host-vhost (→ 127.0.0.1:3007)
│   └── docker-compose.yml           #   источник для /opt/istok/ на сервере
├── Dockerfile                       # multi-stage: bun deps → node build → nginx:alpine
├── .dockerignore
├── .github/workflows/               # CI: deploy.yml (build → GHCR → ssh deploy, ADR-009)
├── .claude/
│   ├── settings.local.json
│   ├── agents/                      # docs-sync, adr-drafter
│   └── skills/
├── .vault-private/                  # НЕ в git
├── CLAUDE.md
├── README.md
└── .gitignore
```

В Phase 2 при активации PocketBase (по триггерам [[ADR-005]]) `output` меняется на
`"standalone"`, Dockerfile/compose обновляются под Node-runtime, добавляется `pocketbase/`
сервис в тот же `/opt/istok/docker-compose.yml` — без перехода в монорепо.

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
  `~/.claude/projects/-Users-vladimirmazyrec-Projects-zavody-rb-istok/memory/`.
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
