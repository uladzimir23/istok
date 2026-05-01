/**
 * seed-from-tilda.ts — одноразовый сидинг content/products/*.mdx из локального
 * экспорта Tilda + PDF-каталога ELIS.
 *
 * Запуск из корня репо:
 *   bun web/scripts/seed-from-tilda.ts
 *
 * Что делает:
 * 1. Парсит tilda-old/istokmebel/htaccess → mapping page-NNN.html → URL.
 * 2. Для каждой product-страницы (chairs / cabinets / cribs):
 *    - извлекает title из <title>;
 *    - собирает все референсы на images/* в HTML, копирует уникальные в
 *      web/public/images/<categoryDir>/<slug>/01.png, 02.png, ...
 *    - для категории cribs дополняет данными из CRIB_DATA (специфики моделей
 *      из PDF-каталога — размеры, вес, материалы, опции);
 *    - для chairs / cabinets создаёт stub-MDX с фронтматтером по schema.ts
 *      и комментарием «требуется ревью контента» в теле.
 * 3. Пишет MDX в content/products/<category>/<slug>.mdx.
 *
 * Идемпотентность: при повторном запуске MDX и фото перезаписываются.
 * Файлы выходят валидируемыми по Zod-схеме content/schema.ts.
 *
 * Reference: ADR-005 Content-as-Code Phase 1; docs/40 - Architecture/Карта URL.md
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as cheerio from "cheerio";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const TILDA = path.join(REPO_ROOT, "tilda-old/istokmebel");
const CONTENT = path.join(REPO_ROOT, "content");
const PUBLIC_IMG = path.join(REPO_ROOT, "web/public/images");

/* ---------- Маппинг htaccess ---------- */

interface PageMap {
  page: string; // "page98453286.html"
  url: string;  // "child-beds/nikole"
}

function parseHtaccess(): PageMap[] {
  const text = fs.readFileSync(path.join(TILDA, "htaccess"), "utf8");
  const result: PageMap[] = [];
  const seen = new Set<string>();
  const re = /^RewriteRule\s+\^([^$]+?)\$\s+(page\d+\.html)\s+\[NC\]/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const url = m[1].replace(/\/$/, ""); // strip trailing slash
    const key = `${m[2]}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ page: m[2], url });
  }
  return result;
}

/* ---------- Маппинг URL → продукт ---------- */

interface ProductRoute {
  category: "chairs" | "cabinets" | "cribs";
  categoryDir: string; // url-segment в новом сайте
  slug: string;
  brand: "istok" | "elis";
}

const CRIB_SLUG_MAP: Record<string, string> = {
  nikole: "nikol",
  melita: "melita",
  paulina: "paulina",
  elsa: "elza",
  dominika: "dominika",
  afina: "afina",
  yasmina: "yasmina",
  mishele: "mishel",
};

const CABINET_SUBCATEGORY_MAP: Record<string, string> = {
  komody: "komody",
  stoly: "stoly",
  stelazy: "stelazhi",
  shkafy: "shkafy",
};

function shortenCabinetSlug(rawSlug: string, prefix: string): string {
  // "komod-s-odnoy-dvercey-i-chetyrmya-jaschikamy" + prefix "komod-"
  // → "s-dvercey-i-4-yaschikami"
  let slug = rawSlug.replace(new RegExp(`^${prefix}-?`), "");
  // Сначала составные паттерны (до того как их компоненты будут перетёрты)
  slug = slug
    .replace(/-bolshoy-i-malenkoy-/g, "-dvumya-")
    .replace(/-i-dvymya-vydvizhnymi-yaschikami/g, "-i-yaschikami")
    .replace(/-vydvizhnymi-yaschikami/g, "-yaschikami")
    .replace(/-vydviznymi-yaschichkami/g, "-yaschikami")
    .replace(/-vydviznym-yaschichkom/g, "-yaschikom")
    .replace(/-vydvizhnym-yaschichkom/g, "-yaschikom");
  // Затем атомарные нормализации
  slug = slug
    .replace(/odnoy-/g, "")
    .replace(/chetyrmya/g, "4")
    .replace(/tremya/g, "3")
    .replace(/dvuma/g, "2")
    .replace(/malenkoy/g, "maloy")
    .replace(/-bolshoy-/g, "-")
    .replace(/jaschikamy/g, "yaschikami")
    .replace(/yaschichkamy/g, "yaschikami")
    .replace(/yaschichkami/g, "yaschikami")
    .replace(/yaschichkom/g, "yaschikom")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
  return slug;
}

function routeForUrl(url: string): ProductRoute | null {
  // Театральные кресла
  let m = url.match(/^chairs\/model-(.+)$/);
  if (m) return { category: "chairs", categoryDir: "kresla", slug: m[1], brand: "istok" };

  // Legacy URL кресел (без префикса)
  m = url.match(/^model-(m1|m2|m3|m3g|m31|pm1)$/);
  if (m) {
    const legacyMap: Record<string, string> = {
      m1: "m1", m2: "m2", m3: "m3", m3g: "m3-g", m31: "m3-1", pm1: "pm-1",
    };
    return { category: "chairs", categoryDir: "kresla", slug: legacyMap[m[1]], brand: "istok" };
  }

  // Кроватки
  m = url.match(/^child-beds\/(.+)$/);
  if (m) {
    const slug = CRIB_SLUG_MAP[m[1]] ?? m[1];
    return { category: "cribs", categoryDir: "krovatki", slug, brand: "elis" };
  }

  // Корпусная мебель: komody/komod-..., stoly/stol-..., stelazy/stelaz-..., shkafy/shkaf-...
  m = url.match(/^(komody|stoly|stelazy|shkafy)\/(.+)$/);
  if (m) {
    const cat = m[1];
    const rawSlug = m[2];
    const prefix = cat === "komody" ? "komod" : cat === "stoly" ? "stol" : cat === "stelazy" ? "stelaz" : "shkaf";
    const slug = shortenCabinetSlug(rawSlug, prefix);
    return { category: "cabinets", categoryDir: CABINET_SUBCATEGORY_MAP[cat], slug, brand: "istok" };
  }

  return null;
}

/* ---------- Парсинг HTML ---------- */

interface Extracted {
  title: string;
  ogDescription: string;
  ogImage: string;
  imageRefs: string[]; // относительные пути типа "images/tild5d3a-..._foo.png"
}

function extract(htmlPath: string): Extracted {
  const html = fs.readFileSync(htmlPath, "utf8");
  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() ?? "";
  const ogImage = $('meta[property="og:image"]').attr("content")?.trim() ?? "";

  const refs = new Set<string>();
  $("img").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src") || $el.attr("data-original") || "";
    if (src.startsWith("images/") && !src.includes("favicon") && !src.includes("apple-touch")) {
      refs.add(src);
    }
  });
  // Также подхватываем data-thumbs у Tilda-галерей
  $("[data-thumbs]").each((_, el) => {
    const t = $(el).attr("data-thumbs") || "";
    const matches = t.match(/images\/[^"',]+\.(?:jpg|jpeg|png|webp|gif)/gi);
    if (matches) matches.forEach((u) => refs.add(u));
  });

  return { title, ogDescription, ogImage, imageRefs: [...refs] };
}

/* ---------- Cribs PDF-данные ---------- */

interface CribDef {
  name: string;
  modelNumber: string;
  bedSizes: { length: number; width: number }[];
  totalSizes: { length: number; width: number; height: number }[];
  weight: number;
  materials: string[];
  options: string[];
  note?: string;
}

const CRIB_DATA: Record<string, CribDef> = {
  nikol: {
    name: "Николь",
    modelNumber: "Элис-1",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 700 },
      { length: 1880, width: 875, height: 700 },
      { length: 2080, width: 975, height: 700 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "Гипоаллергенное лакокрасочное покрытие"],
    options: [
      "Борт устанавливается с любой стороны",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
      "Бортик-накладка",
      "Возможность трансформации в двухъярусную / кровать-чердак",
    ],
  },
  melita: {
    name: "Мелита",
    modelNumber: "Элис-2",
    bedSizes: [{ length: 1900, width: 900 }, { length: 2000, width: 900 }],
    totalSizes: [
      { length: 1980, width: 975, height: 620 },
      { length: 2100, width: 975, height: 1060 },
    ],
    weight: 50,
    materials: ["Натуральное дерево (берёза)", "Гипоаллергенное лакокрасочное покрытие"],
    options: [
      "Двухъярусная / две отдельные односпальные кровати",
      "Лестница устанавливается на правую или левую сторону",
      "Высота бортов второго этажа: 370 мм от настила до края стенки",
      "Выдвижные ящики",
    ],
    note: "Двухъярусная конструкция. Кровать №2 (нижняя): 1980×975×620 мм. Двухъярусная сборка: 2100×975×1060 мм.",
  },
  paulina: {
    name: "Паулина",
    modelNumber: "Элис-3",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 690 },
      { length: 1880, width: 875, height: 690 },
      { length: 2080, width: 975, height: 690 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие"],
    options: ["Борт устанавливается с любой стороны", "Выдвижные ящики", "Дополнительное выдвижное спальное место"],
  },
  elza: {
    name: "Эльза",
    modelNumber: "Элис-4",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 710 },
      { length: 1880, width: 875, height: 710 },
      { length: 2080, width: 975, height: 710 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие", "Обработка маслом"],
    options: [
      "Борт устанавливается с любой стороны",
      "Накладки на спинке покрыты маслом или покрашены в основной цвет",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
      "Бортик-накладка",
    ],
  },
  dominika: {
    name: "Доминика",
    modelNumber: "Элис-5",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 720 },
      { length: 1880, width: 875, height: 720 },
      { length: 2080, width: 975, height: 720 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие", "Обработка маслом"],
    options: [
      "Борт устанавливается с любой стороны",
      "Накладки на спинке покрыты маслом или покрашены в основной цвет",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
      "Бортик-накладка",
    ],
  },
  afina: {
    name: "Афина",
    modelNumber: "Элис-6",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 720 },
      { length: 1880, width: 875, height: 720 },
      { length: 2080, width: 975, height: 720 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие", "Обработка маслом"],
    options: [
      "Накладки на спинке покрыты маслом или покрашены в основной цвет",
      "Бортик-накладка с любой стороны",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
    ],
  },
  yasmina: {
    name: "Ясмина",
    modelNumber: "Элис-7",
    bedSizes: [
      { length: 1600, width: 800 }, { length: 1800, width: 800 }, { length: 2000, width: 900 },
    ],
    totalSizes: [
      { length: 1680, width: 875, height: 695 },
      { length: 1880, width: 875, height: 695 },
      { length: 2080, width: 975, height: 695 },
    ],
    weight: 23,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие", "Обработка маслом"],
    options: [
      "Борт устанавливается с любой стороны",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
    ],
  },
  mishel: {
    name: "Мишель",
    modelNumber: "Элис-8",
    bedSizes: [{ length: 2000, width: 900 }, { length: 2000, width: 1400 }],
    totalSizes: [{ length: 2080, width: 1475, height: 1540 }],
    weight: 48,
    materials: ["Натуральное дерево (берёза)", "MDF", "Гипоаллергенное лакокрасочное покрытие"],
    options: [
      "Двухъярусная / две отдельные кровати",
      "Расстояние между ярусами: 800 мм",
      "Лестница устанавливается на правую или левую сторону",
      "Выдвижные ящики",
      "Дополнительное выдвижное спальное место",
    ],
    note: "Двухъярусная конструкция: верхнее место 2000×900, нижнее 2000×1400.",
  },
};

/* ---------- Копирование изображений ---------- */

function copyImagesForProduct(refs: string[], outDir: string): string[] {
  fs.mkdirSync(outDir, { recursive: true });
  const written: string[] = [];

  // Чистим старые файлы
  for (const f of fs.readdirSync(outDir)) fs.unlinkSync(path.join(outDir, f));

  // Дедуплицируем по basename и фильтруем только реальные продуктовые фото
  const seen = new Set<string>();
  const filtered = refs.filter((ref) => {
    const base = path.basename(ref).toLowerCase();
    if (seen.has(base)) return false;
    seen.add(base);
    // Отсеиваем явно служебные файлы по характерным префиксам/именам
    if (base.includes("favicon")) return false;
    if (base.includes("apple-touch")) return false;
    if (base.includes("android-chrome")) return false;
    if (base.includes("logo")) return false;
    return true;
  });

  let i = 1;
  for (const ref of filtered) {
    const src = path.join(TILDA, ref);
    if (!fs.existsSync(src)) continue;
    const ext = path.extname(ref).toLowerCase() || ".png";
    const destName = `${String(i).padStart(2, "0")}${ext}`;
    fs.copyFileSync(src, path.join(outDir, destName));
    written.push(destName);
    i++;
    if (i > 12) break; // ограничиваем 12 фото на товар
  }
  return written;
}

/* ---------- Генерация MDX ---------- */

const TODAY = new Date().toISOString().slice(0, 10);

function yamlList(items: string[]): string {
  return items.length === 0 ? "[]" : "\n" + items.map((s) => `  - ${JSON.stringify(s)}`).join("\n");
}

function buildCribMdx(route: ProductRoute, def: CribDef, gallery: string[]): string {
  const sizes = def.bedSizes.map((bs, i) => {
    const ts = def.totalSizes[i] ?? def.totalSizes[def.totalSizes.length - 1];
    const slug = `${bs.length}x${bs.width}`;
    return `  - slug: ${slug}\n    bedDimensions: { length: ${bs.length}, width: ${bs.width} }\n    totalDimensions: { length: ${ts.length}, width: ${ts.width}, height: ${ts.height} }`;
  }).join("\n");

  const galleryYaml = gallery
    .map((f) => `  - { src: "/images/${route.categoryDir}/${route.slug}/${f}", alt: "${def.name} — ${def.modelNumber}", type: "photo" }`)
    .join("\n");

  const heroFile = gallery[0] ?? "";
  const heroLine = heroFile
    ? `hero: { src: "/images/${route.categoryDir}/${route.slug}/${heroFile}", alt: "${def.name} — ${def.modelNumber}", type: "photo" }`
    : `hero: { src: "/images/${route.categoryDir}/${route.slug}/placeholder.png", alt: "${def.name}", type: "photo" }`;

  const summary =
    def.note ??
    `Детская кроватка «${def.name}» из натуральной берёзы. Гипоаллергенное лакокрасочное покрытие. ${def.bedSizes.length} ${def.bedSizes.length === 1 ? "размер" : "размера(ов)"} спального места.`;

  const fm = `---
slug: ${route.slug}
category: ${route.category}
brand: ${route.brand}
name: ${JSON.stringify(def.name)}
summary: ${JSON.stringify(summary)}
sizes:
${sizes}
weight: ${def.weight}
materials:${yamlList(def.materials)}
colors: []
options:${yamlList(def.options)}
gallery:
${galleryYaml || `  - { src: "/images/${route.categoryDir}/${route.slug}/placeholder.png", alt: "${def.name}", type: "photo" }`}
${heroLine}
published: true
indexable: true
updatedAt: "${TODAY}"
---`;

  const body = `
# ${def.name} (${def.modelNumber})

${summary}

## Особенности

${def.options.map((o) => `- ${o}`).join("\n")}

## Материалы

${def.materials.map((m) => `- ${m}`).join("\n")}

> Контент сгенерирован автоматически из PDF-каталога ELIS (см. \`docs/95 - Attachments/Обновленный каталог.2.pdf\`). Текст подлежит ревью маркетинг-командой перед публикацией.
`;

  return fm + "\n" + body;
}

function buildStubMdx(route: ProductRoute, extracted: Extracted, gallery: string[]): string {
  const slug = route.slug;
  const name = extracted.title || slug;
  const heroFile = gallery[0] ?? "";
  const galleryYaml = gallery.length > 0
    ? gallery.map((f) => `  - { src: "/images/${route.categoryDir}/${slug}/${f}", alt: "${name}", type: "photo" }`).join("\n")
    : `  - { src: "/images/${route.categoryDir}/${slug}/placeholder.png", alt: "${name}", type: "photo" }`;
  const heroLine = heroFile
    ? `hero: { src: "/images/${route.categoryDir}/${slug}/${heroFile}", alt: "${name}", type: "photo" }`
    : `hero: { src: "/images/${route.categoryDir}/${slug}/placeholder.png", alt: "${name}", type: "photo" }`;

  const fm = `---
slug: ${slug}
category: ${route.category}
brand: ${route.brand}
name: ${JSON.stringify(name)}
summary: ${JSON.stringify(`${name} — ${route.category === "chairs" ? "театральное кресло" : "корпусная мебель"} от фабрики «Исток-мебель»`)}
sizes:
  - slug: standard
    totalDimensions: { length: 1, width: 1, height: 1 }
materials: []
colors: []
options: []
gallery:
${galleryYaml}
${heroLine}
published: false
indexable: false
updatedAt: "${TODAY}"
---`;

  const body = `
# ${name}

> **TODO.** Контент-страница сгенерирована из Tilda-экспорта. Tilda не содержит описаний
> моделей — только фото и название. Реальные характеристики (размеры, материалы, цена,
> особенности) запрашиваем у клиента и заполняем здесь, после чего меняем
> \`published: true\` и \`sizes\` на актуальные значения.

Источник: \`tilda-old/istokmebel/${extracted.ogImage ? extracted.ogImage : ""}\`.
`;

  return fm + "\n" + body;
}

/* ---------- Main ---------- */

function main() {
  const pageMaps = parseHtaccess();
  let processed = 0;
  let skipped = 0;
  const summary: string[] = [];

  for (const pm of pageMaps) {
    const route = routeForUrl(pm.url);
    if (!route) {
      skipped++;
      continue;
    }
    const htmlPath = path.join(TILDA, pm.page);
    if (!fs.existsSync(htmlPath)) {
      skipped++;
      continue;
    }

    const extracted = extract(htmlPath);
    const imagesOutDir = path.join(PUBLIC_IMG, route.categoryDir, route.slug);
    const gallery = copyImagesForProduct(extracted.imageRefs, imagesOutDir);

    let mdx: string;
    if (route.category === "cribs" && CRIB_DATA[route.slug]) {
      mdx = buildCribMdx(route, CRIB_DATA[route.slug], gallery);
    } else {
      mdx = buildStubMdx(route, extracted, gallery);
    }

    const mdxDir = path.join(CONTENT, "products", route.category);
    fs.mkdirSync(mdxDir, { recursive: true });
    const mdxPath = path.join(mdxDir, `${route.slug}.mdx`);
    fs.writeFileSync(mdxPath, mdx, "utf8");

    processed++;
    summary.push(`  ${route.category}/${route.slug}  ${gallery.length} img  ${path.relative(REPO_ROOT, mdxPath)}`);
  }

  console.log(`\nseed-from-tilda: processed ${processed}, skipped ${skipped}.\n`);
  console.log(summary.join("\n"));
}

main();
