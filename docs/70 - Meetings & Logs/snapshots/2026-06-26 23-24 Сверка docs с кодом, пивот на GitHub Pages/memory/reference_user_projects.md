---
name: Reference projects in ~/Documents
description: Карта существующих проектов пользователя в ~/Documents — что где, какие паттерны живут, откуда копировать SDD-каркас.
type: reference
originSessionId: 195a2168-4af6-4f89-9fa4-203be050b1cd
---
В `~/Documents/` живёт фабрика проектов пользователя. Каждый можно использовать как референс для конкретного аспекта.

**Источники базовых SDD-паттернов:**
- `comforthotel/` — самый зрелый SDD-проект. Полный набор: CLAUDE.md, .claude/skills (13 штук), .claude/agents/docs-sync, docs/ по Johnny Decimal с 17 секциями, snapshots, dept-lenses (01 Маркетинг + 02 Разработка), brand foundations (раздел 65), SMM playbook (раздел 67). Свежие ADR-ы (24+). Всё на свежем стеке: Next.js 16, Bun, SCSS modules, FSD-lite. Лучший донор паттернов.
- `core-tech-orch/` — есть `.claude/commands/` (audit, commit, log, snapshot, sprint, where) и `.claude/agents/adr-drafter.md` — донор, если нужны commands и ADR-агент.
- `flex-glass/` — донор project-specific skills: `pocketbase.md`, `shadcn-ui.md`, `design-system.md`, `ai-prompts.md`, `routing.md`, `editor.md`. Если новый проект на PocketBase/shadcn — копировать скиллы оттуда.
- `moreminsk/` — fundament для Next.js + SCSS + FSD-lite + booking wizard. От этого проекта отнаследовано большинство стек-решений в comforthotel и других. Tech-stack reference.
- `sync-hub/` — минимальный пример лендинга с docs-каркасом.
- `neuro-center/` (3 варианта: `-main`, `-spa`, корневой) — Vite + React, проще структура.

**Прикладные референсы:**
- `Personal/` — личное (не для работы).
- `Fenix-Docs/`, `FlexGlass-Docs/`, `NeuroCenter-Docs/`, `SyncHub-Docs/` — отдельные docs-проекты, видимо историческая раскладка до объединения docs+code.
- `pocketbase-integration.md` (файл в корне Documents) — заметка по PocketBase, см. перед началом нового PB-проекта.
- `LOCAL_SETUP.md` (файл в корне Documents) — общий setup-гид.
- `deer-flow-local/`, `deerflow-overview.{html,pdf}` — DeerFlow research-агент, референс по multi-agent оркестрации.

**Папка с сайтами/ + matterforge-showcase/, redrened-website/, sync-brand-site-v2/, clariva-spa-landing/** — другие лендинги/сайты в работе.

**Как применять:**
- Стартую новый проект → копирую SDD-каркас из `comforthotel/` (CLAUDE.md как образец, скиллы, шаблоны, структуру docs/).
- Нужен ADR-агент или commands → беру из `core-tech-orch/`.
- Стек PocketBase/shadcn → беру скиллы из `flex-glass/`.
- Нужен Next.js fundament → отталкиваюсь от `moreminsk/`.
