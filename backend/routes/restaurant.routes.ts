import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createRestaurantSchema, updateRestaurantSchema } from "../schemas/restaurant.schema";
import Restaurant from "../models/restaurant.model";

const restaurantRoutes = new Hono();

restaurantRoutes.post(
  "/",
  protectRoute,
  requireAdmin,
  zValidator("json", createRestaurantSchema),
  async (c) => {
    try {
      const restForm = c.req.valid("json");

      const newRestaurant = new Restaurant({
        name: restForm.name,
        address: restForm.address,
        phone: restForm.phone
      });

      if (newRestaurant) {
        await newRestaurant.save();
        return c.json(newRestaurant, 201);
      } else {
        return c.json({ error: "Invalid data" }, 400);
      }
    } catch (err: any) {
      console.error(`Error in create restaurant handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

restaurantRoutes.get("/", async (c) => {
  try {
    const restaurants = await Restaurant.find();
    return c.json(restaurants, 200);
  } catch (err: any) {
    console.error(`Error in get all restaurants handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

restaurantRoutes.get("/:id", async (c) => {
  const restaurantId = c.req.param("id");

  try {
    if (restaurantId.length !== 24) {
      return c.json({ error: "Invalid restaurant id" }, 400);
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return c.notFound();
    }

    return c.json(restaurant, 200);
  } catch (err: any) {
    console.error(`Error in get one restaurant handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

restaurantRoutes.put(
  "/:id",
  protectRoute,
  requireAdmin,
  zValidator("json", updateRestaurantSchema),
  async (c) => {
    const restaurantId = c.req.param("id");
    const restForm = c.req.valid("json");

    try {
      if (restaurantId.length !== 24) {
        return c.json({ error: "Invalid restaurant id" }, 400);
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, restForm, { new: true });
      if (!updatedRestaurant) {
        return c.notFound();
      }

      return c.json(updatedRestaurant, 200);
    } catch (err: any) {
      console.error(`Error in update one restaurant handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

restaurantRoutes.delete("/:id", protectRoute, requireAdmin, async (c) => {
  const restaurantId = c.req.param("id");

  try {
    if (restaurantId.length !== 24) {
      return c.json({ error: "Invalid restaurant id" }, 400);
    }

    const deleteResult = await Restaurant.deleteOne({ _id: restaurantId });
    if (deleteResult.deletedCount !== 1) {
      return c.notFound();
    }

    return c.json({ message: "success" }, 200);
  } catch (err: any) {
    console.error(`Error in delete one restaurant handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default restaurantRoutes;
