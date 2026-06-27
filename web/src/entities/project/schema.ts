import { z } from "zod";

// Проект портфолио госзаказа: реализованная поставка кресел в зал/аудиторию.
// Контент-as-code (ADR-005): content/projects/<slug>.mdx, фронтматтер по этой схеме.

export const ProjectMedia = z.object({
  src: z.string().min(1),
  alt: z.string(),
});
export type ProjectMedia = z.infer<typeof ProjectMedia>;

export const Project = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  // Порядковый номер для сортировки и витринного индекса «01»…«NN».
  order: z.number().int().positive(),
  // Тип объекта — заголовок карточки: «Дом культуры», «Концертный зал», «ВУЗ-аудитория».
  objectType: z.string().min(1),
  city: z.string().min(1),
  year: z.number().int().gte(2000).lte(2100),
  // Что поставлено — краткая строка под городом: модель / особенность посадки.
  delivered: z.string().min(1),
  hero: ProjectMedia,
  // Расширенное описание для страницы /proekty (опционально; тело MDX тоже доступно).
  summary: z.string().max(400).optional(),
  published: z.boolean().default(true),
});
export type Project = z.infer<typeof Project>;
