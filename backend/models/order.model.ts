import mongoose from "mongoose";

export interface IOrder {
  _id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  restaurantId: mongoose.Types.ObjectId,
  orderTotal: mongoose.Types.Decimal128,
  deliveryStatus: string,
  driverId?: mongoose.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
};

const orderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  orderTotal: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  deliveryStatus: {
    type: String,
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
