import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger())

app.get('/healthchecker', (c) => {
  return c.json({ "message": "Welcome to order-food service" });
});

export default app;
