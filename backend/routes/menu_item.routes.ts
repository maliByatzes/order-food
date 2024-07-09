import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createMenuItemSchema, updateMenuItemSchema } from "../schemas/menu_item.schema";
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

menuItemRoutes.get("/", async (c) => {
  const categoryName = c.req.query("categoryName");

  try {
    if (!categoryName) {
      return c.json({ error: "Missing category name" }, 400);
    }

    const menuItems = await MenuItem.find({ category: categoryName });
    return c.json(menuItems, 200);
  } catch (err: any) {
    console.error(`Error in get menu items by category name handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

menuItemRoutes.put(
  "/:id",
  protectRoute,
  requireAdmin,
  zValidator("json", updateMenuItemSchema),
  async (c) => {
    const menuItemId = c.req.param("id");
    const menuItemForm = c.req.valid("json");

    try {
      if (menuItemId.length !== 24) {
        return c.json({ error: "Invalid menu item id" }, 400);
      }

      const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, menuItemForm, { new: true });
      if (!updatedMenuItem) {
        return c.notFound();
      }

      return c.json(updatedMenuItem, 200);
    } catch (err: any) {
      console.error(`Error in update one menu item handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

menuItemRoutes.delete(
  "/:id",
  protectRoute,
  requireAdmin,
  async (c) => {
    const menuItemId = c.req.param("id");

    try {
      if (menuItemId.length !== 24) {
        return c.json({ error: "Invalid menu item id" }, 400);
      }

      const deleteResult = await MenuItem.deleteOne({ _id: menuItemId });
      if (deleteResult.deletedCount !== 1) {
        return c.notFound();
      }

      return c.json({ message: "success" }, 200);
    } catch (err: any) {
      console.error(`Error in delete one meu item handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

export default menuItemRoutes;
