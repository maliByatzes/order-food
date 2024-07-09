import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createMenuItemSchema } from "../schemas/menu_item.schema";
import MenuItem from "../models/menu_item.model";

const menuItemRoutes = new Hono();

menuItemRoutes.post(
  "/",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuItemSchema),
  async (c) => {
    const menuItemForm = c.req.valid("json");

    try {
      const image = `https://placehold.co/400x400/gray/black.png?text=${menuItemForm.name}&font=raleway`;

      const newMenuItem = new MenuItem({
        name: menuItemForm.name,
        price: menuItemForm.price,
        description: menuItemForm.description,
        category: menuItemForm.category,
        image
      });

      if (newMenuItem) {
        await newMenuItem.save();
        return c.json(newMenuItem, 201);
      } else {
        return c.json({ error: "Invalid data" }, 400);
      }
    } catch (err: any) {
      console.error(`Error in create menu item handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

menuItemRoutes.post(
  "/many",
  protectRoute,
  requireAdmin,
  zValidator("json", createMenuItemSchema.array()),
  async (c) => {
    const menuItemForm = c.req.valid("json");
    const savedItems = [];

    try {
      for (const menuItem of menuItemForm) {
        const image = `https://placehold.co/400x400/gray/black.png?text=${menuItem.name}&font=raleway`;
        const newMenuItem = new MenuItem({
          name: menuItem.name,
          price: menuItem.price,
          description: menuItem.description,
          category: menuItem.category,
          image,
        });

        if (newMenuItem) {
          await newMenuItem.save();
          savedItems.push(newMenuItem);
        } else {
          return c.json({ error: "Invalid data for menu item: " + menuItem.name }, 400);
        }
      }

      return c.json({ menuItems: savedItems }, 201);
    } catch (err: any) {
      console.error(`Error in create many menu items handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
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
