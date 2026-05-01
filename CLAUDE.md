# istok — Project context for Claude Code

Корпоративный сайт мебельной фабрики **«Исток-мебель»** (istokmebel.by, Минск/Березино).
Миграция с Tilda на собственный стек. Этот проект — **эталон SDD-практик** для будущих
проектов фабрики и наших клиентов.

## Текущее состояние проекта (2026-05-01)

- **Phase 0 — SDD-каркас (init).** Создание `CLAUDE.md`, `.claude/` (skills + agents),
  `docs/` по Johnny Decimal, заведение брифа и аудита as-is. Никакого кода ещё нет.
- **Tilda продолжает работать на `istokmebel.by`.** Не трогаем до cutover'а.
- **Следующий фокус — Phase 1: ADR-каркас и решения.** PocketBase vs custom backend,
  стек фронтенда, бренд-архитектура (Исток + ELIS как раздел), AI-пайплайн рендеров.

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

> Стек **ещё не зафиксирован ADR-ами**. Текущие предпочтения после обсуждения 2026-05-01:

| Слой | Предпочтение | Статус |
| --- | --- | --- |
| Backend / Admin | **PocketBase** (single binary, SQLite, built-in admin) | одобрено пользователем, ADR pending |
| Frontend | **Next.js 15** (App Router, TypeScript strict) | предпочтение, ADR pending |
| Стили | **Tailwind + shadcn/ui** или **SCSS modules** (как в moreminsk) | развилка, ADR pending |
| Хостинг | self-host Docker на VPS либо Vercel | развилка, ADR pending |
| Аналитика | **Яндекс.Метрика + GA4** + пиксели | базис |
| Формы | **react-hook-form + zod** | базис |
| AI-пайплайн | Gemini + Krea (уже используются клиентом) | формализуем как playbook, не заменяем |

Финальный стек фиксируется в ADR-002+ после Phase 1.

## Структура репо

```
istok/
├── docs/                            # Obsidian vault (Johnny Decimal)
│   ├── 00 - Indexes/                #   Dashboard, dept-lenses, Архитектура знаний
│   ├── 10 - Brief & Requirements/   #   Бриф проекта, доступы
│   ├── 20 - Audit/                  #   Сайт as-is, контент-инвентаризация
│   ├── 30 - SEO/
│   ├── 40 - Architecture/
│   │   └── 42 - ADR/                #   Architecture Decision Records
│   ├── 45 - Engineering Workflow/   #   Branching, commits, PR, release
│   ├── 50 - Roadmap/                #   Phase planы
│   ├── 60 - Content/                #   тексты, описания
│   ├── 65 - Brand/                  #   логотипы, палитра, типографика
│   ├── 67 - SMM/                    #   контент-план, посты
│   ├── 70 - Meetings & Logs/        #   session logs + snapshots
│   ├── 80 - Templates/              #   adr.md, session-log.md, dept-dashboard.md
│   ├── 90 - Ideas & Backlog/
│   ├── 95 - Attachments/            #   PDF-каталог, скрины, фото
│   └── 97 - Reports/
├── .claude/
│   ├── settings.local.json          # локальные permissions (gitignored)
│   ├── agents/                      # docs-sync, adr-drafter
│   └── skills/                      # session-log, git-workflow, redaction, docs-writing,
│                                    # knowledge-graph, multi-audience-docs, snapshot
├── .vault-private/                  # НЕ в git — реальные секреты
├── scripts/                         # check-secrets.sh и пр.
├── CLAUDE.md
├── README.md
└── .gitignore
```

Когда появится код — добавятся `apps/web/`, `pocketbase/`, `packages/` (или плоская
структура — решит ADR).

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

**Active scope (Phase 0 / Phase 1):**
- `docs/10 - Brief & Requirements/Бриф проекта.md` — бренд-архитектура, направления,
  каталог Элис, клиентские реалии.
- `docs/20 - Audit/Сайт as-is.md` — что есть на Tilda, что отсутствует.
- `docs/40 - Architecture/42 - ADR/` — пока пусто, скоро ADR-001 (PocketBase),
  ADR-002 (Next.js 15), ADR-003 (бренд-архитектура — раздел Элис vs отдельный сайт).

## Workflow

- **Session log** — в конце сессии с реальной работой создавать запись в
  `docs/70 - Meetings & Logs/YYYY-MM-DD HH:mm <topic>.md` (см. скилл
  `.claude/skills/session-log.md`).
- **ADR** — все значимые решения через sub-агент `adr-drafter` или вручную по шаблону
  `docs/80 - Templates/adr.md`.
- **Memory** — фактический контекст для следующих сессий — в
  `~/.claude/projects/-Users-vladimirmazyrec-Documents-istok/memory/`.
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
