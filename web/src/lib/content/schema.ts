/**
 * Zod-схемы для контент-as-code (ADR-005).
 *
 * Источник правды для всех товаров и проектов сайта `istokmebel.by`.
 * MDX-файлы в `content/products/<category>/<sku>.mdx` и `content/projects/*.mdx`
 * валидируются по этим схемам на билде Next.js. Кривой контент не уезжает в прод.
 *
 * Reference: ADR-005, docs/40 - Architecture/Карта URL.md.
 */

import { z } from "zod";

/* ----- Перечисления / таксономия ----- */

export const ProductCategory = z.enum([
  "chairs",   // театральные кресла
  "cabinets", // корпусная мебель (комоды/столы/стеллажи/шкафы)
  "cribs",    // детские кроватки ELIS
]);
export type ProductCategory = z.infer<typeof ProductCategory>;

export const Brand = z.enum([
  "istok", // головной бренд (для chairs + cabinets)
  "elis",  // суббренд ELIS-MEBEL Kids Beds (для cribs)
]);
export type Brand = z.infer<typeof Brand>;

/* ----- Атомарные структуры ----- */

/** Размер спального места (только длина × ширина — высоты у спального места нет). */
export const BedDimensions = z.object({
  length: z.number().int().positive(), // мм
  width: z.number().int().positive(),  // мм
});
export type BedDimensions = z.infer<typeof BedDimensions>;

/** Габариты товара (длина × ширина × высота). */
export const TotalDimensions = z.object({
  length: z.number().int().positive(), // мм
  width: z.number().int().positive(),  // мм
  height: z.number().int().positive(), // мм
});
export type TotalDimensions = z.infer<typeof TotalDimensions>;

export const ProductSize = z.object({
  /** Slug варианта размера, например `1600x800`. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  bedDimensions: BedDimensions.optional(), // размер спального места (для кроваток)
  totalDimensions: TotalDimensions, // габариты товара
});
export type ProductSize = z.infer<typeof ProductSize>;

export const MediaItem = z.object({
  src: z.string().min(1),
  alt: z.string(),
  type: z.enum(["photo", "render", "diagram"]).default("photo"),
});
export type MediaItem = z.infer<typeof MediaItem>;

/* ----- Главная схема товара ----- */

export const Product = z.object({
  /** Уникальный slug — становится URL `/<category-slug>/<slug>`. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: ProductCategory,
  brand: Brand,
  /** Имя для UI (русское). */
  name: z.string().min(1),
  /** Краткое описание для карточек / SEO description. */
  summary: z.string().max(155),
  /** Размеры (для кроваток — массив из 3 размеров; для других — массив из ≥1). */
  sizes: z.array(ProductSize).min(1),
  /** Вес в кг, если применимо. */
  weight: z.number().positive().optional(),
  /** Материалы (свободный список тегов). */
  materials: z.array(z.string()).default([]),
  /** Доступные цвета. */
  colors: z
    .array(z.object({ name: z.string(), hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }))
    .default([]),
  /** Опции/комплектации. */
  options: z.array(z.string()).default([]),
  /** Галерея (минимум 1). */
  gallery: z.array(MediaItem).min(1),
  /** Главное превью для каталога. */
  hero: MediaItem,
  /** Цена — отсутствует, если по запросу. */
  priceByn: z.number().int().positive().optional(),
  /** Опубликовано на сайте. */
  published: z.boolean().default(true),
  /** Показывать ли в индексе (sitemap, listings). */
  indexable: z.boolean().default(true),
  /** Когда последний раз правили. */
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Product = z.infer<typeof Product>;

/* ----- Кейс портфолио госзаказа ----- */

export const PortfolioProject = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  /** Тип объекта: дом культуры, школа, ВУЗ, концертный зал, ... */
  objectType: z.string(),
  /** Город / адрес объекта. */
  location: z.string(),
  /** Год реализации. */
  year: z.number().int().min(2000).max(2100),
  /** Что поставили (например, «460 кресел М3», «комплект мебели для библиотеки»). */
  delivered: z.string(),
  summary: z.string().max(280),
  body: z.string().optional(), // длинное описание (MDX-тело)
  gallery: z.array(MediaItem).default([]),
  hero: MediaItem,
  published: z.boolean().default(true),
});
export type PortfolioProject = z.infer<typeof PortfolioProject>;
