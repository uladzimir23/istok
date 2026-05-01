/**
 * Таксономия каталога — единый источник для навигации, breadcrumbs, sitemap.
 *
 * Slug-и совпадают с URL-картой (см. docs/40 - Architecture/Карта URL.md):
 * - `/kresla` — театральные кресла (Истоковский бренд)
 * - `/komody`, `/stoly`, `/stelazhi`, `/shkafy` — корпусная мебель
 * - `/krovatki` — детские кроватки (суббренд ELIS-MEBEL)
 */

import type { ProductCategory } from "./schema";

export type CategorySlug =
  | "kresla"
  | "komody"
  | "stoly"
  | "stelazhi"
  | "shkafy"
  | "krovatki";

export interface CategoryDef {
  slug: CategorySlug;
  /** К какой группе товаров относится (для фильтров и секционирования). */
  group: ProductCategory;
  /** Заголовок категории. */
  title: string;
  /** Короткое описание. */
  summary: string;
  /** Параграф для тематического хаба категории. */
  intro: string;
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    slug: "kresla",
    group: "chairs",
    title: "Театральные кресла",
    summary: "Кресла для залов, актовых, концертных и кинозалов",
    intro:
      "Серия моделей М1, М2, М3, М3-Г, М3-1 и ПМ-1. Производство в Березино, ~⅓ госзаказа на кресла для залов в Беларуси.",
  },
  {
    slug: "komody",
    group: "cabinets",
    title: "Комоды",
    summary: "Корпусные комоды для жилых и общественных помещений",
    intro: "Комоды с дверцами, ящиками и комбинированной начинкой.",
  },
  {
    slug: "stoly",
    group: "cabinets",
    title: "Столы",
    summary: "Письменные и универсальные столы с встроенными ящиками",
    intro: "Столы с дверцами, выдвижными ящиками, для дома и кабинетов.",
  },
  {
    slug: "stelazhi",
    group: "cabinets",
    title: "Стеллажи",
    summary: "Стеллажи открытого и комбинированного типа",
    intro: "Стеллажи с дверцами, нишами, выдвижными ящиками.",
  },
  {
    slug: "shkafy",
    group: "cabinets",
    title: "Шкафы",
    summary: "Шкафы 1-, 2- и 3-дверные, с ящиками и без",
    intro: "Шкафы для одежды и хозяйственного инвентаря.",
  },
  {
    slug: "krovatki",
    group: "cribs",
    title: "Детские кроватки ELIS-MEBEL",
    summary: "Линейка детских кроваток «Элис» — 8 моделей",
    intro:
      "Натуральная берёза + MDF, гипоаллергенное лакокрасочное покрытие. Три размера спального места: 1600×800, 1800×800, 2000×900 мм.",
  },
] as const;

export function findCategoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
