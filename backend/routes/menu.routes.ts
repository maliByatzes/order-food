import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createMenuSchema } from "../schemas/menu.schema";
import Menu from "../models/menu.model";
import MenuItem from "../models/menu_item.model";
import Restaurant from "../models/restaurant.model";

const menuRoutes = new Hono()

menuRoutes.post(
  "/:id",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuSchema),
  async (c) => {
    const menuForm = c.req.valid("json");
    const restaurantId = c.req.param("id");

    try {
      const uniqueMenuItems = [... new Set(menuForm.items)];

      for (const menuItemId of uniqueMenuItems) {
        if (menuItemId.length !== 24) {
          return c.json({ error: "Invalid menu item id" }, 400);
        }

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
          return c.json({ error: "Menu Item not found" }, 404);
        }
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return c.json({ error: "Restaurant not found" }, 404);
      }

      const newMenu = new Menu({
        restaurantId: restaurant._id,
        items: uniqueMenuItems
      });

      if (newMenu) {
        await newMenu.save();
        return c.json(newMenu, 201);
      } else {
        return c.json({ error: "Invalid data" }, 400);
      }
    } catch (err: any) {
      console.error(`Error in create menu handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

menuRoutes.get("/:id", async (c) => {
  const restaurantId = c.req.param("id");

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    const menus = await Menu.find({ restaurantId }).populate("items");
    return c.json(menus, 200);
  } catch (err: any) {
    console.error(`Error in get all menus of restaurant handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

menuRoutes.get("/:restaurantId/:id", async (c) => {
  const { restaurantId, id } = c.req.param();

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    const menu = await Menu.findOne({
      _id: id,
      restaurantId: restaurant._id
    }).populate("items");
    if (!menu) {
      return c.json({ error: "Menu not found" }, 404);
    }

    return c.json(menu, 200);
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
