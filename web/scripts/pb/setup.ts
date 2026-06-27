/**
 * Создаёт коллекции PocketBase `products` + `projects` — зеркало Zod-схем
 * (ADR-010, Phase 2). Идемпотентно: существующие пропускает.
 *
 * Запуск (PB поднят на :8090):
 *   PB_ADMIN_EMAIL=admin@istok.local PB_ADMIN_PASS=... bun scripts/pb/setup.ts
 *
 * Сложные поля (sizes/gallery/colors/hero) — тип json: форму валидирует Zod
 * на билде (loader), PB хранит как JSON. Так схема PB простая и стабильная.
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@istok.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

const T = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  type: "text",
  ...extra,
});
const NUM = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  type: "number",
  ...extra,
});
const JSON_ = (name: string, required = false) => ({
  name,
  type: "json",
  required,
  maxSize: 2_000_000,
});
const BOOL = (name: string) => ({ name, type: "bool" });
const SELECT = (name: string, values: string[], required = true) => ({
  name,
  type: "select",
  required,
  maxSelect: 1,
  values,
});

const COLLECTIONS = [
  {
    name: "products",
    type: "base",
    fields: [
      T("slug", { required: true }),
      SELECT("category", ["chairs", "cabinets", "cribs"]),
      SELECT("brand", ["istok", "elis"]),
      T("name", { required: true }),
      T("summary"),
      JSON_("sizes", true),
      NUM("weight"),
      JSON_("materials"),
      JSON_("colors"),
      JSON_("options"),
      JSON_("gallery", true),
      JSON_("hero", true),
      NUM("priceByn"),
      BOOL("published"),
      BOOL("indexable"),
      T("updatedAt"),
    ],
    // slug уникален в рамках категории (как в content-валидаторе).
    indexes: [
      "CREATE UNIQUE INDEX `idx_products_slug_cat` ON `products` (`slug`, `category`)",
    ],
  },
  {
    name: "projects",
    type: "base",
    fields: [
      T("slug", { required: true }),
      NUM("order", { required: true }),
      T("objectType", { required: true }),
      T("city", { required: true }),
      NUM("year", { required: true }),
      T("delivered", { required: true }),
      JSON_("hero", true),
      T("summary"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_projects_slug` ON `projects` (`slug`)"],
  },
] as const;

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован суперюзером");

  for (const col of COLLECTIONS) {
    const existing = await pb.collections.getList(1, 1, {
      filter: `name="${col.name}"`,
    });
    if (existing.totalItems > 0) {
      console.log(`• ${col.name} уже есть — пропускаю`);
      continue;
    }
    // Публичный read (билд читает без авторизации), запись — только админ.
    await pb.collections.create({
      ...col,
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    console.log(`✓ создана коллекция ${col.name}`);
  }
  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});
