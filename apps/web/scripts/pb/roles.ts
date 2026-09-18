/**
 * Роль «editor» (ADR-011): отдельная auth-коллекция `editors` для редактора
 * фабрики + правила записи на products/projects только для авторизованных
 * (editor / superuser). Публичный read для билда сохраняется.
 *
 * Запуск (PB на :8090):
 *   PB_ADMIN_EMAIL=admin@istok.local PB_ADMIN_PASS=... bun scripts/pb/roles.ts
 * Опционально создаёт editor:
 *   ... EDITOR_EMAIL=editor@istok.local EDITOR_PASS=... bun scripts/pb/roles.ts
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@istok.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// Запись — авторизованным (editor или superuser-через-API); read — публичный.
const WRITE = '@request.auth.id != ""';

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован");

  // 1. Коллекция editors (auth).
  const exists = await pb.collections.getList(1, 1, { filter: 'name="editors"' });
  if (exists.totalItems === 0) {
    await pb.collections.create({
      name: "editors",
      type: "auth",
      fields: [{ name: "name", type: "text" }],
      // Редактор не самрегистрируется; заводит админ.
      createRule: null,
      listRule: null,
      viewRule: '@request.auth.id = id',
      updateRule: '@request.auth.id = id',
      deleteRule: null,
      passwordAuth: { enabled: true, identityFields: ["email"] },
    });
    console.log("✓ коллекция editors создана");
  } else {
    console.log("• editors уже есть");
  }

  // 2. Правила записи на каталог.
  for (const name of ["products", "projects"]) {
    await pb.collections.update(name, {
      listRule: "",
      viewRule: "",
      createRule: WRITE,
      updateRule: WRITE,
      deleteRule: WRITE,
    });
    console.log(`✓ ${name}: write-правила для авторизованных`);
  }

  // 3. Опциональный editor-пользователь.
  const ee = process.env.EDITOR_EMAIL;
  const ep = process.env.EDITOR_PASS;
  if (ee && ep) {
    const has = await pb
      .collection("editors")
      .getList(1, 1, { filter: `email="${ee}"` })
      .catch(() => ({ totalItems: 0 }));
    if (has.totalItems === 0) {
      await pb.collection("editors").create({
        email: ee,
        password: ep,
        passwordConfirm: ep,
        name: "Редактор фабрики",
      });
      console.log(`✓ editor ${ee} создан`);
    } else {
      console.log(`• editor ${ee} уже есть`);
    }
  }
  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});
