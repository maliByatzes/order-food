import { z } from "zod";

const ROLES = ["user", "driver"] as const;

export const createUserSchema = z.object({
  name: z.string().max(101),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  phone: z.string().min(10),
  role: z.enum(ROLES),
}).required()
.refine((data) => Object.is(data.password, data.confirmPassword), {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/*
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
*/
