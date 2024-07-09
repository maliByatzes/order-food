import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createMenuSchema } from "../schemas/menu.schema";

const menuRoutes = new Hono()

menuRoutes.post(
  "/",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuSchema),
  async (c) => {
    const menuForm = c.req.valid("json");

    try {
      return c.text("create menu handler");
    } catch (err: any) {
      console.error(`Error in create menu handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

menuRoutes.get("/:id", async (c) => {
  const restaurantId = c.req.param("id");

  try {
    return c.text("get all menus of restaurant handler");
  } catch (err: any) {
    console.error(`Error in get all menus of restaurant handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

menuRoutes.get("/:restaurantId/:id", async (c) => {
  const { restaurantId, id } = c.req.param();

  try {
    return c.text("get one menu of restaurant handler");
  } catch (err: any) {
    console.error(`Error in get one menu of restaurant handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

menuRoutes.put(
  "/remove/:restaurantId/:id",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuSchema),
  async (c) => {
    const { restaurantId, id } = c.req.param();

    try {
      return c.text("remove menu items from menu of restaurant handler");
    } catch (err: any) {
      console.error(`Error in remove menu items from menu of restaurant handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

menuRoutes.put(
  "/add/:restaurantId/:id",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuSchema),
  async (c) => {
    const { restaurantId, id } = c.req.param();

    try {
      return c.text("add menu items to menu of restaurant handler");
    } catch (err: any) {
      console.error(`Error add menu items in menu of restaurant handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

export default menuRoutes;
