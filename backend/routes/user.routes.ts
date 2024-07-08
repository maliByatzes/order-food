import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import type { Variables } from "./address.routes";
import User from "../models/user.model";
import { zValidator } from "@hono/zod-validator";
import { updateUserPassword, updateUserSchema } from "../schemas/user.schema";
import * as argon2 from "argon2";

const userRoutes = new Hono<{ Variables: Variables }>();

userRoutes.get("/me", protectRoute, async (c) => {
  const userId = c.get("user")._id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return c.notFound();
    }

    return c.json(user, 200);
  } catch (err: any) {
    console.error(`Error in get me handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

userRoutes.put("/update-user", protectRoute, zValidator("json", updateUserSchema), async (c) => {
  const userId = c.get("user")._id;
  const userForm = c.req.valid("json");

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userForm, { new: true }).select("-password");
    if (!updatedUser) {
      return c.notFound();
    }

    return c.json(updatedUser, 200);
  } catch (err: any) {
    console.error(`Error in update user handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

userRoutes.put("/update-password", protectRoute, zValidator("json", updateUserPassword), async (c) => {
  const userId = c.get("user")._id;
  const userForm = c.req.valid("json");

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return c.notFound();
    }

    const isMatch = await argon2.verify(existingUser.password, userForm.oldPassword);
    if (!isMatch) {
      return c.json({ error: "Invalid old password" }, 401);
    }

    const hashedPassword = await argon2.hash(userForm.newPassword);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return c.json({ message: "success" }, 200);
  } catch (err: any) {
    console.error(`Error in update password handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default userRoutes;
