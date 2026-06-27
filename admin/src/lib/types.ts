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
}

export const CATEGORY_LABEL: Record<ProductRecord["category"], string> = {
  chairs: "Кресла",
  cabinets: "Корпусная",
  cribs: "Кроватки",
};

// Редактируемый в MVP сабсет (фото/размеры — позже). Валидация формы.
export const ProductEdit = z.object({
  name: z.string().min(1, "Укажите название"),
  summary: z.string().max(220, "Не длиннее 220 символов"),
  priceByn: z.number().int().min(0, "Не меньше 0"),
  published: z.boolean(),
  materials: z.array(z.string()),
  options: z.array(z.string()),
});
export type ProductEditValues = z.infer<typeof ProductEdit>;
