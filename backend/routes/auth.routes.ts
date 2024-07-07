import { Hono } from "hono";

const authRoutes = new Hono();

// REGISTER
authRoutes.post("/register", (c) => {
  return c.text("Register user handler")
});

// LOGIN
authRoutes.post("/login", (c) => {
  return c.text("Login user handler");
});

// LOGOUT
authRoutes.post("/logout", (c) => {
  return c.text("Logout user handler");
});

export default authRoutes;
