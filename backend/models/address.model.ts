import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId,
  unitNumber: string,
  addressLine1: string,
  addressLine2: string,
  postalCode: number,
  city: string,
  country: string,
  isDefault: boolean
};

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  unitNumber: {
    type: String
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String,
  },
  postalCode: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Address = mongoose.model<IAddress>("Address", addressSchema);

export default Address;
