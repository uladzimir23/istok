/**
 * Prebuild-экспорт PocketBase → JSON-снапшот для билда (ADR-010, static+rebuild).
 * Loader'ы читают этот снапшот синхронно (без async-рефактора страниц).
 * Поток: правка в PB admin → (webhook) → export → next build → деплой статики.
 *
 * Запуск (PB на :8090): bun scripts/pb/export.ts
 * Пишет web/.pb/{products,projects}.json (gitignored). Валидирует Zod.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import PocketBase from "pocketbase";
import { Product } from "../../src/entities/product/schema";
import { Project } from "../../src/entities/project/schema";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const OUT = path.resolve(process.cwd(), ".pb");

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// PB-запись → чистый объект под Zod: убираем системные поля, пустые
// optional-числа (PB отдаёт 0) → undefined.
function clean(r: Record<string, unknown>) {
  const {
    id,
    collectionId,
    collectionName,
    created,
    updated,
    expand,
    ...rest
  } = r;
  void id; void collectionId; void collectionName; void created; void updated; void expand;
  if (rest.priceByn === 0) delete rest.priceByn;
  if (rest.weight === 0) delete rest.weight;
  if (rest.summary === "") delete rest.summary;
  return rest;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const rawProducts = await pb.collection("products").getFullList({ sort: "name" });
  const products = rawProducts.map((r) => Product.parse(clean(r)));
  fs.writeFileSync(path.join(OUT, "products.json"), JSON.stringify(products, null, 2));
  console.log(`✓ products: ${products.length} → .pb/products.json`);

  const rawProjects = await pb.collection("projects").getFullList({ sort: "order" });
  const projects = rawProjects.map((r) => Project.parse(clean(r)));
  fs.writeFileSync(path.join(OUT, "projects.json"), JSON.stringify(projects, null, 2));
  console.log(`✓ projects: ${projects.length} → .pb/projects.json`);
  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});
