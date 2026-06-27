/**
 * Сидинг PocketBase из MDX (ADR-010, Phase 2) — одноразовый перенос
 * content/products + content/projects в PB. Чистый reseed: удаляет старые
 * записи и заливает заново. Валидация формы — теми же Zod-схемами.
 *
 * Запуск (PB на :8090, коллекции созданы scripts/pb/setup.ts):
 *   PB_ADMIN_EMAIL=admin@istok.local PB_ADMIN_PASS=... bun scripts/pb/seed.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import PocketBase from "pocketbase";
import { Product } from "../../src/entities/product/schema";
import { Project } from "../../src/entities/project/schema";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@istok.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";
const CONTENT = path.resolve(process.cwd(), "..", "content");

const pb = new PocketBase(URL);
pb.autoCancellation(false);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile() && e.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

async function clearCollection(name: string) {
  // Удаляем пачкой (на dev-объёмах хватает простого цикла).
  const all = await pb.collection(name).getFullList({ fields: "id" });
  for (const r of all) await pb.collection(name).delete(r.id);
  return all.length;
}

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован");

  // ── products ──
  console.log(`× products: удалено ${await clearCollection("products")}`);
  let okP = 0;
  for (const file of walk(path.join(CONTENT, "products"))) {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const parsed = Product.safeParse(data);
    if (!parsed.success) {
      console.error(`  ✗ ${path.relative(CONTENT, file)}: ${parsed.error.issues[0]?.message}`);
      continue;
    }
    await pb.collection("products").create(parsed.data);
    okP++;
  }
  console.log(`✓ products: залито ${okP}`);

  // ── projects ──
  console.log(`× projects: удалено ${await clearCollection("projects")}`);
  let okPr = 0;
  for (const file of walk(path.join(CONTENT, "projects"))) {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const parsed = Project.safeParse(data);
    if (!parsed.success) {
      console.error(`  ✗ ${path.relative(CONTENT, file)}: ${parsed.error.issues[0]?.message}`);
      continue;
    }
    await pb.collection("projects").create(parsed.data);
    okPr++;
  }
  console.log(`✓ projects: залито ${okPr}`);
  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});
