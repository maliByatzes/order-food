import mongoose from "mongoose";
import type { IMenuItem } from "./menu_item.model";

export interface IMenu {
  _id: mongoose.Types.ObjectId,
  restaurantId: mongoose.Types.ObjectId,
  items: IMenuItem[],
  createdAt: Date,
  updatedAt: Date
};

const menuSchema = new mongoose.Schema<IMenu>({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem"
    }
  ]
}, { timestamps: true });

const Menu = mongoose.model<IMenu>("Menu", menuSchema);

export default Menu;
