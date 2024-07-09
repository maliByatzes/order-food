import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string()
}).required();

export const updateRestaurantSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string()
}).partial();
