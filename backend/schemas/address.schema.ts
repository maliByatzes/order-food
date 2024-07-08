import { z } from "zod";
import { COUNTRIES } from "../utils/countries";

export const createAddressSchema = z.object({
  unitNumber: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  postalCode: z.number(),
  city: z.string(),
  country: z.enum(COUNTRIES),
  isDefault: z.boolean()
}).required({
  addressLine1: true,
  postalCode: true,
  city: true,
  country: true
}).partial({
  unitNumber: true,
  addressLine2: true,
  isDefault: true
});

export const updateAddressSchema = z.object({
  unitNumber: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  postalCode: z.number(),
  city: z.string(),
  country: z.enum(COUNTRIES),
  isDefault: z.boolean()
}).partial();
