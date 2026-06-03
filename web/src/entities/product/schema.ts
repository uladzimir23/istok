import { z } from "zod";

export const ProductCategory = z.enum([
  "chairs",
  "cabinets",
  "cribs",
]);
export type ProductCategory = z.infer<typeof ProductCategory>;

export const Brand = z.enum(["istok", "elis"]);
export type Brand = z.infer<typeof Brand>;

export const BedDimensions = z.object({
  length: z.number().int().positive(),
  width: z.number().int().positive(),
});
export type BedDimensions = z.infer<typeof BedDimensions>;

export const TotalDimensions = z.object({
  length: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type TotalDimensions = z.infer<typeof TotalDimensions>;

export const ProductSize = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  bedDimensions: BedDimensions.optional(),
  totalDimensions: TotalDimensions,
});
export type ProductSize = z.infer<typeof ProductSize>;

export const MediaItem = z.object({
  src: z.string().min(1),
  alt: z.string(),
  type: z.enum(["photo", "render", "diagram"]).default("photo"),
});
export type MediaItem = z.infer<typeof MediaItem>;

export const Product = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: ProductCategory,
  brand: Brand,
  name: z.string().min(1),
  summary: z.string().max(220),
  sizes: z.array(ProductSize).min(1),
  weight: z.number().positive().optional(),
  materials: z.array(z.string()).default([]),
  colors: z
    .array(z.object({ name: z.string(), hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }))
    .default([]),
  options: z.array(z.string()).default([]),
  gallery: z.array(MediaItem).min(1),
  hero: MediaItem,
  priceByn: z.number().int().positive().optional(),
  published: z.boolean().default(true),
  indexable: z.boolean().default(true),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Product = z.infer<typeof Product>;
