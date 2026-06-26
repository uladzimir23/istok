---
title: 42 — ADR
description: Architecture Decision Records
order: 42
---

# 42 — ADR (Architecture Decision Records)

Все значимые архитектурные решения. Шаблон — `docs/80 - Templates/adr.md`. Создаются
через sub-агент `adr-drafter` (см. `.claude/agents/adr-drafter.md`).

## Принципы

- ADR создаётся **до кода**, не после.
- Решение принимает человек, ADR — это запись.
- Один ADR = одно решение. Связанные решения — отдельные ADR со ссылками.
- После реализации статус: `proposed` → `accepted`. Если решение пересмотрели — старый
  становится `superseded`, новый ссылается на него.

## Список (актуально на 2026-06-26)

| ADR | Название | Статус | Дата |
|---|---|---|---|
| ADR-001 | PocketBase as Backend | superseded by ADR-005 | 2026-05-01 |
| ADR-002 | Next.js 16 as Frontend | proposed | 2026-05-01 |
| ADR-003 | Brand Architecture: One Site Two Brands | proposed | 2026-05-01 |
| ADR-004 | SCSS Modules as Style Layer | proposed | 2026-05-01 |
| ADR-005 | Content-as-Code Phase 1 No Backend | proposed | 2026-05-01 |
| ADR-006 | Self-hosted Docker VPS Hosting | superseded by ADR-008 | 2026-05-01 |
| ADR-007 | Flat Repo Structure No Monorepo | proposed | 2026-05-01 |
| ADR-008 | GitHub Pages Static Export Hosting | proposed | 2026-06-26 |
