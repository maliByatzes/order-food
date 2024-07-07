import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserSchema } from "../schemas/user.schema";
import User from "../models/user.model";
import * as argon2 from "argon2";
import { generateAndSetAccessToken, generateAndSetRefreshToken } from "../utils/generateAndSetTokens";

const authRoutes = new Hono();

// REGISTER
authRoutes.post("/register", zValidator("json", createUserSchema), async (c) => {
  const formUser = c.req.valid("json");

  try {
    const existingEmail = await User.findOne({ email: formUser.email });
    if (existingEmail) {
      return c.json({ error: "Email already exists" }, 400);
    }

    const existingPhone = await User.findOne({ phone: formUser.phone });
    if (existingPhone) {
      return c.json({ error: "Phone already exists" }, 400);
    }

    const hashedPassword = await argon2.hash(formUser.password);

    const newUser = new User({
      name: formUser.name,
      email: formUser.email,
      password: hashedPassword,
      phone: formUser.phone,
    });

    if (newUser) {
      await newUser.save();

      await Promise.all([
        generateAndSetAccessToken(newUser._id, c),
        generateAndSetRefreshToken(newUser._id, c)
      ]);

      return c.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }, 201);
    } else {
      return c.json({ error: "Invalid form data" }, 400);
    }
  } catch (err: any) {
    console.error(`Error in register user handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// LOGIN
authRoutes.post("/login", (c) => {
  return c.text("Login user handler");
});

// LOGOUT
authRoutes.post("/logout", (c) => {
  return c.text("Logout user handler");
});

export default authRoutes;
