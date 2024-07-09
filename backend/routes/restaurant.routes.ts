import { Hono } from "hono";
import { protectRoute, requireAdmin } from "../middleware/protectRoute";

const restaurantRoutes = new Hono();

restaurantRoutes.post("/", protectRoute, requireAdmin, async (c) => {
  return c.text("create restaurant route");
});

restaurantRoutes.get("/", async (c) => {
  return c.text("get all restaurants route");
});

restaurantRoutes.get("/:id", async (c) => {
  return c.text("get one restaurant route");
});

restaurantRoutes.put("/:id", protectRoute, requireAdmin, async (c) => {
  return c.text("update one restaurant route");
});

restaurantRoutes.delete("/:id", protectRoute, requireAdmin, async (c) => {
  return c.text("delete one restaurant route");
});

export default restaurantRoutes;
