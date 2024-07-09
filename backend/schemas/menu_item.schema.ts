import { z } from "zod";
import { CATEGORIES } from "../utils/categories";

export const createMenuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.enum(CATEGORIES),
}).required({
  name: true,
  price: true,
  category: true
}).partial({
  description: true
});

export const updateMenuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.enum(CATEGORIES),
  availability: z.boolean()
}).partial();
