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

export const updateUserSchema = z.object({
  name: z.string().max(101),
  email: z.string().email(),
  phone: z.string().min(10),
}).partial();

export const updateUserPassword = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string()
}).required()
  .refine((data) => Object.is(data.newPassword, data.confirmPassword), {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
