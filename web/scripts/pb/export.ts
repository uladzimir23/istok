/**
 * Prebuild-экспорт PocketBase → JSON-снапшот + фото (ADR-010/011, static+rebuild).
 * Loader'ы читают снапшот синхронно; фото из PB file-полей скачиваются в
 * public/images/pb/<slug>/ и бандлятся в статику.
 *
 * Запуск (PB на :8090): bun scripts/pb/export.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import PocketBase from "pocketbase";
import { Product } from "../../src/entities/product/schema";
import { Project } from "../../src/entities/project/schema";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const OUT = path.resolve(process.cwd(), ".pb");
const PUBLIC_PB = path.resolve(process.cwd(), "public", "images", "pb");

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// PB-запись → чистый объект под Zod: убираем системные/служебные поля, пустые
// optional-числа (PB отдаёт 0) → undefined.
function clean(r: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...r };
  for (const k of ["id", "collectionId", "collectionName", "created", "updated", "expand", "photos"]) {
    delete out[k];
  }
  if (out.priceByn === 0) delete out.priceByn;
  if (out.weight === 0) delete out.weight;
  if (out.summary === "") delete out.summary;
  return out;
}

async function downloadPhotos(id: string, slug: string, photos: string[]): Promise<string> {
  const dir = path.join(PUBLIC_PB, slug);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of photos) {
    const res = await fetch(`${URL}/api/files/products/${id}/${f}`);
    if (!res.ok) continue;
    fs.writeFileSync(path.join(dir, f), Buffer.from(await res.arrayBuffer()));
  }
  return `/images/pb/${slug}`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const rawProducts = await pb.collection("products").getFullList({ sort: "name" });
  const products = [];
  for (const r of rawProducts) {
    const obj = clean(r);
    const photos = (r.photos as string[]) ?? [];
    if (photos.length) {
      // PB-фото перекрывают legacy-пути: первое — обложка (hero), все — gallery.
      const base = await downloadPhotos(r.id as string, r.slug as string, photos);
      obj.hero = { src: `${base}/${photos[0]}`, alt: obj.name };
      obj.gallery = photos.map((f) => ({ src: `${base}/${f}`, alt: obj.name }));
    }
    products.push(Product.parse(obj));
  }
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
