---
title: ADR-011 — Custom Admin SPA over PocketBase
description: Кастомная клиентская SPA-админка (Vite + React + PocketBase SDK) для нетехнического редактора фабрики — удобный CRUD каталога поверх PB API без серверного рантайма.
order: 11
status: proposed
date: 2026-06-27
---

# ADR-011 — Custom Admin SPA over PocketBase

## Контекст

ADR-010 активировал PocketBase как БД и rebuild-webhook для Phase 2. Встроенная PB Admin
UI решает задачу хранения данных, но остаётся **технической**: коллекции, поля, фильтры,
JSON-view — интерфейс для разработчика, не для контент-менеджера фабрики.

Триггер №1 из ADR-005 («редактор фабрики без git») требует **удобного «человеческого»
интерфейса**: список товаров → форма с понятными полями (название, цена, материалы,
фото) → «Сохранить». Сырая PB Admin UI этому требованию не отвечает и открывает
редактору всю внутреннюю кухню (схема коллекций, системные поля, настройки).

Дополнительный вопрос, возникший при планировании: нужна ли **Prisma** как ORM-слой
между Next.js и PocketBase? Ответ — нет (см. отвергнутые варианты C).

## Варианты

### A. Кастомная клиентская SPA поверх PocketBase (выбран)
- Плюсы: удобный UX редактора (только нужные поля, локализованные лейблы, без
  технической кухни); PB API-rules — единственный security-гейт; хостинг ADR-009 и
  модель ADR-010 не меняются; static export `admin/out` на том же сервере (новый vhost
  `admin.istokmebel.by`); Zod-схемы из `web/src/entities/*/schema.ts` переиспользуются
  для валидации форм — один источник правды о структуре данных; нет серверного рантайма.
- Минусы: нужно собрать UI (логин, формы), ~3–5 дней разработки; поддержка отдельного
  приложения; фото-пайплайн (PB file-поля vs `public/images`) — открытый пункт, решается
  отдельно.

### B. Сырая PB Admin UI с ролью editor
- Плюсы: ноль кода, готово немедленно; может служить временным fallback.
- Минусы: технический интерфейс (коллекции / поля / JSON) неудобен нетехническому
  редактору; видна вся внутренняя кухня PocketBase, включая системные настройки;
  не соответствует требованию триггера №1 («удобная админка»). Вариант A —
  это то, зачем вообще затевалась Phase 2.

### C. Prisma + кастомный Next/Node-бэкенд
- Плюсы: привычный ORM-паттерн, типы из схемы.
- Минусы: PocketBase уже даёт БД + API + auth + Admin; Prisma — ORM для
  самостоятельной SQL-БД, он дублирует уровень доступа и **обходит PB-rules/hooks**,
  нарушая security-модель PocketBase. Конфликтует с PB-миграциями; требует отдельный
  Node-рантайм; противоречит принципу «без собственного backend» (ADR-001/005/010).
  Это третий лишний слой данных там, где PocketBase JS SDK + Zod достаточно.
  Отвергнут окончательно.

### D. Headless SaaS CMS (Sanity / Contentful)
- Плюсы: managed, встроенное превью контента.
- Минусы: вендор-лок, ценник, SaaS-зависимость, дублирует PB. Уже отвергнут в ADR-005.
  Закрытая ветка.

## Решение

Выбираем **A. Кастомная клиентская SPA поверх PocketBase.**

Отдельное мини-приложение `admin/` в корне репо (рядом с `web/`, по правилу ADR-007 —
без монорепо-тулинга). Стек: **Vite + React + `pocketbase` JS SDK + react-hook-form + Zod**.
Редактор логинится через PB-авторизацию (отдельный user с ролью `editor`); CRUD каталога
идёт напрямую из браузера через PocketBase REST API — серверный рантайм не нужен.
PB API-rules ограничивают editor только коллекциями `product` и `project`; системные
настройки PB редактору недоступны.

Выбор обоснован тем, что Admin SPA — единственный подход, при котором нетехнический
редактор получает UX, а не технический инструмент. При этом архитектурная модель
ADR-009 (static export + nginx:alpine) и ADR-010 (rebuild-webhook) не меняются:
SPA собирается в `admin/dist` и раздаётся вторым nginx-vhost на `admin.istokmebel.by`
на том же сервере. «Сохранить» в форме → PB API → webhook → пересборка публичного сайта
(ADR-010). Zod-схемы из `web/src/entities/*/schema.ts` переиспользуются в формах —
изменение структуры данных не расходится между публичным сайтом и адм.

## Последствия

**Что делаем:**

- Новое приложение `admin/` (Vite SPA): `admin/src/`, `admin/package.json`,
  `admin/vite.config.ts`. Собирается в `admin/dist/`.
- В `admin/` — три экрана MVP: логин, список товаров (таблица + кнопка «Изменить»),
  форма редактирования товара (name / summary / priceByn / published / materials /
  options / colors). Список и форма проектов — второй приоритет.
- PocketBase: auth-коллекция или поле `role: "editor"` в users; API-rules для collections
  `product` и `project`: list / view / create / update / delete для editor; для superuser —
  всё. Схема в `infra/pb-schema/` (уже предусмотрено ADR-010).
- Деплой `admin/dist`: nginx vhost `admin.istokmebel.by` на сервере агентства (тот же
  `89.169.54.11`) + certbot; либо отдельный контейнер `nginx:alpine` в compose-стеке
  истока. Метод выбирается при имплементации.
- CI/CD: отдельный workflow `admin-deploy.yml` или расширение `deploy.yml` вторым job-ом
  `build-admin` → копирование `admin/dist` на сервер.
- **Фото — открытый пункт.** PB file-поля vs текущие пути `public/images/` влияют на
  схему gallery/hero и image-pipeline билда. Решается отдельно перед имплементацией
  фото-загрузки в форме.

**Что НЕ делаем:**

- Не добавляем серверный рантайм — ни Node, ни PHP.
- Не устанавливаем Prisma / любой ORM, работающий поверх PocketBase.
- Не даём редактору доступ к системным настройкам PB (schema editor, hooks, users).
- Не собираем `admin/` в монорепо-тулинге (turborepo и т. п.) — ADR-007 в силе.
- Не расширяем MVP выходом за рамки CRUD каталога (корзина, аналитика, медиа-менеджер)
  до явного бизнес-триггера.

**Обратимость: лёгкая.** Admin SPA изолирована: публичный сайт и PocketBase от неё
не зависят. В крайнем случае редактор переключается на сырую PB Admin UI (вариант B)
без изменения кода; удаление `admin/` не затрагивает `web/` или `infra/`.

**Кто затронут:**

- Редактор фабрики — главный бенефициар; получает понятный CRUD каталога без git.
- Разработка — сборка SPA, формы, интеграция PB SDK, Zod-переиспользование.
- DevOps — поддомен `admin.istokmebel.by`: vhost, certbot, CI-job или compose-сервис.

## Имплементация

Не начата. Стартует после ADR-010 (PocketBase на сервере, collections созданы).

Шаги:

1. Scaffolding: `bun create vite admin --template react-ts`; установить `pocketbase`,
   `react-hook-form`, `zod`, `@hookform/resolvers`.
2. PocketBase: настроить роль editor, API-rules для product/project.
3. Экран логина: `pb.collection("users").authWithPassword(...)`, сохранение authStore.
4. Список товаров: `pb.collection("product").getList(...)`, таблица с пагинацией.
5. Форма товара: поля из `web/src/entities/product/schema.ts`; валидация через Zod;
   `pb.collection("product").update(id, data)`.
6. Список + форма проектов — аналогично.
7. Поднять `admin.istokmebel.by` на сервере (vhost / контейнер, certbot).
8. CI-job деплоя `admin/dist`.
9. Решить фото-пайплайн (PB files vs public/images) — отдельный ADR или пункт в impl.

## Связанные

- [[ADR-010 PocketBase Activation Phase 2 Static Rebuild]] — Admin SPA пишет в PB
  и косвенно триггерит rebuild публичного сайта через webhook ADR-010.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — принцип «без своего backend»;
  обоснование отказа от Prisma / custom-backend (вариант C в этом ADR).
- [[ADR-009 Hetzner Agency Server Hosting]] — деплой `admin.istokmebel.by` на
  тот же сервер; публичный сайт остаётся static.
- [[ADR-007 Flat Repo Structure No Monorepo]] — `admin/` рядом с `web/` без
  монорепо-тулинга.
- [[Dashboard]]
