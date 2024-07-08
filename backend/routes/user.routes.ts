import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import type { Variables } from "./address.routes";
import User from "../models/user.model";

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

userRoutes.put("/update", protectRoute, async (c) => {
  return c.text("Update user handler");
});

export default userRoutes;
