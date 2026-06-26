---
name: SDD-первый init для нового проекта
description: Любой новый проект пользователя начинается с SDD-каркаса (CLAUDE.md + Johnny Decimal docs/ + .claude/skills+agents) ДО любого кода. Это стандарт, а не выбор.
type: feedback
originSessionId: 195a2168-4af6-4f89-9fa4-203be050b1cd
---
Любой новый проект пользователя начинается с инициализации SDD-каркаса ДО написания кода или принятия архитектурных решений. Это паттерн, который виден во ВСЕХ его проектах: `comforthotel`, `core-tech-orch`, `flex-glass`, `sync-hub`, `moreminsk`, `neuro-center`.

**Why:** пользователь строит «фабрику проектов», где каждый новый проект мог бы стать донором паттернов для следующих. ADR-before-code, плотный граф знаний (Obsidian), Department lenses, snapshots — всё это инфраструктура, которая делает проект переиспользуемым шаблоном. Без этого каркаса проект превращается в «ещё один сайт».

**How to apply:**
1. На запрос «давай начнём новый проект» / «давай мигрировать X» — НЕ предлагать сразу код или стек. Сначала предложить инициализацию SDD-каркаса.
2. Структура каркаса:
   - `CLAUDE.md` — бриф, стек, redaction policy, workflow, ссылки на ключевые документы.
   - `.claude/skills/` — переиспользовать базовый набор: `session-log`, `git-workflow`, `redaction`, `docs-writing`, `knowledge-graph`, `multi-audience-docs`, `snapshot`. Плюс проект-специфичные.
   - `.claude/agents/` — `docs-sync` (синхронизирует Dashboard+dept-дашборды+MEMORY) и `adr-drafter`.
   - `.claude/settings.local.json` — permissions.
   - `docs/` — Johnny Decimal: `00 - Indexes` (Dashboard + dept-линзы + Архитектура знаний), `10 - Brief & Requirements`, `20 - Audit`, `30 - SEO`, `40 - Architecture` (с `42 - ADR`), `45 - Engineering Workflow`, `50 - Migration Plan`, `60 - Content`, `65 - Brand`, `67 - SMM`, `70 - Meetings & Logs` (с `snapshots/`), `80 - Templates` (adr.md, session-log.md, dept-dashboard.md), `90 - Ideas & Backlog`, `95 - Attachments`, `97 - Reports`.
   - `.vault-private/` — gitignored секреты.
   - Memory dir (auto-memory).
3. Принципы:
   - ADR до кода — фиксируем решение, потом реализуем.
   - Dashboard — живой хаб статуса.
   - Department lenses — отдельные линзы для маркетинга и разработки.
   - Conventional Commits + scope-таксономия + Co-Authored-By footer.
   - Redaction policy — никаких секретов в git.
   - Session log + снапшот после содержательной сессии.
   - Wiki-links Obsidian-style.
4. Reference-проекты для копирования паттернов: `comforthotel` (полнее всего, уже зрелый), `core-tech-orch` (commands пример), `flex-glass` (project-specific skills как pocketbase.md, design-system.md).
5. Reference brief-источник всегда в `10 - Brief & Requirements/`, аудит as-is — в `20 - Audit/`. Не пытаться вместить всё в CLAUDE.md.
