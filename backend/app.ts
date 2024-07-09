import { Hono } from "hono";
import { logger } from "hono/logger";
import authRoutes from "./routes/auth.routes";
import addressRoutes from "./routes/address.routes";
import userRoutes from "./routes/user.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import menuItemRoutes from "./routes/menu_item.routes";
import menuRoutes from "./routes/menu.routes";

const app = new Hono();

app.use("*", logger())

app.get('/healthchecker', (c) => {
  return c.json({ "message": "Welcome to order-food service" });
});

const apiRoutes = app.basePath("/api/v1")
  .route("/auth", authRoutes)
  .route("/users", userRoutes)
  .route("/address", addressRoutes)
  .route("/restaurants", restaurantRoutes)
  .route("/menu-items", menuItemRoutes)
  .route("/menu", menuRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
