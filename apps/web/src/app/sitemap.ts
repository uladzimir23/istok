import type { MetadataRoute } from "next";
import { getAllProducts, getCabinetSubCategory } from "@/entities/product";
import { SITE } from "@/shared/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const staticUrls = [
    "/",
    "/about/",
    "/contacts/",
    "/dostavka/",
    "/privacy/",
    "/krovatki/",
    "/kresla/",
    "/komody/",
    "/stoly/",
    "/stelazhi/",
    "/shkafy/",
    "/korpusnaya/",
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const }));

  const productUrls = getAllProducts()
    .filter((p) => p.indexable)
    .map((p) => {
      let href: string | null = null;
      if (p.category === "cribs") href = `/krovatki/${p.slug}/`;
      else if (p.category === "chairs") href = `/kresla/${p.slug}/`;
      else if (p.category === "cabinets") {
        const sub = getCabinetSubCategory(p);
        if (sub) href = `/${sub}/${p.slug}/`;
      }
      return href ? { url: `${base}${href}`, lastModified: p.updatedAt } : null;
    })
    .filter((u): u is { url: string; lastModified: string } => u !== null);

  return [...staticUrls, ...productUrls];
}
