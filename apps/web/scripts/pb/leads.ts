/**
 * Коллекция `leads` — инбокс заявок (ADR-011 #10, триггер №3 ADR-005).
 * Публичный create (форма сайта шлёт), read/update — авторизованным (editor).
 * Опционально сидит сэмплы (SEED=1). Запуск:
 *   PB_ADMIN_EMAIL=admin@istok.local PB_ADMIN_PASS=... [SEED=1] bun scripts/pb/leads.ts
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@istok.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);

  const has = await pb.collections.getList(1, 1, { filter: 'name="leads"' });
  if (has.totalItems === 0) {
    await pb.collections.create({
      name: "leads",
      type: "base",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "phone", type: "text", required: true },
        { name: "email", type: "text" },
        { name: "message", type: "text" },
        { name: "source", type: "text" },
        { name: "productSlug", type: "text" },
        { name: "status", type: "select", maxSelect: 1, values: ["new", "progress", "done"] },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      ],
      // Форма сайта создаёт заявку без авторизации; читают/правят — editor/admin.
      createRule: "",
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    });
    console.log("✓ коллекция leads создана");
  } else {
    console.log("• leads уже есть");
  }

  if (process.env.SEED === "1") {
    const samples = [
      { name: "Анна Петрова", phone: "+375 29 111-22-33", email: "anna@dk-minsk.by", message: "Нужны кресла М3-1 в зал на 240 мест, госзаказ.", source: "contacts", productSlug: "m3-1", status: "new" },
      { name: "Игорь С.", phone: "+375 33 444-55-66", email: "", message: "Цена на комод с 4 ящиками, 10 шт.", source: "komody", productSlug: "s-4-yaschikami", status: "new" },
      { name: "Мария", phone: "+375 44 777-88-99", email: "maria@example.by", message: "Кроватка Афина, 1800×800 — сроки?", source: "krovatki", productSlug: "afina", status: "progress" },
    ];
    for (const s of samples) await pb.collection("leads").create(s);
    console.log(`✓ засеяно ${samples.length} заявок`);
  }
  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});
