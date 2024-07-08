import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import type { IUser } from "../models/user.model";

type Variables = {
  user: IUser
}

const addressRoutes = new Hono<{ Variables: Variables }>()

addressRoutes.post("/", protectRoute, (c) => {
  const user = c.get("user");
  console.log(user.email);
  return c.text("Create address handler");
});

addressRoutes.get("/", protectRoute, (c) => {
  return c.text("Get all addresses handler");
});

addressRoutes.get("/:id", protectRoute, (c) => {
  console.log(c.req.param("id"));
  return c.text("Get one address handler");
});

addressRoutes.put("/:id", protectRoute, (c) => {
  console.log(c.req.param("id"));
  return c.text("Update one address handler");
});

addressRoutes.delete("/:id", protectRoute, (c) => {
  console.log(c.req.param("id"));
  return c.text("Delete one address handler");
});

addressRoutes.delete("/", protectRoute, (c) => {
  return c.text("Delete all addresses handler");
});

export default addressRoutes;
