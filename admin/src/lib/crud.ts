import { pb } from "./pb";

// Транслит + slug из строки (для новых записей).
const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
export function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .split("")
    .map((c) => MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `item-${Date.now().toString(36)}`;
}

// Создаёт черновик товара (published:false) с минимальными плейсхолдерами под
// required-поля PB. Возвращает id для редиректа в редактор.
export async function createDraftProduct(): Promise<string> {
  const ts = Date.now().toString(36);
  const rec = await pb.collection("products").create({
    slug: `novyy-${ts}`,
    category: "chairs",
    brand: "istok",
    name: "Новый товар",
    summary: "",
    sizes: [{ slug: "standard", totalDimensions: { length: 1, width: 1, height: 1 } }],
    materials: [],
    colors: [],
    options: [],
    gallery: [{ src: "/images/placeholder.jpg", alt: "" }],
    hero: { src: "/images/placeholder.jpg", alt: "" },
    priceByn: 0,
    published: false,
    indexable: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
  return rec.id;
}

export async function createDraftProject(): Promise<string> {
  const ts = Date.now().toString(36);
  const rec = await pb.collection("projects").create({
    slug: `proekt-${ts}`,
    order: 99,
    objectType: "Новый проект",
    city: "—",
    year: new Date().getFullYear(),
    delivered: "—",
    hero: { src: "/images/placeholder.jpg", alt: "" },
    summary: "",
    published: false,
  });
  return rec.id;
}

export async function removeRecord(collection: string, id: string) {
  await pb.collection(collection).delete(id);
}
