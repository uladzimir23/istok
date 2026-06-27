---
name: istok-static-pages-pivot
description: "Хостинг istok — цепочка решений VPS→GH Pages→сервер агентства SYNC. Актуальное: ADR-009 (Hetzner, new.istokmebel.by, порт 3007). istok остаётся static export."
metadata: 
  node_type: memory
  type: project
  originSessionId: de4cb502-47f9-4090-9993-28c8904c334a
---

Хостинг istok прошёл цепочку решений (istok — static export `output: "export"`
на всём протяжении, меняется только КТО раздаёт `web/out`):

1. **ADR-006** — self-host Docker VPS (не имплементирован).
2. **ADR-008** — GitHub Pages (был live на `uladzimir23.github.io/istok`, basePath `/istok`).
3. **ADR-009 (актуальное, 2026-06-26)** — **общий сервер агентства SYNC**
   (Hetzner `89.169.54.11`). Триггер: сервер уже существует с готовым каноном деплоя
   (6+ сайтов), переиспользуем инфру вместо отдельного GH Pages пайплайна.

**Текущая модель (ADR-009):**
- Static export раздаётся `nginx:alpine` в Docker-образе; host-nginx + certbot
  проксируют `new.istokmebel.by` → `127.0.0.1:3007` → контейнер. apex `istokmebel.by`
  пока на Tilda.
- Деплой — канон агентства: `push main → Actions → docker build → GHCR → appleboy ssh →
  docker compose pull && up -d`. Референс паттерна — moreminsk (донор статик-Dockerfile).
- **istok структурно уникален** среди проектов сервера: Next-приложение в `web/`, контент
  в соседнем `content/` (loader читает `../content`). Поэтому Dockerfile custom:
  build-контекст = корень репо (bun deps → node build cwd web/ → nginx:alpine копирует web/out).
- Обвязка в репо: `Dockerfile`, `.dockerignore`, `infra/nginx/{container.conf,
  new.istokmebel.by.conf}`, `infra/docker-compose.yml`, `.github/workflows/deploy.yml`
  (экшены запинены к SHA). `deploy-pages.yml` удалён, GH-Pages basePath убран.
- Заявки — без изменений: внешний `NEXT_PUBLIC_LEAD_ENDPOINT` (ADR-005), серверной части нет.

**Why цепочка, а не сразу сервер:** на момент ADR-008 своего сервера в обороте не было →
defer-complexity → GH Pages. Появился сервер → переиспользуем (тот же принцип, другой вывод).

**Карта сервера агентства** — отдельный волт `~/Desktop/sync-agency-server/` (НЕ git):
Dashboard (домены/порты), Deploy pattern (GHCR+compose), Projects/istok.md. istok там —
порт 3007, `/opt/istok/`.

**Открытые серверные шаги (на 2026-06-26, требуют доступа):** DNS A `new.istokmebel.by`→
`89.169.54.11`; секрет `DEPLOY_SSH_KEY` в репо; `/opt/istok/docker-compose.yml`; host-vhost;
`certbot --nginx`. Порт 3007 — по докам сервера, live не подтверждён (SSH-доступ к проду
требует явной авторизации пользователя).

Связано: [[project_istok_overview]], [[feedback_defer_infra_complexity]].
