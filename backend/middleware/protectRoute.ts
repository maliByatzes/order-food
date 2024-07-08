import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifyToken } from "../utils/generateAndSetTokens";
import User from "../models/user.model";

export const protectRoute = createMiddleware(async (c: Context, next: Next) => {
  try {
    let access_token: string | undefined;

    const authHeader = c.req.header("authorization");
    const accessTokenCookie = getCookie(c, "access_token");

    if (authHeader && authHeader.startsWith("Bearer")) {
      access_token = authHeader.split(' ')[1];
    } else if (accessTokenCookie) {
      access_token = accessTokenCookie;
    } else {
      access_token = undefined;
    }

    if (!access_token) {
      return c.json({ error: "Unauthorized - No access token" }, 401);
    }

    const userId = await verifyToken(access_token);
    if (!userId) {
      return c.json({ error: "Unauthorized - Invalid access token" }, 401);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return c.json({ error: "Unauthorized - User not found" }, 404);
    }

    c.set("user", user);

    await next();
  } catch (err: any) {
    console.error(`Error in protectRoute: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
