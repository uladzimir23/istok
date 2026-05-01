---
description: Автоматическое создание session log в конце сессии с реальной работой. Активируется при завершении работы, когда были изменения в коде/документации. Создаёт запись в docs/70 - Meetings & Logs/.
---

# Skill: Session Log

## Когда создавать session log

В конце сессии, если были **реальные изменения**:

- Коммиты в git
- Создание/изменение файлов в `docs/` или (когда появится код) в `apps/`/`packages/`
- Архитектурные решения (новый ADR)
- Принятые бизнес-решения

**Не создавать** при чисто исследовательских сессиях (только чтение, поиск) — если ничего
не изменено.

## Где создавать

`docs/70 - Meetings & Logs/YYYY-MM-DD HH-mm <topic>.md`

Формат имени — с датой и временем **начала** сессии. Дефис вместо двоеточия в часах
(совместимо с macOS Finder и git Windows-клиентами).

## Шаблон

См. `docs/80 - Templates/session-log.md`. Минимальный фронтматтер + 4 секции:

```markdown
---
date: YYYY-MM-DD
time: HH:mm
type: session-log
topic: "Краткая тема 1 предложением"
tags: [session, claude-code, <раздел>]
---

# Сессия Claude Code — YYYY-MM-DD HH:mm

## Что обсуждали

- Пункт 1
- Пункт 2

## Решения принятые

- Решение 1 (краткая формулировка)
- Решение 2

## Изменения в коде / docs

- `file/path.ts` — что изменилось
- Новые файлы: `...`
- Новые ADR: `...`
- Коммит: `hash (первые 7) — commit message`

## Следующие шаги

1. Что ещё нужно сделать
2. Вопросы, требующие ответа клиента
3. Открытые задачи

## Связанные

- [[Dashboard]]
- [[предыдущий session log]]
- [[ADR-NNN ...]]
```

## Snapshot документации (обязательный шаг)

После записи session log — снапшот текущего состояния индексов и памяти.
См. `.claude/skills/snapshot.md`. Снапшот = 1:1 пара к session log,
slug совпадает с именем лога без `.md`.

```bash
SLUG="YYYY-MM-DD HH-mm <topic>"
SNAP="docs/70 - Meetings & Logs/snapshots/$SLUG"
MEMDIR="$HOME/.claude/projects/-Users-vladimirmazyrec-Documents-istok/memory"

mkdir -p "$SNAP"
cp -R "docs/00 - Indexes/" "$SNAP/00 - Indexes"
cp -R "$MEMDIR" "$SNAP/memory"
git log --oneline -50 > "$SNAP/git-log.txt" 2>/dev/null || true
git status --short > "$SNAP/git-status.txt" 2>/dev/null || true
ls "docs/40 - Architecture/42 - ADR/" > "$SNAP/adr-list.txt" 2>/dev/null || true
```

### Когда НЕ делать снапшот

- Сессия чисто read-only (если нет session log → нет и снапшота).
- Содержимое индексов и памяти не менялось с предыдущего снапшота
  (`git status` чистый по `docs/00 - Indexes/` и memory-директории).

### Retention

Пока не прунимся — ревизия политики при накоплении ~50 снапшотов.

## Ключевые события, которые всегда документируются

- Архитектурное решение (ADR создан) → раздел «Решения принятые».
- Коммит с `feat:` или `refactor:` → раздел «Изменения в коде».
- Запрос к клиенту (требует ответа) → раздел «Следующие шаги».

## Что НЕ писать в session log

- ❌ Дословный транскрипт разговора.
- ❌ Код целиком (ссылки на файлы достаточно).
- ❌ Раздумывания и сомнения.
- ❌ «Помог пользователю с X» — банально и не документирует ничего.

## Связанные

- Шаблон: `docs/80 - Templates/session-log.md`
- `.claude/skills/snapshot.md` — расширенный snapshot pattern
- `.claude/skills/git-workflow.md` — формат коммитов
