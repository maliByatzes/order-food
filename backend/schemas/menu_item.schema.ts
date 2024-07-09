import { z } from "zod";
import { CATEGORIES } from "../utils/categories";

export const createMenuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.enum(CATEGORIES),
  image: z.string(),
  availability: z.boolean()
}).required({
  name: true,
  price: true,
  category: true
}).partial({
  description: true,
  image: true
});

export const updateMenuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.enum(CATEGORIES),
  image: z.string(),
  availability: z.boolean()
}).partial();
