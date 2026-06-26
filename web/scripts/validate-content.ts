/**
 * Валидация контента `content/products/**.mdx` против Zod-схемы (ADR-005).
 *
 * Запуск: `bun run validate:content` (из каталога web/).
 *
 * В отличие от рантайм-loader'а (src/entities/product/loader.ts), который кидает
 * на первой ошибке и пропускает unpublished, этот скрипт:
 *   - проверяет ВСЕ .mdx (включая published: false);
 *   - собирает ВСЕ ошибки разом, а не падает на первой;
 *   - дополнительно ловит дубли slug внутри категории;
 *   - выходит с кодом 1, если есть хоть одна проблема (для CI).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { Product } from "../src/entities/product/schema";

const PRODUCTS_DIR = path.resolve(process.cwd(), "..", "content", "products");

interface Issue {
  file: string;
  message: string;
}

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`✗ Каталог контента не найден: ${PRODUCTS_DIR}`);
    process.exit(1);
  }

  const files = walk(PRODUCTS_DIR);
  const issues: Issue[] = [];
  const slugsByCategory = new Map<string, Map<string, string>>();

  for (const full of files) {
    const rel = path.relative(PRODUCTS_DIR, full);
    let data: Record<string, unknown>;
    try {
      data = matter(fs.readFileSync(full, "utf8")).data;
    } catch (e) {
      issues.push({ file: rel, message: `не парсится frontmatter: ${(e as Error).message}` });
      continue;
    }

    const parsed = Product.safeParse(data);
    if (!parsed.success) {
      for (const i of parsed.error.issues) {
        issues.push({ file: rel, message: `${i.path.join(".") || "(root)"}: ${i.message}` });
      }
      continue;
    }

    // Дубли slug внутри категории ломают маршруты generateStaticParams.
    const { category, slug } = parsed.data;
    if (!slugsByCategory.has(category)) slugsByCategory.set(category, new Map());
    const seen = slugsByCategory.get(category)!;
    if (seen.has(slug)) {
      issues.push({ file: rel, message: `дубль slug "${slug}" в категории ${category} (уже в ${seen.get(slug)})` });
    } else {
      seen.set(slug, rel);
    }
  }

  if (issues.length > 0) {
    console.error(`✗ Невалидный контент — ${issues.length} проблем(ы) в ${files.length} файлах:\n`);
    for (const { file, message } of issues) console.error(`  ${file}\n    → ${message}`);
    process.exit(1);
  }

  console.log(`✓ Контент валиден: ${files.length} товаров, ошибок нет.`);
}

main();
