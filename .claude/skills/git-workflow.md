---
description: Git-дисциплина проекта istok — Conventional Commits, scope-таксономия, ветки, pre-commit hooks. Активируется перед `git add` / `git commit` / `git push` / созданием PR.
---

# Skill: Git workflow

## Принципы

1. **Atomic commits** — один коммит = одна связная порция работы. Не мешаем
   `feat` + `refactor` + `docs` в одном коммите.
2. **Фазовый коммит** — после каждой завершённой фазы (см. Dashboard) делаем коммит.
   Не оставляем «половину фазы» без коммита.
3. **Никогда `--no-verify`** — pre-commit обязателен.
4. **`main` защищён** — force-push запрещён. Любые rewrite-операции (`rebase`, `reset --hard`,
   `push --force`) — только с явного разрешения пользователя.
5. **Commit message пишем осмысленно** — «что» очевидно из diff, в сообщении — «почему».

## Формат — Conventional Commits

```
<type>(<scope>): <subject>

[optional body — "почему", 72-char wrap]

[optional footer — refs, breaking, co-author]
```

### Типы

| Type       | Когда                                                    | Пример                                                |
| ---------- | -------------------------------------------------------- | ----------------------------------------------------- |
| `feat`     | Новая фича / компонент / страница                        | `feat(catalog): add Elis product card`                |
| `fix`      | Баг-фикс                                                 | `fix(seo): correct canonical for /chairs`             |
| `refactor` | Рефакторинг без смены поведения                          | `refactor(pb): extract product schema to shared`      |
| `perf`     | Оптимизация                                              | `perf(images): convert hero to AVIF`                  |
| `style`    | CSS/визуал без смены логики                              | `style(card): tighten spacing on mobile`              |
| `docs`     | docs/, ADR, README, CLAUDE.md, skills                    | `docs(adr): add ADR-001 PocketBase as backend`        |
| `chore`    | Зависимости, конфиги, build                              | `chore(deps): bump next to 15.2.0`                    |
| `test`     | Только тесты                                             | `test(catalog): cover product variant selection`      |
| `ci`       | GitHub Actions / workflows                               | `ci: add typecheck on PR`                             |
| `build`    | Build-система, bundler, next.config                      | `build: enable turbopack for dev`                     |
| `content`  | Изменения контента (тексты, описания товаров)            | `content(elis): add description for Николь model`     |
| `brand`    | Логотипы, токены, типографика, палитра                   | `brand: import vector logo to 65 - Brand`             |
| `seo`      | meta, sitemap, robots, schema.org                        | `seo(chairs): add ItemList schema for category`       |

### Scopes (фиксированная таксономия)

**Docs:**
- `docs` — любой `docs/**`. Уточнять при желании: `docs(adr)`, `docs(brief)`, `docs(audit)`,
  `docs(brand)`, `docs(seo)`, `docs(roadmap)`.
- `adr` — для новых ADR-файлов.
- `claude` — `CLAUDE.md`, `.claude/skills/**`, `.claude/agents/**`, `.claude/settings*.json`.

**Code (после Phase 1, когда появится стек):**
- `web` — фронтенд-приложение (Next.js).
- `pb` — PocketBase (схема, hooks, миграции).
- `catalog`, `chairs`, `office`, `elis` — фичи каталога по направлениям.
- `brand` — дизайн-токены, лого, типографика.
- `seo` — meta, sitemap, robots, schema.org.
- `analytics` — Метрика, GA4, пиксели.
- `forms`, `inquiries` — формы заявок и интеграции.

**Infra:**
- `deps` — только package.json / lock.
- `config` — next.config, tsconfig, eslint, stylelint, prettier.
- `scripts` — `scripts/*`.

### Subject (первая строка)

- **Imperative mood**: `add`, `fix`, `rename` — НЕ `added`, `fixing`.
- **Lowercase** (кроме имён собственных и аббревиатур: `ADR-001`, `SEO`, `iOS`).
- **Без точки в конце**.
- **≤ 72 символа**.
- Конкретика > обтекаемость: `fix(form): prevent double submit on slow network` лучше
  чем `fix(form): minor tweak`.

### Body — когда писать

Когда **неочевидно почему** или меняется поведение, которое увидит пользователь /
другой разработчик. Иначе — не пишем.

Body **на русском** — проект русскоязычный.

### Footer

- `Refs: <path>` — ссылка на ADR или раздел docs.
- `BREAKING CHANGE: <что сломалось>` — редко.
- `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` — для коммитов от ассистента.

## Фазовые коммиты — привязка к Dashboard

Каждая фаза из `docs/50 - Roadmap/` или Dashboard-а завершается одним или несколькими
коммитами с предсказуемым scope'ом. Ориентир — 1 фаза = 3–8 коммитов.

### Phase 0 — SDD-каркас (текущий)

Реальные коммиты:

- `chore(init): SDD scaffold (Claude skills + agents + Johnny Decimal docs)`
- `docs(brief): capture brand architecture, 3 directions, Elis catalog`
- `docs(audit): site as-is, content inventory, gaps`

### Phase 1 — Architecture decisions (next)

Ожидаемые коммиты:

- `docs(adr): add ADR-001 PocketBase as backend`
- `docs(adr): add ADR-002 Next.js 15 + App Router`
- `docs(adr): add ADR-003 Elis as section, not separate site`
- `docs(adr): add ADR-004 hosting strategy`

## Правила перед коммитом

1. `git status` + `git diff` — нет ли случайных файлов (`.env`, `.DS_Store`, `node_modules/`).
2. В staging только то, что относится к коммиту (не мешаем фичи).
3. Если pre-commit hook упал — НЕ `--no-verify`. Исправляем причину, создаём **новый**
   коммит (не amend — hook-fail означает, что предыдущего коммита нет).

## Стейджинг — точечно

Избегаем `git add .` / `git add -A`. Добавляем по имени или директории:

```bash
# хорошо
git add "docs/40 - Architecture/42 - ADR/ADR-001 PocketBase as backend.md"

# приемлемо (папка)
git add "docs/40 - Architecture/"

# плохо
git add .
```

## Бранч-политика

**Init phase (сейчас) — `main` напрямую.** Один разработчик + ассистент, feature-ветки
избыточны.

**После запуска прода** — переходим на `main` + `feat/*`, через PR (для review-discipline
и CI-прогонов).

## Push-политика

- `git push origin main` — после каждой сессии с реальной работой (не держим локальные
  коммиты > 1 дня).
- `--force` / `--force-with-lease` на `main` — **запрещено**. Откат — через `revert`,
  не `reset`.

## Стоп-слова в коммит-месседжах

❌ `fix stuff`, `wip`, `updates`, `asdf`, `final`, `finalfinal`, эмодзи в subject.
❌ Личные заметки: `TODO fix later`, `хак, потом поправлю`.

✅ Конкретное действие: `fix(catalog): prevent infinite refetch on filter change`.

## Коммиты от ассистента

Когда коммит делает Claude Code:

- Footer:
  ```
  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  ```
- **Перед коммитом всегда спрашиваем подтверждение** (если не было явной инструкции
  «коммить сам»).
- После успешного коммита — `git status`, убедиться что staging пустой.

### HEREDOC для многострочных сообщений

```bash
git commit -m "$(cat <<'EOF'
feat(catalog): add Elis product card with size selector

Карточка модели «Элис» с переключателем 3 размеров спальных мест
(1600×800 / 1800×800 / 2000×900). Размер передаётся в форму заявки
через query-параметр.

Refs: docs/40 - Architecture/42 - ADR/ADR-005 Catalog UX.md

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

## Связанные

- `CLAUDE.md` — root-level правила проекта.
- `docs/00 - Indexes/Dashboard.md` — фазы для привязки коммитов.
- `.claude/skills/redaction.md` — что нельзя коммитить.
- `.claude/skills/session-log.md` — что писать после серии коммитов.
