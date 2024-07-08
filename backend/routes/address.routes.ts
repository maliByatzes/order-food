import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import type { IUser } from "../models/user.model";
import { zValidator } from "@hono/zod-validator";
import { createAddressSchema, updateAddressSchema } from "../schemas/address.schema";
import Address from "../models/address.model";

export type Variables = {
  user: IUser
}

const addressRoutes = new Hono<{ Variables: Variables }>()

addressRoutes.post("/", protectRoute, zValidator("json", createAddressSchema), async (c) => {
  const addressForm = c.req.valid("json");
  const user = c.get("user");

  try {
    if (addressForm.isDefault) {
      const addresses = await Address.find({ userId: user._id });
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

      return c.json(newAddress, 201);
    } else {
      return c.json({ error: "Invalid address data" }, 400);
    }
  } catch (err: any) {
    console.error(`Error in create address handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

addressRoutes.get("/", protectRoute, async (c) => {
  const user = c.get("user");

  try {
    const addresses = await Address.find({ userId: user._id });
    return c.json(addresses, 200);
  } catch (err: any) {
    console.error(`Error in get all addresses handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

addressRoutes.get("/:id", protectRoute, async (c) => {
  const addressId = c.req.param("id");
  const userId = c.get("user")._id;

  try {
    if (addressId.length !== 24) {
      return c.json({ error: "Invalid address id" }, 400);
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return c.notFound();
    }

    return c.json(address, 200);
  } catch (err: any) {
    console.error(`Error in get one address handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

addressRoutes.put("/:id", protectRoute, zValidator("json", updateAddressSchema), async (c) => {
  const addressId = c.req.param("id");
  const userId = c.get("user")._id;
  const addressForm = c.req.valid("json");

  try {
    if (addressId.length !== 24) {
      return c.json({ error: "Invalid address id" }, 400);
    }

    if (addressForm.isDefault) {
      const addresses = await Address.find({ userId });
      if (addresses) {
        const address = addresses.find((address) => address.isDefault);
        if (address) {
          address.isDefault = false;
          await address.save();
        }
      }
    }

    const updatedAddress = await Address.findByIdAndUpdate(addressId, addressForm, { new: true });
    if (!updatedAddress) {
      return c.notFound();
    }

    return c.json(updatedAddress, 200);
  } catch (err: any) {
    console.error(`Error in update one address handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

addressRoutes.delete("/:id", protectRoute, (c) => {
  console.log(c.req.param("id"));
  return c.text("Delete one address handler");
});

addressRoutes.delete("/", protectRoute, (c) => {
  return c.text("Delete all addresses handler");
});

export default addressRoutes;
