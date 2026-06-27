---
name: sync-agency-server-vault
description: Общий Hetzner-сервер агентства SYNC (89.169.54.11) + его docs-волт. Канон деплоя GHCR+compose. istok деплоится сюда (ADR-009).
metadata: 
  node_type: memory
  type: reference
  originSessionId: de4cb502-47f9-4090-9993-28c8904c334a
---

**Сервер агентства SYNC** — общий Hetzner-бокс `89.169.54.11` (Ubuntu 24.04), host-nginx
+ certbot как reverse proxy, по одному Docker-стеку в `/opt/<project>/`. На нём живут
moreminsk, comforthotel-landing, clariva-landing/old, flex-glass, sync-brand-site, auction-
platform, n8n и др. Доступ: `ssh -i ~/.ssh/hetzner_flexglass root@89.169.54.11` (юзер деплоя —
`deploy`). **SSH к этому проду требует явной авторизации пользователя** (auto-classifier
блокирует даже read-only без неё).

**Docs-волт** — `~/Desktop/sync-agency-server/` (НЕ git-репо, просто папка с docs/ + CLAUDE.md).
Ключевое:
- `docs/00 - Indexes/Dashboard.md` — таблица доменов/портов/контейнеров (источник истины
  по занятым портам), стеки, текущие задачи.
- `docs/40 - Architecture/Deploy pattern (GHCR + compose).md` — **канон деплоя**: push main →
  Actions (docker build multi-stage → GHCR) → appleboy ssh-action → `compose pull && up -d`.
  Секрет в репо проекта — `DEPLOY_SSH_KEY`; GHCR-auth через эфемерный GITHUB_TOKEN.
- `docs/50 - Runbooks/Новый сайт на поддомене.md` — чеклист подъёма поддомена.
- `docs/20 - Projects/<project>.md` — заметки по проектам (есть istok.md).

**Порты:** 3001 sync-brand, 3002 flex-glass, 3003 comforthotel, 3004 moreminsk,
3005 clariva, 3006 clariva-old, **3007 istok**. Новый проект — следующий свободный,
фиксировать в Dashboard ДО деплоя.

**Правила волта:** без секретов (ключи/токены — только пути); read-only по умолчанию,
state-changing команды на сервере — по явной задаче; задеплоил — обнови Dashboard в тот же день.

**Референсы паттерна (репо):** moreminsk (статик-Dockerfile, nginx:alpine — донор для istok),
clariva-spa-landing (standalone-вариант, когда нужен Node/api). sync-brand-site-v2 —
НЕ канон (сборка на сервере, старый пайплайн).

Связано: [[project_istok_static_pages_pivot]], [[reference_user_projects]].
