import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import User from "../models/user.model";
import * as argon2 from "argon2";
import { generateAndSetAccessToken, generateAndSetRefreshToken, verifyToken } from "../utils/generateAndSetTokens";
import { deleteCookie, getCookie } from "hono/cookie";

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
      role: formUser.role
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
        role: newUser.role,
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
authRoutes.post("/login", zValidator("json", loginUserSchema), async (c) => {
  const formUser = c.req.valid("json");

  try {
    const existingUser = await User.findOne({ email: formUser.email });
    if (!existingUser) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const isMatch = await argon2.verify(existingUser.password, formUser.password);
    if (!isMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    await Promise.all([
      generateAndSetAccessToken(existingUser._id, c),
      generateAndSetRefreshToken(existingUser._id, c)
    ]);

    return c.json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt
    }, 200);
  } catch (err: any) {
    console.error(`Error in login user handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// LOGOUT
authRoutes.post("/logout", (c) => {
  try {
    deleteCookie(c, "access_token");
    deleteCookie(c, "refresh_token");
    return c.json({ message: "Successful logout" }, 200);
  } catch (err: any) {
    console.error(`Error in logout user handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// REFRESH ACCESS TOKEN
authRoutes.post("/refresh-token", async (c) => {
  try {
    const refreshTokenCookie = getCookie(c, "refresh_token");
    if (!refreshTokenCookie) {
      return c.json({ error: "Unauthorized - No refresh token" }, 403);
    }

    const userId = await verifyToken(refreshTokenCookie);
    if (!userId) {
      return c.json({ error: "Unauthorized - Invalid refresh token" }, 403);
    }

    const user = await User.findById(userId);
    if (!user) {
      return c.json({ error: "Unauthorized - Invalid user" }, 403);
    }

    await generateAndSetAccessToken(user._id, c);

    return c.json({ message: "success" }, 200);
  } catch (err: any) {
    console.error(`Error in refresh token handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default authRoutes;
