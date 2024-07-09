import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";

const menuItemRoutes = new Hono();

menuItemRoutes.post(
  "/",
  protectRoute,
  requireAdmin,
  async (c) => {
    return c.text("Create menu item route");
  });

menuItemRoutes.put(
  "/:id",
  protectRoute,
  requireAdmin,
  async (c) => {
    return c.text("update one menu item route");
  });

menuItemRoutes.delete(
  "/:id",
  protectRoute,
  requireAdmin,
  async (c) => {
    return c.text("delete one menu item route");
  });

export default menuItemRoutes;
