---
description: PocketBase Phase 2 для istok — модель «static export + rebuild-webhook». Активировать при работе над БД/админкой каталога, collections, миграцией MDX→PB, build-time loader'ами, rebuild-хуком. Канон — ADR-010.
---

# Skill: PocketBase (istok, Phase 2)

> Архитектура зафиксирована в [[ADR-010 PocketBase Activation Phase 2 Static Rebuild]].
> istok — **не SaaS**: каталог-витрина. PB = БД + админка для редактора фабрики.
> Сайт остаётся **static export** (`output: "export"`, хостинг ADR-009 не меняется).

## Главный принцип: данные читаются НА БИЛДЕ, не в рантайме

```
Редактор фабрики → PB Admin UI (правит товар/цену/фото)
   → PB hook (onRecordAfter*) → GitHub repository_dispatch
   → deploy.yml пересобирает образ (build читает PB) → редеплой статики
   → правка видна на new.istokmebel.by через ~минуты
```

Поэтому в коде istok **нет клиентского PB SDK** (в отличие от flex-glass) и нет
рантайм-запросов. Только серверное чтение во время `next build` (SSG/generateStaticParams).

## Отличия от flex-glass (донор паттерна)

flex-glass — multi-user SaaS: auth, tokenBalance, realtime, soft-delete, generation_tasks.
**Ничего из этого istok НЕ нужно.** Берём из flex-glass только: формат PB-миграций,
паттерн серверного SDK-клиента (`getServerPB`), структуру `pb_data`/бэкапов.

## Коллекции (зеркало Zod-схем)

| Коллекция | Источник схемы | Ключевые поля |
|-----------|----------------|---------------|
| `products` | `web/src/entities/product/schema.ts` | slug, category(enum), brand(enum), name, summary, sizes(json), materials(json), colors(json), options(json), gallery(json/files), hero, priceByn, published, indexable, updatedAt |
| `projects` | `web/src/entities/project/schema.ts` | slug, order, objectType, city, year, delivered, hero, summary, published |

- Сложные поля (`sizes`, `gallery`, `colors`) — тип `json` в PB (Zod уже валидирует форму).
  Фото — либо `file`-поля PB, либо `json` с путями (если картинки остаются в `public/`).
- **API read-rule — публичная** (`@request.auth.id != "" || true` → пусто = public list/view),
  т.к. читает билд-процесс. Create/Update/Delete — только редактор/админ (см. роли).
- Slug — уникальный индекс в рамках category (products) / глобально (projects).

## Build-time loader (замена fs-loader'ов)

`entities/*/loader.ts` сейчас читают `content/**.mdx`. В Phase 2 — читают PB на билде:

```ts
// web/src/shared/lib/pocketbase.ts  (server-only, build-time)
import PocketBase from "pocketbase";
export function getBuildPB() {
  const pb = new PocketBase(process.env.PB_URL); // internal URL, передаётся в build
  pb.autoCancellation(false);
  return pb;
}

// entities/product/loader.ts
const pb = getBuildPB();
const records = await pb.collection("products").getFullList({ sort: "name", filter: "published = true" });
// → валидируем через ту же Zod-схему Product.parse(...) (схема остаётся источником формы)
```

Zod-схемы НЕ выкидываем — валидируем PB-ответ на билде (ловим дрейф схемы коллекции).

## Миграция MDX → PB (одноразовый сидинг)

Скрипт `web/scripts/migrate-mdx-to-pb.ts`: читает `content/**.mdx` (текущий loader),
для каждого — `pb.collection(...).create(...)` через admin-клиент. Запускается один раз
после поднятия PB. После проверки — MDX-каталог ретайрится (git остаётся для кода).

## Rebuild-хук (PB → пересборка)

`pb_hooks/rebuild.pb.js` на сервере:
```js
function triggerRebuild() {
  $http.send({
    url: "https://api.github.com/repos/uladzimir23/istok/dispatches",
    method: "POST",
    headers: { Authorization: "token " + $os.getenv("GH_DISPATCH_TOKEN"), "Accept": "application/vnd.github+json" },
    body: JSON.stringify({ event_type: "content-changed" }),
  });
}
onRecordAfterCreateSuccess((e) => { triggerRebuild(); e.next(); }, "products", "projects");
onRecordAfterUpdateSuccess((e) => { triggerRebuild(); e.next(); }, "products", "projects");
onRecordAfterDeleteSuccess((e) => { triggerRebuild(); e.next(); }, "products", "projects");
```
`deploy.yml` получает `on: repository_dispatch: { types: [content-changed] }`. Дебаунс
ребилдов — через concurrency group (уже есть) + опционально задержку.

## Инфра (на сервере 89.169.54.11, ADR-009/ADR-010)

- Сервис `pocketbase` в `/opt/istok/docker-compose.yml`: образ PB, порт `127.0.0.1:8093`
  (следующий свободный: 8090/8091/8092 заняты — см. sync-agency-server Dashboard),
  volume `pb_data`, restart unless-stopped.
- Бэкап `pb_data` — cron-снапшот (локально на сервере; S3 — опция, решить при impl).
- Admin UI доступ для редактора фабрики — **поддомен** `admin.istokmebel.by` (vhost +
  certbot), НЕ SSH-туннель (редактор нетехнический). Решить при impl.
- `PB_URL` для билда — internal Docker URL (напр. `http://pocketbase:8090`), передаётся
  в Dockerfile build-stage как build-arg (билд идёт в CI — нужен доступ к PB; вариант:
  билдить на сервере рядом с PB, либо экспонировать read-only endpoint).
  ⚠️ Это ключевой impl-вопрос: CI билдит в GitHub Actions, а PB на сервере → решить,
  как билд достучится до PB (туннель / временный публичный read / билд на сервере).

## Роли

- **superuser** (мы) — полный доступ.
- **Редактор фабрики** — отдельная auth-коллекция / правило: edit на `products`/`projects`,
  без доступа к настройкам. Цель Phase 2 — чтобы фабрика правила каталог сама.

## Чего НЕ делаем в этой фазе

Корзина, заказы, оплата, личный кабинет покупателя, маркетплейс-sync — это отдельные
триггеры Phase 2+ (ADR-005), не входят в ADR-010. Заявки остаются на внешнем endpoint.

## Связанное
- [[ADR-010 PocketBase Activation Phase 2 Static Rebuild]] — канон решения.
- [[ADR-005 Content-as-Code Phase 1 No Backend]] — триггеры, которые активировали Phase 2.
- Донор паттерна: `~/Documents/flex-glass/` (pb_migrations, lib/pocketbase, skill).
