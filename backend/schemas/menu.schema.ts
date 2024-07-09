import { z } from "zod";

export const createMenuSchema = z.object({
  items: z.string().array(),
}).required();
