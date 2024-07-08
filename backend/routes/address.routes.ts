import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import type { IUser } from "../models/user.model";
import { zValidator } from "@hono/zod-validator";
import { createAddressSchema } from "../schemas/address.schema";
import Address, { type IAddress } from "../models/address.model";

type Variables = {
  user: IUser
}

const addressRoutes = new Hono<{ Variables: Variables }>()

addressRoutes.post("/", protectRoute, zValidator("json", createAddressSchema), async (c) => {
  const addressForm = c.req.valid("json");
  const user = c.get("user");

  try {
    if (addressForm.isDefault) {
      const addresses: IAddress[] | null = await Address.find({ userId: user._id });
      if (addresses) {
        const address = addresses.find((address) => address.isDefault);
        if (address) {
          address.isDefault = false;
          await address.save();
        }
      }
    }

    const newAddress = new Address({
      userId: user._id,
      unitNumber: addressForm.unitNumber,
      addressLine1: addressForm.addressLine1,
      addressLine2: addressForm.addressLine2,
      postalCode: addressForm.postalCode,
      city: addressForm.city,
      country: addressForm.country,
      isDefault: addressForm.isDefault
    });

    if (newAddress) {
      await newAddress.save();

      c.status(201)
      return c.json(newAddress);
    } else {
      return c.json({ error: "Invalid address data" }, 400);
    }
  } catch (err: any) {
    console.error(`Error in create address handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
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
