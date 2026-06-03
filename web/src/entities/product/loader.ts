import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { Product, type Product as ProductT, type ProductCategory } from "./schema";

const PRODUCTS_DIR = path.resolve(process.cwd(), "..", "content", "products");

let cache: ProductT[] | null = null;

function loadAll(): ProductT[] {
  if (cache) return cache;
  const products: ProductT[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        const raw = fs.readFileSync(full, "utf8");
        const { data } = matter(raw);
        const parsed = Product.safeParse(data);
        if (!parsed.success) {
          const rel = path.relative(PRODUCTS_DIR, full);
          throw new Error(
            `Invalid product ${rel}: ${parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ")}`,
          );
        }
        if (parsed.data.published) products.push(parsed.data);
      }
    }
  }

  walk(PRODUCTS_DIR);
  cache = products.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return cache;
}

export function getAllProducts(): ProductT[] {
  return loadAll();
}

export function getProductsByCategory(category: ProductCategory): ProductT[] {
  return loadAll().filter((p) => p.category === category);
}

export function getProductBySlug(
  category: ProductCategory,
  slug: string,
): ProductT | undefined {
  return loadAll().find((p) => p.category === category && p.slug === slug);
}

export type CabinetSubCategory = "komody" | "stoly" | "stelazhi" | "shkafy";
const CABINET_SUB_PATTERN = /^\/images\/(komody|stoly|stelazhi|shkafy)\//;

export function getCabinetSubCategory(p: ProductT): CabinetSubCategory | null {
  if (p.category !== "cabinets") return null;
  const m = p.hero.src.match(CABINET_SUB_PATTERN);
  return m ? (m[1] as CabinetSubCategory) : null;
}

export function getCabinetsBySub(sub: CabinetSubCategory): ProductT[] {
  return getProductsByCategory("cabinets").filter(
    (p) => getCabinetSubCategory(p) === sub,
  );
}

export function getCabinetBySubAndSlug(
  sub: CabinetSubCategory,
  slug: string,
): ProductT | undefined {
  return getCabinetsBySub(sub).find((p) => p.slug === slug);
}
