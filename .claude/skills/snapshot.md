---
description: Snapshot pattern — frozen-копия Dashboard + dept-lenses + memory + git-log + ADR list на момент сессии. Для retention, debugging, before-and-after analysis.
---

# Skill: Snapshot

## Зачем

Большинство слоёв проекта **mutable**: Dashboard правится постоянно, память Claude
обновляется каждую сессию, skills редактируются. Когда через 3 месяца кто-то спросит
«а что было видно агенту, когда он принимал решение X?» — без снапшотов не воспроизвести.

Snapshot — **immutable copy** ключевых слоёв на момент времени T, привязанная к
session-log-у. Используется для:

- **Debugging** — почему агент сделал странное; какой был контекст.
- **Retention** — что было в памяти 3 месяца назад.
- **Audit** — проверить что redaction соблюдался в момент решения.
- **Before-and-after** — diff между двумя снапшотами для понимания эволюции.

## Когда делать снапшот

- ✅ После создания session-log (если в сессии были реальные изменения).
- ✅ Перед опасной операцией (миграция docs, реструктуризация, schema-change в PB).
- ✅ В конце фазы Roadmap-а (Phase X закрыта).
- ❌ Чисто read-only сессия — снапшот не нужен (нечего фиксировать).
- ❌ Содержимое `docs/00 - Indexes/` и memory не менялось с прошлого снапшота
  (`git status` чистый по этим путям).

## Что захватывает снапшот

| Слой | Что копируется | Зачем |
|---|---|---|
| **Indexes** | `docs/00 - Indexes/*.md` | Какой Dashboard видел агент в момент T |
| **Memory** | `~/.claude/projects/.../memory/*.md` | Что было известно агенту fact-wise |
| **Git log** | `git log --oneline -50` | Какие коммиты ему были видны |
| **Git status** | `git status --short` | Какие правки в работе |
| **ADR list** | `ls "docs/40 - Architecture/42 - ADR/"` | Какие решения были на руках |

## Где хранится

```
docs/70 - Meetings & Logs/snapshots/<session-slug>/
├── 00 - Indexes/                # cp -R "docs/00 - Indexes/" сюда
├── memory/                      # cp -R memory сюда
├── git-log.txt
├── git-status.txt
└── adr-list.txt
```

`<session-slug>` = имя session-log файла без `.md`. Например:
`2026-05-01 03-30 SDD init/`.

Снапшоты **immutable** — после создания не правятся. Если нужно исправить — отдельный
коммит с новым снапшотом.

## Как делать (вручную, пока нет команды)

```bash
SLUG="2026-05-01 03-30 SDD init"
SNAP="docs/70 - Meetings & Logs/snapshots/$SLUG"
MEMDIR="$HOME/.claude/projects/-Users-vladimirmazyrec-Documents-istok/memory"

mkdir -p "$SNAP"
cp -R "docs/00 - Indexes/" "$SNAP/00 - Indexes"
cp -R "$MEMDIR" "$SNAP/memory"
git log --oneline -50 > "$SNAP/git-log.txt" 2>/dev/null || echo "(no git log)" > "$SNAP/git-log.txt"
git status --short > "$SNAP/git-status.txt" 2>/dev/null || true
ls "docs/40 - Architecture/42 - ADR/" > "$SNAP/adr-list.txt" 2>/dev/null || true
```

## Что НЕ кладём в снапшот

- `node_modules/`, `__pycache__/`, `dist/`, `.next/`.
- `.vault-private/secrets.md` (никогда — secret zone).
- Содержимое `pb_data/` (БД PocketBase — большие, отдельный backup-pipeline).
- Файлы клиента в `docs/95 - Attachments/raw/` (могут содержать NDA-материалы).

## Связанные

- `.claude/skills/session-log.md` — снапшот привязан к session-log, slug совпадает.
- `docs/00 - Indexes/Архитектура знаний.md` — где snapshot в карте слоёв.
