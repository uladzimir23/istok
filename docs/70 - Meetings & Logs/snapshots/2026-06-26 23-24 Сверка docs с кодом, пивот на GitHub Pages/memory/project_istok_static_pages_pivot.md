---
name: istok-static-pages-pivot
description: "istok хостится на GitHub Pages (static export), а не на Docker VPS — ADR-006 superseded ADR-008 (2026-06-26)."
metadata: 
  node_type: memory
  type: project
  originSessionId: de4cb502-47f9-4090-9993-28c8904c334a
---

Хостинг istok в Phase 1 — **GitHub Pages, static export Next.js** (`output: "export"`),
а НЕ self-host Docker VPS. Зафиксировано в ADR-008 (2026-06-26), который supersedes
ADR-006 (VPS-стек так и не имплементировался).

**Why:** brochure-site без бэкенда (контент — MDX/TS в репо по ADR-005, БД нет). Поднимать
VPS+Docker+nginx+certbot ради раздачи статики — инфраструктура без задачи. GitHub Pages:
zero-ops, ноль расходов, деплой = `git push`, SSL встроен. Соответствует установке
[[feedback_defer_infra_complexity]].

**Как применять:**
- Деплой: `.github/workflows/deploy-pages.yml` (push в main → `bun run build` с
  `GITHUB_PAGES=true` → `web/out` → `upload-pages-artifact` → `deploy-pages`).
- Сайт на project page живёт по подпути `/istok` (`basePath` в `next.config.ts` при
  `GITHUB_PAGES=true`). При cutover `istokmebel.by` → кастомный домен (CNAME в Pages),
  тогда `basePath` убирается.
- **Static export = нет серверных API routes.** Заявки (LeadForm) идут на внешний endpoint
  через `NEXT_PUBLIC_LEAD_ENDPOINT` (сейчас заглушка `console.info`). Реальный приёмник
  (Telegram + Resend, serverless) — открытая задача. `/api/lead` из ADR-005 неактуален.
- К контейнерному стеку (ADR-006) возвращаемся ТОЛЬКО при активации PocketBase в Phase 2
  (trigger-условия ADR-005): тогда `output` → `"standalone"` + новый ADR.

Связано: [[project_istok_overview]], [[feedback_defer_infra_complexity]].
