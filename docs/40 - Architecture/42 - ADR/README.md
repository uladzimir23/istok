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

## Список (на момент init — пусто)

Запланированные:
- ADR-001 — PocketBase as backend (decision принято в чате 2026-05-01).
- ADR-002 — Next.js 15 + App Router as frontend.
- ADR-003 — «Элис» как раздел внутри istokmebel.by, не отдельный сайт.
- ADR-004 — Hosting (self-host Docker на VPS vs Vercel).
- ADR-005 — UI стек (Tailwind+shadcn vs SCSS modules).
- ADR-006 — Image pipeline (Cloudflare R2 vs Bunny + next/image).
- ADR-007 — Аналитика (Метрика + GA4 + цели).
- ADR-008 — AI-рендер пайплайн (Gemini/Krea пресеты).
