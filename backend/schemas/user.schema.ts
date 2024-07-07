import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string().max(101),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    phone: z.string().min(10),
  }).refine((data) => Object.is(data.password, data.confirmPassword), {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
