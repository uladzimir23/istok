import { z } from "zod";

// PB-запись товара (поля, которые показываем/трогаем в MVP).
export interface ProductRecord {
  id: string;
  slug: string;
  category: "chairs" | "cabinets" | "cribs";
  brand: "istok" | "elis";
  name: string;
  summary: string;
  priceByn: number;
  published: boolean;
  materials: string[];
  options: string[];
  colors: { name: string; hex: string }[];
  hero: { src: string; alt: string };
}

export const CATEGORY_LABEL: Record<ProductRecord["category"], string> = {
  chairs: "Кресла",
  cabinets: "Корпусная",
  cribs: "Кроватки",
};

// Редактируемый в MVP сабсет (фото/размеры — позже). Валидация формы.
export const ProductEdit = z.object({
  name: z.string().min(1, "Укажите название"),
  category: z.enum(["chairs", "cabinets", "cribs"]),
  brand: z.enum(["istok", "elis"]),
  summary: z.string().max(220, "Не длиннее 220 символов"),
  priceByn: z.number().int().min(0, "Не меньше 0"),
  published: z.boolean(),
  materials: z.array(z.string()),
  options: z.array(z.string()),
});
export type ProductEditValues = z.infer<typeof ProductEdit>;

// ── Проекты портфолио ─────────────────────────────────────────────────────
export interface ProjectRecord {
  id: string;
  slug: string;
  order: number;
  objectType: string;
  city: string;
  year: number;
  delivered: string;
  summary: string;
  published: boolean;
  hero: { src: string; alt: string };
}

export const ProjectEdit = z.object({
  objectType: z.string().min(1, "Укажите тип объекта"),
  city: z.string().min(1, "Укажите город"),
  year: z.number().int().gte(2000).lte(2100),
  delivered: z.string().min(1, "Укажите, что поставлено"),
  summary: z.string().max(400, "Не длиннее 400 символов"),
  order: z.number().int().positive(),
  published: z.boolean(),
});
export type ProjectEditValues = z.infer<typeof ProjectEdit>;
