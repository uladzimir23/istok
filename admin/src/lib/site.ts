// Публичный URL сайта (для preview-ссылок). Локально :3000, на проде —
// VITE_SITE_URL = https://new.istokmebel.by.
const SITE = import.meta.env.VITE_SITE_URL ?? "http://localhost:3000";

// Корпусная подкатегория выводится из пути hero (как в web loader).
const SUB = /\/images\/(komody|stoly|stelazhi|shkafy)\//;

export function productUrl(
  category: "chairs" | "cabinets" | "cribs",
  slug: string,
  heroSrc: string,
): string | null {
  if (category === "chairs") return `${SITE}/kresla/${slug}/`;
  if (category === "cribs") return `${SITE}/krovatki/${slug}/`;
  if (category === "cabinets") {
    const m = heroSrc.match(SUB);
    return m ? `${SITE}/${m[1]}/${slug}/` : null;
  }
  return null;
}

export const projectsUrl = `${SITE}/proekty/`;
