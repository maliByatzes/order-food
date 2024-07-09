import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.string().array(),
});
