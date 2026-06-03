import type { ProductCategory, Brand } from "@/entities/product";

export interface CategoryConfig {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  brand: Brand;
  source: { type: "category"; key: ProductCategory } | {
    type: "cabinet-sub";
    key: "komody" | "stoly" | "stelazhi" | "shkafy";
  };
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "krovatki",
    title: "Детские кроватки ELIS",
    eyebrow: "ELIS Kids Beds",
    description:
      "Подростковые и детские кроватки из натуральной берёзы. Гипоаллергенное покрытие, 3 размера спального места.",
    brand: "elis",
    source: { type: "category", key: "cribs" },
  },
  {
    slug: "kresla",
    title: "Театральные и зрительские кресла",
    eyebrow: "Кресла «Исток-мебель»",
    description:
      "Кресла для театров, домов культуры, концертных залов. Поставки по госзаказу с 2008 года.",
    brand: "istok",
    source: { type: "category", key: "chairs" },
  },
  {
    slug: "komody",
    title: "Комоды",
    eyebrow: "Корпусная мебель",
    description: "Комоды с ящиками и дверцами под индивидуальные размеры.",
    brand: "istok",
    source: { type: "cabinet-sub", key: "komody" },
  },
  {
    slug: "stoly",
    title: "Столы",
    eyebrow: "Корпусная мебель",
    description: "Обеденные, журнальные, рабочие столы.",
    brand: "istok",
    source: { type: "cabinet-sub", key: "stoly" },
  },
  {
    slug: "stelazhi",
    title: "Стеллажи",
    eyebrow: "Корпусная мебель",
    description: "Открытые стеллажи для гостиной, офиса, библиотек.",
    brand: "istok",
    source: { type: "cabinet-sub", key: "stelazhi" },
  },
  {
    slug: "shkafy",
    title: "Шкафы",
    eyebrow: "Корпусная мебель",
    description: "Распашные и купе. Под индивидуальные размеры.",
    brand: "istok",
    source: { type: "cabinet-sub", key: "shkafy" },
  },
];

export function getCategory(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
