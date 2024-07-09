import { Hono } from "hono";
import type { Variables } from "./address.routes";

const orderRoutes = new Hono<{ Variables: Variables }>();

// NOTE: will be much easier to integrate with frontend, whenever that is
/*
orderRoutes.post(
  "/:restaurantId",
  protectRoute,
  zValidator("json", createOrderSchema),
  async (c) => {
    const user = c.get("user");
    const orderForm = c.req.valid("json");
    const restaurantId = c.req.param("restaurantId");

    try {
      const uniqueOrderFormItems = [... new Set(orderForm.items)];

      if (restaurantId.length !== 24) {
        return c.json({ error: "Invalid restaurant id" }, 400);
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return c.notFound();
      }

      let orderTotal = 0;

      for (const menuItemId of uniqueOrderFormItems) {
        if (menuItemId.length !== 24) {
          return c.json({ error: "Invalid menu item id" }, 400);
        }

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
          return c.notFound();
        }

        orderTotal += parseFloat(menuItem.price.toString());
      }

      const newOrder = new Order({
        userId: user._id,
        restaurantId: restaurant._id,
        orderTotal,
        deliveryStatus: "Awaiting Payment"
      });

      if (newOrder) {
        await newOrder.save();
        return c.json({ message: "success", clientSecret: paymentIntent.client_secret }, 200);
      } else {
        return c.json({ error: "Invalid data" }, 400);
      }
    } catch (err: any) {
      console.error(`Error in the create post handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });*/

export default orderRoutes;
