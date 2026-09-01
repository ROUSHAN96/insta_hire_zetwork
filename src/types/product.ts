import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  price: z.number().int().positive(),
  image: z.string().url(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
});

export type Product = z.infer<typeof productSchema>;
