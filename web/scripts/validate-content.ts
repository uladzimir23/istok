/**
 * Валидация контента `content/**.mdx` против Zod-схем (ADR-005).
 *
 * Запуск: `bun run validate:content` (из каталога web/).
 *
 * В отличие от рантайм-loader'ов (src/entities/<entity>/loader.ts), которые кидают на
 * первой ошибке и пропускают unpublished, этот скрипт:
 *   - проверяет ВСЕ .mdx (включая published: false);
 *   - собирает ВСЕ ошибки разом, а не падает на первой;
 *   - ловит дубли slug (в рамках группы);
 *   - выходит с кодом 1, если есть хоть одна проблема (для CI).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { Product } from "../src/entities/product/schema";
import { Project } from "../src/entities/project/schema";

const CONTENT = path.resolve(process.cwd(), "..", "content");

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

// Валидирует один каталог контента против схемы; slug уникален в рамках
// группы (groupKey возвращает ключ-группу для проверки дублей маршрутов).
function validateDir<T extends { slug: string }>(
  dir: string,
  schema: z.ZodType<T>,
  groupKey: (d: T) => string,
  issues: Issue[],
): number {
  if (!fs.existsSync(dir)) return 0;
  const files = walk(dir);
  const slugsByGroup = new Map<string, Map<string, string>>();

  for (const full of files) {
    const rel = path.relative(CONTENT, full);
    let data: Record<string, unknown>;
    try {
      data = matter(fs.readFileSync(full, "utf8")).data;
    } catch (e) {
      issues.push({ file: rel, message: `не парсится frontmatter: ${(e as Error).message}` });
      continue;
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      for (const i of parsed.error.issues) {
        issues.push({ file: rel, message: `${i.path.join(".") || "(root)"}: ${i.message}` });
      }
      continue;
    }

    const group = groupKey(parsed.data);
    if (!slugsByGroup.has(group)) slugsByGroup.set(group, new Map());
    const seen = slugsByGroup.get(group)!;
    if (seen.has(parsed.data.slug)) {
      issues.push({
        file: rel,
        message: `дубль slug "${parsed.data.slug}" в группе ${group} (уже в ${seen.get(parsed.data.slug)})`,
      });
    } else {
      seen.set(parsed.data.slug, rel);
    }
  }

  return files.length;
}

function main() {
  const issues: Issue[] = [];
  const products = validateDir(
    path.join(CONTENT, "products"),
    Product,
    (p) => p.category,
    issues,
  );
  const projects = validateDir(
    path.join(CONTENT, "projects"),
    Project,
    () => "projects",
    issues,
  );

  if (issues.length > 0) {
    console.error(`✗ Невалидный контент — ${issues.length} проблем(ы):\n`);
    for (const { file, message } of issues) console.error(`  ${file}\n    → ${message}`);
    process.exit(1);
  }

  console.log(`✓ Контент валиден: ${products} товаров, ${projects} проектов, ошибок нет.`);
}

main();
