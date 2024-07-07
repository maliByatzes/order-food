import { Hono } from "hono";
import { logger } from "hono/logger";
import authRoutes from "./routes/auth.routes";

const app = new Hono();

app.use("*", logger())

app.get('/healthchecker', (c) => {
  return c.json({ "message": "Welcome to order-food service" });
});

const apiRoutes = app.basePath("/api/v1").route("/auth", authRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
