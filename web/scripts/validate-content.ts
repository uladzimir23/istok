/**
 * validate-content.ts — валидация всех content/products/*.mdx по Zod-схеме.
 *
 * Запуск из корня репо: `bun web/scripts/validate-content.ts`.
 * Возвращает exit-code 0 если всё валидно, 1 если есть ошибки.
 *
 * Используется в pre-commit (lefthook) и CI после имплементации.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import type { ZodIssue } from "zod";
import { Product } from "../src/lib/content/schema";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const PRODUCTS_DIR = path.join(REPO_ROOT, "content/products");

let total = 0;
let failed = 0;
const errors: string[] = [];

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      total++;
      const raw = fs.readFileSync(full, "utf8");
      const { data } = matter(raw);
      const result = Product.safeParse(data);
      if (!result.success) {
        failed++;
        const rel = path.relative(REPO_ROOT, full);
        const issues = result.error.issues.map((i: ZodIssue) => `    - ${i.path.join(".")}: ${i.message}`).join("\n");
        errors.push(`✗ ${rel}\n${issues}`);
      }
    }
  }
}

walk(PRODUCTS_DIR);

if (failed === 0) {
  console.log(`✓ All ${total} product MDX files valid against schema.`);
  process.exit(0);
} else {
  console.error(`\n${failed} of ${total} product MDX files invalid:\n`);
  console.error(errors.join("\n\n"));
  process.exit(1);
}
