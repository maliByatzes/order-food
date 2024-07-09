import mongoose from "mongoose";

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId,
  name: string,
  price: mongoose.Types.Decimal128,
  description?: string,
  category: string,
  image: string,
  availability: boolean,
  createdAt: Date,
  updatedAt: Date
};

const menuItemSchema = new mongoose.Schema<IMenuItem>({
  name: {
    type: String,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  description: { type: String },
  category: { type: String },
  image: { type: String },
  availability: { type: Boolean, default: true }
});

const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
