import { z } from "zod";

export const LeadInput = z.object({
  name: z.string().min(2, "Укажите ваше имя"),
  phone: z
    .string()
    .min(7, "Укажите телефон")
    .regex(/^[+\d\s()\-]+$/, "Только цифры и + ( ) -"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  productSlug: z.string().optional(),
  source: z.string().optional(),
  honey: z.string().max(0).optional().or(z.literal("")),
});
export type LeadInput = z.infer<typeof LeadInput>;
