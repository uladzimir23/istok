---
date: 2026-06-26
time: 23:24
type: session-log
topic: "Сверка документации с реальным кодом: оформлен пивот хостинга на GitHub Pages (ADR-008), мигрирована память на новый путь репо"
tags: [session, claude-code, architecture, hosting, docs-sync]
---

# Сессия Claude Code — 2026-06-26 23:24

## Что обсуждали

- Запрос «давай продолжим» без конкретики. Провёл аудит реального состояния репо —
  оказалось, документация (Dashboard от 2026-05-01) сильно отстала от кода.
- Факт: Phase 1 имплементация по сути выполнена — собран рабочий сайт (Next.js 16,
  `bun run build` проходит): главная, все категории (кресла, кроватки, корпусная →
  комоды/столы/стеллажи/шкафы), карточки товаров (SSG), about/contacts/dostavka/privacy,
  дизайн-система + ~18 виджетов, 26 MDX-товаров с Zod-валидацией, SEO (robots/sitemap/JsonLd).
- Обнаружены расхождения кода с задокументированными решениями (см. ниже).
- Пользователь выбрал направление: **сверить docs с кодом** (а не пилить новые фичи).

## Решения принятые

- **ADR-008 — GitHub Pages Static Export Hosting** (proposed). Оформлен задним числом
  уже состоявшийся в коде пивот: хостинг переведён с Docker VPS на static export
  (`output: "export"`) → GitHub Pages через Actions. Обоснование: brochure-site без
  бэкенда — VPS+Docker+nginx+certbot избыточны; GH Pages = zero-ops, ноль расходов,
  деплой = `git push`. Соответствует принципу defer-complexity-until-justified.
- **ADR-006 (Docker VPS) → superseded** by ADR-008. VPS-стек так и не имплементировался.
- **ADR-005** дополнен: серверный `/api/lead` невозможен при static export — заявки идут
  на внешний endpoint через `NEXT_PUBLIC_LEAD_ENDPOINT` (сейчас заглушка).
- В CI (`deploy-pages.yml`) добавлены гейты `typecheck` + `validate:content` перед сборкой.

## Изменения в коде / docs

- Новый ADR: `docs/40 - Architecture/42 - ADR/ADR-008 GitHub Pages Static Export Hosting.md`.
- `ADR-006 …Hosting.md` — статус `superseded`, баннер + `superseded-by: ADR-008`.
- `ADR-005 …No Backend.md` — пометка про пересмотр `/api/lead`.
- `web/scripts/validate-content.ts` — **создан** (был сломан: package.json ссылался на
  несуществующий файл). Проверяет все MDX против Zod, ловит дубли slug, собирает все
  ошибки. `bun run validate:content` → «26 товаров, ошибок нет».
- `.github/workflows/deploy-pages.yml` — добавлены шаги typecheck + validate:content.
- **Память мигрирована** со старого пути `~/.claude/projects/-Users-vladimirmazyrec-Documents-istok/`
  на актуальный `-Users-vladimirmazyrec-Projects-zavody-rb-istok/` (в этой сессии читался
  пустой новый путь — все факты были осиротевшими). Обновлены пути (репо и кластер
  переехали `~/Documents` → `~/Projects/zavody-rb`), добавлен факт о GH Pages пивоте.
- Dashboard + dept-линзы + ADR README — синхронизированы через sub-агент `docs-sync`.

## Следующие шаги

1. **Реальный приёмник заявок**: serverless/бот-вебхук (Telegram + email через Resend),
   задать `NEXT_PUBLIC_LEAD_ENDPOINT` в Pages secrets. Сейчас LeadForm — заглушка.
2. **Наполнение портфолио** `content/projects/` (госзаказ, театральные кресла) — пусто.
3. **DNS-cutover** `istokmebel.by` → кастомный домен в GitHub Pages (CNAME), убрать
   `basePath: "/istok"`. Координируется с готовностью контента; Tilda пока работает.
4. **Вопросы клиенту** (открыты с 2026-05-01): цены на «Элис»; доступы Метрика/GA4/бот;
   каталог по театральным креслам (размеры/материалы); материалы для «О компании».
5. Уточнить профиль нового проекта кластера `alto` (появился в `~/Projects/zavody-rb/`).

## Связанные

- [[Dashboard]]
- [[2026-05-01 03-30 ADR-каркас Phase 1]]
- [[ADR-008 GitHub Pages Static Export Hosting]]
- [[ADR-006 Self-hosted Docker VPS Hosting]]
- [[ADR-005 Content-as-Code Phase 1 No Backend]]
